import { useMemo } from "react";

/**
 * ElectricCard — animated SVG displacement filter card.
 * The animated border/glow is achieved using a layered approach:
 *   - Children content drives the card height
 *   - SVG filter animation overlays the border
 * Variants: "swirl" | "hue"
 */
export default function ElectricCard({
  variant = "swirl",
  color = "#dd8448",
  badge,
  title,
  width = "100%",
  className = "",
  children,
  style = {},
}) {
  const ids = useMemo(() => {
    const key = Math.random().toString(36).slice(2, 8);
    return { id: `ec-${key}` };
  }, []);

  const uid = ids.id;

  const swirlFilter = `${uid}-swirl`;
  const hueFilter = `${uid}-hue`;
  const filterId = variant === "hue" ? hueFilter : swirlFilter;

  // Safe rgba helper — avoids color-mix() which has limited browser support
  const hexToRgba = (hex, alpha) => {
    try {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    } catch { return `rgba(136,136,136,${alpha})`; }
  };
  const colorMid = hexToRgba(color, 0.35);
  const colorGlow = hexToRgba(color, 0.15);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        borderRadius: "20px",
        padding: "2px",
        background: `linear-gradient(-30deg, ${colorMid}, transparent 50%, ${colorMid})`,
        ...style,
      }}
    >
      {/* Hidden SVG filters */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <defs>
          <filter id={swirlFilter} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
            <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
              <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
            <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
              <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise3" seed="2" />
            <feOffset in="noise3" dx="0" dy="0" result="offsetNoise3">
              <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise4" seed="2" />
            <feOffset in="noise4" dx="0" dy="0" result="offsetNoise4">
              <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
            </feOffset>
            <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
            <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic" in2="combinedNoise" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>

          <filter id={hueFilter} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="7" />
            <feColorMatrix type="hueRotate" result="pt1">
              <animate attributeName="values" values="0;360;" dur=".6s" repeatCount="indefinite" calcMode="paced" />
            </feColorMatrix>
            <feComposite />
            <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="7" seed="5" />
            <feColorMatrix type="hueRotate" result="pt2">
              <animate attributeName="values" values="0; 333; 199; 286; 64; 168; 256; 157; 360;" dur="5s" repeatCount="indefinite" calcMode="paced" />
            </feColorMatrix>
            <feBlend in="pt1" in2="pt2" mode="normal" result="combinedNoise" />
            <feDisplacementMap in="SourceGraphic" scale="30" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>
      </svg>

      {/* Animated border overlay — uses SVG filter on a transparent div */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          border: `2px solid ${color}`,
          filter: `url(#${filterId}) blur(0.5px)`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Soft glow layer 1 */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "20px",
        border: `2px solid ${color}`,
        filter: "blur(6px)",
        opacity: 0.5,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Outer background glow */}
      <div style={{
        position: "absolute", inset: "-4px",
        borderRadius: "24px",
        background: `linear-gradient(-30deg, ${colorGlow}, transparent 50%, ${colorGlow})`,
        filter: "blur(20px)",
        opacity: 0.8,
        pointerEvents: "none",
        zIndex: -1,
      }} />

      {/* Card inner content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        borderRadius: "18px",
        background: "rgba(5, 5, 5, 0.92)",
        padding: "28px",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
      }}>
        {/* Diagonal overlay shimmer */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(-30deg, rgba(255,255,255,0.04), transparent 40%, transparent 60%, rgba(255,255,255,0.02))",
          pointerEvents: "none",
          borderRadius: "inherit",
        }} />

        {/* Badge pill */}
        {badge && (
          <div style={{
            display: "inline-block",
            background: "radial-gradient(47.2% 50% at 50.39% 88.37%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), rgba(255,255,255,0.04)",
            borderRadius: "10px",
            padding: "5px 14px",
            fontFamily: "Orbitron, monospace",
            fontSize: "9px",
            fontWeight: "700",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: color,
            marginBottom: "16px",
            border: `1px solid ${color}44`,
            position: "relative",
            zIndex: 1,
          }}>
            {badge}
          </div>
        )}

        {/* Title */}
        {title && (
          <div style={{
            fontFamily: "Orbitron, sans-serif",
            fontSize: "15px",
            fontWeight: "700",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.9)",
            marginBottom: "14px",
            position: "relative",
            zIndex: 1,
          }}>
            {title}
          </div>
        )}

        {/* Children content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
