import { useEffect, useRef } from "react";

const glowColorMap = {
  blue:   { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green:  { base: 120, spread: 200 },
  red:    { base: 0,   spread: 200 },
  orange: { base: 30,  spread: 200 },
  amber:  { base: 45,  spread: 200 },
};

const GLOW_STYLES = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size, 2px) * -1);
    border: var(--border-size, 2px) solid transparent;
    border-radius: calc(var(--radius, 16) * 1px);
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size, 2px))) calc(100% + (2 * var(--border-size, 2px)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
    -webkit-mask-composite: destination-in;
  }
  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size, 200px) * 0.75) calc(var(--spotlight-size, 200px) * 0.75) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) 100% 60% / 0.9), transparent 100%
    );
    filter: brightness(2);
  }
  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size, 200px) * 0.5) calc(var(--spotlight-size, 200px) * 0.5) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / 0.7), transparent 100%
    );
  }
  [data-glow] [data-glow] {
    position: absolute; inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius, 16) * 1px);
    border: none;
    background: none;
    pointer-events: none;
  }
`;

let stylesInjected = false;

export default function GlowCard({
  children,
  className = "",
  glowColor = "blue",
  width = "100%",
  height = "auto",
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (typeof document !== "undefined" && !stylesInjected) {
      const tag = document.createElement("style");
      tag.setAttribute("data-glow-styles", "1");
      tag.textContent = GLOW_STYLES;
      document.head.appendChild(tag);
      stylesInjected = true;
    }

    const syncPointer = (e) => {
      const { clientX: x, clientY: y } = e;
      if (cardRef.current) {
        cardRef.current.style.setProperty("--x", x.toFixed(2));
        cardRef.current.style.setProperty("--xp", (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty("--y", y.toFixed(2));
        cardRef.current.style.setProperty("--yp", (y / window.innerHeight).toFixed(2));
      }
    };
    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor] || glowColorMap.blue;

  const inlineStyle = {
    "--base": base,
    "--spread": spread,
    "--radius": "16",
    "--border": "2",
    "--backdrop": "hsl(0 0% 8% / 0.85)",
    "--backup-border": "hsl(0 0% 100% / 0.08)",
    "--size": "280",
    "--outer": "1",
    "--border-size": "calc(var(--border, 2) * 1px)",
    "--spotlight-size": "calc(var(--size, 150) * 1px)",
    "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) 100% 70% / 0.08), transparent
    )`,
    backgroundColor: "var(--backdrop)",
    backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
    backgroundPosition: "50% 50%",
    backgroundAttachment: "fixed",
    border: "var(--border-size) solid var(--backup-border)",
    borderRadius: "calc(var(--radius) * 1px)",
    position: "relative",
    touchAction: "none",
    width: width ? (typeof width === "number" ? `${width}px` : width) : "100%",
    height: height ? (typeof height === "number" ? `${height}px` : height) : "auto",
  };

  return (
    <div ref={cardRef} data-glow style={inlineStyle} className={`glow-card ${className}`}>
      <div data-glow style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none" }} />
      {children}
    </div>
  );
}
