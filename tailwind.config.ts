import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { space: "#050A16", panel: "#0C1424", starlight: "#E7EEF9", copper: "#C77A44", cyan: "#53B9D8", amber: "#F0B64B", muted: "#718096" },
    fontFamily: { head: ["var(--font-grotesk)", "system-ui", "sans-serif"], body: ["var(--font-inter)", "system-ui", "sans-serif"], mono: ["var(--font-plex)", "ui-monospace", "monospace"] },
    maxWidth: { reading: "680px", app: "1120px", wide: "1320px" },
    fontSize: { "fluid-page": "clamp(2.1rem,5.2vw,4.2rem)", "fluid-section": "clamp(1.5rem,3vw,2.4rem)", "fluid-panel": "clamp(1.05rem,1.8vw,1.4rem)" },
  } },
  plugins: [],
};
export default config;
