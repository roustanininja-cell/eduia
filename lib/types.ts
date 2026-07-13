export type SchoolLevel =
  | "CP"
  | "CE1"
  | "CE2"
  | "CM1"
  | "CM2"
  | "6e"
  | "5e"
  | "4e"
  | "3e"
  | "Tronc Commun"
  | "1ère Bac"
  | "2ème Bac";

export const SCHOOL_LEVELS: SchoolLevel[] = [
  "CP",
  "CE1",
  "CE2",
  "CM1",
  "CM2",
  "6e",
  "5e",
  "4e",
  "3e",
  "Tronc Commun",
  "1ère Bac",
  "2ème Bac"
];

export type AppLanguage = "fr" | "en" | "ar";

export const LANGUAGES: { code: AppLanguage; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" }
];

export type ResponseMode =
  | "courte"
  | "detaillee"
  | "etape_par_etape"
  | "demonstration"
  | "avec_exemples"
  | "resume";

export const RESPONSE_MODES: { value: ResponseMode; label: string }[] = [
  { value: "courte", label: "Réponse courte" },
  { value: "detaillee", label: "Réponse détaillée" },
  { value: "etape_par_etape", label: "Explication étape par étape" },
  { value: "demonstration", label: "Démonstration complète" },
  { value: "avec_exemples", label: "Avec exemples" },
  { value: "resume", label: "Résumé" }
];

export interface Attachment {
  id: string;
  type: "image" | "pdf";
  name: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  level: SchoolLevel;
  language: AppLanguage;
  responseMode: ResponseMode;
  theme: "light" | "dark" | "system";
  voiceReadingEnabled: boolean;
  fontSize: "sm" | "md" | "lg";
  onboardingComplete: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  level: "6e",
  language: "fr",
  responseMode: "detaillee",
  theme: "system",
  voiceReadingEnabled: false,
  fontSize: "md",
  onboardingComplete: false
};
