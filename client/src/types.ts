export type CaptionStyle =
  | "Professional" | "Instagram Fun" | "Instagram Aesthetic" | "Travel"
  | "Funny" | "Motivational" | "Storytelling" | "Minimal" | "Gen Z / Trendy" | "Custom";

export type Platform = "LinkedIn" | "Instagram" | "Facebook" | "X / Twitter" | "Pinterest" | "General";
export type Tone = "Casual" | "Professional" | "Friendly" | "Emotional" | "Funny" | "Confident";
export type Length = "Short" | "Medium" | "Long";
export type Emoji = "None" | "Few" | "Creative";
export type Hashtags = "No hashtags" | "Few hashtags" | "Relevant hashtags";

export interface Caption {
  text: string;
  hashtags: string[];
}

export interface Settings {
  style: CaptionStyle;
  platform: Platform;
  count: 1 | 3 | 5;
  length: Length;
  tone: Tone;
  emoji: Emoji;
  hashtags: Hashtags;
  customInstructions: string;
}
