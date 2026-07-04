// Minimal i18n scaffold. Swap for react-i18next when needed.
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];
