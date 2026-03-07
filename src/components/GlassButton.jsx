/**
 * GlassButton — frosted glass morphism button with layered highlights,
 * ambient glow and smooth transitions.
 *
 * Variants: "default" | "blue" | "purple" | "amber" | "red"
 * Sizes:    "sm" | "default" | "lg" | "icon"
 */

const GLASS_STYLES = `
  .glass-btn-wrap {
    position: relative;
    display: inline-block;
  }
  .glass-btn {
    all: unset;
    position: relative;
    display: inline-flex;
    border-radius: 9999px;
    cursor: pointer;
    background: linear-gradient(135deg,
      rgba(255,255,255,0.18) 0%,
      rgba(255,255,255,0.04) 50%,
      rgba(255,255,255,0.10) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.22);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.3),
      inset 0 -1px 0 rgba(0,0,0,0.15),
      0 2px 8px rgba(0,0,0,0.3);
    color: rgba(255,255,255,0.92);
    transition: all 0.18s ease;
    font-family: 'Orbitron', 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .glass-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.18s ease;
    pointer-events: none;
  }
  .glass-btn:hover::before { opacity: 1; }
  .glass-btn:hover {
    background: linear-gradient(135deg,
      rgba(255,255,255,0.24) 0%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.16) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.4),
      inset 0 -1px 0 rgba(0,0,0,0.1),
      0 4px 20px rgba(0,0,0,0.4),
      0 0 0 1px rgba(255,255,255,0.12);
    transform: translateY(-1px);
  }
  .glass-btn:active { transform: translateY(0px) scale(0.98); }
  .glass-btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

  .glass-btn-text {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }
  .glass-btn-shadow {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    height: 12px;
    background: rgba(0,0,0,0.35);
    filter: blur(8px);
    border-radius: 9999px;
    pointer-events: none;
  }

  /* ── Colored variants ── */
  .glass-btn-red {
    background: linear-gradient(135deg,
      rgba(220,38,38,0.45) 0%,
      rgba(139,0,0,0.2) 60%,
      rgba(255,46,46,0.35) 100%) !important;
    border-color: rgba(255,80,80,0.45) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,120,120,0.4),
      0 0 24px rgba(139,0,0,0.3),
      0 2px 8px rgba(0,0,0,0.3) !important;
    color: rgba(255,200,200,0.95) !important;
  }
  .glass-btn-red:hover {
    box-shadow:
      inset 0 1px 0 rgba(255,120,120,0.5),
      0 0 40px rgba(255,46,46,0.35),
      0 4px 16px rgba(0,0,0,0.4) !important;
  }

  .glass-btn-blue {
    background: linear-gradient(135deg,
      rgba(99,179,237,0.35) 0%,
      rgba(66,153,225,0.15) 60%,
      rgba(99,179,237,0.25) 100%) !important;
    border-color: rgba(147,210,255,0.4) !important;
    box-shadow:
      inset 0 1px 0 rgba(147,210,255,0.4),
      0 0 20px rgba(66,153,225,0.2),
      0 2px 8px rgba(0,0,0,0.3) !important;
    color: rgba(147,210,255,0.95) !important;
  }
  .glass-btn-blue:hover {
    box-shadow:
      inset 0 1px 0 rgba(147,210,255,0.5),
      0 0 32px rgba(66,153,225,0.35),
      0 4px 16px rgba(0,0,0,0.4) !important;
  }

  .glass-btn-purple {
    background: linear-gradient(135deg,
      rgba(183,148,246,0.35) 0%,
      rgba(139,92,246,0.15) 60%,
      rgba(183,148,246,0.25) 100%) !important;
    border-color: rgba(216,180,254,0.4) !important;
    box-shadow:
      inset 0 1px 0 rgba(216,180,254,0.4),
      0 0 20px rgba(139,92,246,0.2),
      0 2px 8px rgba(0,0,0,0.3) !important;
    color: rgba(216,180,254,0.95) !important;
  }
  .glass-btn-purple:hover {
    box-shadow:
      inset 0 1px 0 rgba(216,180,254,0.5),
      0 0 32px rgba(139,92,246,0.35),
      0 4px 16px rgba(0,0,0,0.4) !important;
  }

  .glass-btn-amber {
    background: linear-gradient(135deg,
      rgba(251,191,36,0.35) 0%,
      rgba(245,158,11,0.15) 60%,
      rgba(251,191,36,0.25) 100%) !important;
    border-color: rgba(253,230,138,0.4) !important;
    box-shadow:
      inset 0 1px 0 rgba(253,230,138,0.4),
      0 0 20px rgba(245,158,11,0.2),
      0 2px 8px rgba(0,0,0,0.3) !important;
    color: rgba(253,230,138,0.95) !important;
  }
  .glass-btn-amber:hover {
    box-shadow:
      inset 0 1px 0 rgba(253,230,138,0.5),
      0 0 32px rgba(245,158,11,0.35),
      0 4px 16px rgba(0,0,0,0.4) !important;
  }

  .glass-btn-green {
    background: linear-gradient(135deg,
      rgba(52,211,153,0.35) 0%,
      rgba(16,185,129,0.15) 60%,
      rgba(52,211,153,0.25) 100%) !important;
    border-color: rgba(110,231,183,0.4) !important;
    box-shadow:
      inset 0 1px 0 rgba(110,231,183,0.4),
      0 0 20px rgba(16,185,129,0.2),
      0 2px 8px rgba(0,0,0,0.3) !important;
    color: rgba(110,231,183,0.95) !important;
  }
  .glass-btn-green:hover {
    box-shadow:
      inset 0 1px 0 rgba(110,231,183,0.5),
      0 0 32px rgba(52,211,153,0.35),
      0 4px 16px rgba(0,0,0,0.4) !important;
  }
`;

let stylesInjected = false;

export default function GlassButton({
  children,
  size = "default",
  variant = "default",
  className = "",
  onClick,
  disabled = false,
  style = {},
}) {
  // Inject styles once into the document head
  if (typeof document !== "undefined" && !stylesInjected) {
    const tag = document.createElement("style");
    tag.setAttribute("data-glass-btn", "1");
    tag.textContent = GLASS_STYLES;
    document.head.appendChild(tag);
    stylesInjected = true;
  }

  const sizeStyles = {
    sm:      { padding: "8px 18px",  fontSize: "10px" },
    default: { padding: "12px 28px", fontSize: "12px" },
    lg:      { padding: "16px 40px", fontSize: "13px" },
    icon:    { padding: "0",         fontSize: "14px", width: "44px", height: "44px" },
  };

  const variantClass = variant !== "default" ? `glass-btn-${variant}` : "";

  return (
    <div className={`glass-btn-wrap ${className}`} style={style}>
      <button
        className={`glass-btn ${variantClass}`}
        style={{ ...sizeStyles[size] || sizeStyles.default }}
        onClick={onClick}
        disabled={disabled}
      >
        <span className="glass-btn-text">{children}</span>
      </button>
      <div className="glass-btn-shadow" />
    </div>
  );
}
