import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";

// Load .env from the server directory regardless of CWD
const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
);
config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();

const port = Number(process.env.PORT ?? 4000);
const clientOrigin =
  process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

const model =
  process.env.GEMINI_MODEL ?? "gemini-3.6-flash";

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "⚠  GEMINI_API_KEY is not set. Add it to server/.env before generating captions."
  );
}

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());

app.use(express.json({ limit: "1mb" }));

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    cb(
      null,
      ["image/jpeg", "image/png", "image/webp"].includes(
        file.mimetype
      )
    );
  },
});

const allowed = {
  style: [
    "Professional",
    "Instagram Fun",
    "Instagram Aesthetic",
    "Travel",
    "Funny",
    "Motivational",
    "Storytelling",
    "Minimal",
    "Gen Z / Trendy",
    "Custom",
  ],

  platform: [
    "LinkedIn",
    "Instagram",
    "Facebook",
    "X / Twitter",
    "Pinterest",
    "General",
  ],

  tone: [
    "Casual",
    "Professional",
    "Friendly",
    "Emotional",
    "Funny",
    "Confident",
  ],

  length: ["Short", "Medium", "Long"],

  emoji: ["None", "Few", "Creative"],

  hashtags: [
    "No hashtags",
    "Few hashtags",
    "Relevant hashtags",
  ],
} as const;

function oneOf<T extends readonly string[]>(
  value: unknown,
  values: T,
  fallback: T[number]
): T[number] {
  return typeof value === "string" && values.includes(value)
    ? (value as T[number])
    : fallback;
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post(
  "/api/generate-caption",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        error:
          "Please upload a JPG, PNG, or WEBP image.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          "AI generation is not configured on the server.",
      });
    }

    const style = oneOf(
      req.body.style,
      allowed.style,
      "Instagram Fun"
    );

    const platform = oneOf(
      req.body.platform,
      allowed.platform,
      "General"
    );

    const tone = oneOf(
      req.body.tone,
      allowed.tone,
      "Friendly"
    );

    const length = oneOf(
      req.body.length,
      allowed.length,
      "Medium"
    );

    const emoji = oneOf(
      req.body.emoji,
      allowed.emoji,
      "Few"
    );

    const hashtags = oneOf(
      req.body.hashtags,
      allowed.hashtags,
      "Few hashtags"
    );

    const count = Math.min(
      5,
      Math.max(1, Number(req.body.count) || 3)
    );

    const customInstructions =
      typeof req.body.customInstructions === "string"
        ? req.body.customInstructions.slice(0, 500)
        : "";

    const base64Image =
      req.file.buffer.toString("base64");

    const prompt = `
Analyze the uploaded image carefully and create ${count}
distinct social-media captions.

CAPTION STYLE: ${style}
PLATFORM: ${platform}
TONE: ${tone}
LENGTH: ${length}
EMOJI PREFERENCE: ${emoji}
HASHTAG PREFERENCE: ${hashtags}
CUSTOM INSTRUCTIONS: ${
      customInstructions || "None"
    }

Requirements:

- Carefully analyze the actual image.
- Describe what can reasonably be inferred from the image.
- Consider visible objects, people, activity, environment,
  mood, colors, composition and social-post context.
- Never invent names, exact locations, relationships,
  dates, events, brands, or facts that cannot be inferred.
- Make every caption natural and human-written.
- Do not make captions generic or robotic.
- Make each caption meaningfully different.
- Respect the requested platform and style.
- If hashtags are requested, return them separately.
- Do not add hashtags when "No hashtags" is selected.
- Follow the emoji preference.
- Return ONLY valid JSON.

Return exactly this structure:

{
  "captions": [
    {
      "text": "caption text",
      "hashtags": ["#example", "#example2"]
    }
  ]
}
`;

    try {
      let response;
      const retries = 3;
      let delayMs = 1200;

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          response = await gemini.models.generateContent({
            model,

            contents: [
              {
                role: "user",

                parts: [
                  {
                    text: prompt,
                  },

                  {
                    inlineData: {
                      mimeType: req.file.mimetype,
                      data: base64Image,
                    },
                  },
                ],
              },
            ],

            config: {
              responseMimeType: "application/json",

              responseSchema: {
                type: Type.OBJECT,

                properties: {
                  captions: {
                    type: Type.ARRAY,

                    items: {
                      type: Type.OBJECT,

                      properties: {
                        text: {
                          type: Type.STRING,
                        },

                        hashtags: {
                          type: Type.ARRAY,

                          items: {
                            type: Type.STRING,
                          },
                        },
                      },

                      required: [
                        "text",
                        "hashtags",
                      ],
                    },
                  },
                },

                required: ["captions"],
              },
            },
          });
          break;
        } catch (attemptError: unknown) {
          const errStr =
            attemptError instanceof Error
              ? attemptError.message
              : String(attemptError);
          const isTransient =
            errStr.includes("503") ||
            errStr.includes("429") ||
            errStr.includes("high demand") ||
            errStr.includes("UNAVAILABLE") ||
            errStr.includes("overloaded") ||
            errStr.includes("RESOURCE_EXHAUSTED");

          if (isTransient && attempt < retries) {
            console.warn(
              `⚠️ Gemini temporary overload/rate limit on attempt ${attempt}/${retries}. Retrying in ${delayMs}ms...`
            );
            await new Promise((res) =>
              setTimeout(res, delayMs)
            );
            delayMs *= 2;
            continue;
          }
          throw attemptError;
        }
      }

      const raw = response?.text?.trim();

      if (!raw) {
        return res.status(502).json({
          error:
            "The AI returned an empty response. Please try again.",
        });
      }

      const parsed = JSON.parse(raw) as {
        captions?: Array<{
          text?: string;
          hashtags?: string[];
        }>;
      };

      const captions = (parsed.captions ?? [])
        .filter(
          (caption) =>
            typeof caption.text === "string" &&
            caption.text.trim()
        )
        .slice(0, count)
        .map((caption) => ({
          text: caption.text!.trim(),

          hashtags: Array.isArray(
            caption.hashtags
          )
            ? caption.hashtags
                .filter(
                  (h) => typeof h === "string"
                )
                .slice(0, 12)
            : [],
        }));

      if (!captions.length) {
        return res.status(502).json({
          error:
            "The AI could not create captions for this image. Please try another image.",
        });
      }

      return res.json({
        captions,
      });
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : String(error);

      console.error(
        "\n❌ Gemini caption generation failed:"
      );
      console.error("   Message:", msg);
      if (error instanceof Error && error.stack) {
        console.error("   Stack:", error.stack);
      }

      const isHighDemand =
        msg.includes("503") ||
        msg.includes("high demand") ||
        msg.includes("UNAVAILABLE") ||
        msg.includes("overloaded") ||
        msg.includes("RESOURCE_EXHAUSTED");

      const userErrorMsg = isHighDemand
        ? "The Gemini AI service is currently experiencing temporary high demand. Please click 'Generate Captions' again in a moment."
        : "Caption generation failed. Please check your Gemini API key in server/.env and try again.";

      return res.status(502).json({
        error: userErrorMsg,
      });
    }
  }
);

app.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_FILE_SIZE"
    ) {
      return res.status(413).json({
        error:
          "Image must be 10 MB or smaller.",
      });
    }

    return res.status(400).json({
      error:
        "Invalid upload. Please use a JPG, PNG, or WEBP image.",
    });
  }
);

export default app;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(
      `CaptionCraft API running on http://localhost:${port}`
    );
  });
}