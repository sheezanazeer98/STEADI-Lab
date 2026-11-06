import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const paper = "#f5ede3";
const ink = "#4a3f3a";
const accent = "#cf5a30";
const muted = "#8a7a70";
const grid = "rgba(74, 63, 58, 0.12)";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: paper,
        backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
        color: ink,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
            <rect x="1.5" y="1.5" width="29" height="29" rx="4" stroke={ink} strokeWidth="2" />
            <circle cx="9" cy="10" r="2.5" fill={accent} />
            <circle cx="23" cy="10" r="2.5" fill={ink} />
            <circle cx="16" cy="22" r="2.5" fill={ink} />
            <path d="M9 10h14M9 10l7 12M23 10l-7 12" stroke={ink} strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>
            {siteConfig.shortName}
            <span style={{ color: accent }}> Lab</span>
          </span>
        </div>
        <span style={{ fontSize: 18, color: muted, letterSpacing: 3, textTransform: "uppercase" }}>
          {siteConfig.institution.name}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span style={{ fontSize: 18, color: accent, letterSpacing: 3, textTransform: "uppercase" }}>
          01 — Research laboratory
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 74,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -3,
          }}
        >
          <span>Advancing Research in</span>
          <span>
            <span style={{ color: accent }}>Artificial Intelligence</span>
          </span>
          <span>and Blockchain.</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: muted,
          fontSize: 20,
        }}
      >
        <span>Trustworthy AI · Agentic systems · Smart contracts · Decentralized systems</span>
        <span style={{ letterSpacing: 2 }}>steadi-lab.org</span>
      </div>
    </div>,
    { ...size },
  );
}
