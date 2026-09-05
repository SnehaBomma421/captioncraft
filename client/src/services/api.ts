import type { Settings, Caption } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function generateCaptions(file: File, settings: Settings): Promise<Caption[]> {
  const form = new FormData();
  form.append("image", file);
  form.append("style", settings.style);
  form.append("platform", settings.platform);
  form.append("count", String(settings.count));
  form.append("length", settings.length);
  form.append("tone", settings.tone);
  form.append("emoji", settings.emoji);
  form.append("hashtags", settings.hashtags);
  form.append("customInstructions", settings.customInstructions);

  const response = await fetch(`${API_URL}/api/generate-caption`, {
    method: "POST",
    body: form
  });

  let payload: { captions?: Caption[]; error?: string };
  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) throw new Error(payload.error || "Could not generate captions.");
  if (!payload.captions?.length) throw new Error("The AI returned no captions.");
  return payload.captions;
}
