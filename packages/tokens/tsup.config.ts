import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/tailwind.preset.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: ["tailwindcss"],
})
