import localFont from "next/font/local";

/**
 * Self-hosted variable fonts (SIL Open Font License, see src/fonts/LICENSE-*).
 * Manrope carries the editorial headline voice; JetBrains Mono is used for
 * technical labels and the terminal-style panels.
 */
export const fontSans = localFont({
  src: "../fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const fontMono = localFont({
  src: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  adjustFontFallback: false,
});
