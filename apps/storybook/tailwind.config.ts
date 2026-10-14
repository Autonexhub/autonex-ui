import type { Config } from "tailwindcss";
import { autonexiaPreset } from "@autonexhub/tokens/tailwind.preset";

export default {
  presets: [autonexiaPreset],
  content: [
    "./stories/**/*.{ts,tsx,mdx}",
    "../../packages/react/src/**/*.{ts,tsx}",
  ],
} satisfies Config;
