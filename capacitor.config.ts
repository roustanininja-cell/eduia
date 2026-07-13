import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.eduia.app",
  appName: "EduAI",
  webDir: "public",
  server: {
    url: "https://eduia-xydf.vercel.app/",
    cleartext: false
  }
};

export default config;