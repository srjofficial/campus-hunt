import { useRef, useId, useEffect } from "react";

function mapRange(value, fromLow, fromHigh, toLow, toHigh) {
  if (fromLow === fromHigh) return toLow;
  const percentage = (value - fromLow) / (fromHigh - fromLow);
  return toLow + percentage * (toHigh - toLow);
}

/**
 * EtherealShadow — fluid, animated shadow background.
 * Props:
 *   color     — rgba color string (default: blood-red themed)
 *   animation — { scale: 0-100, speed: 0-100 }
 *   noise     — { opacity: 0-2, scale: 0.5-4 }
 *   sizing    — "fill" | "stretch"
 */
export default function EtherealShadow({
  sizing = "fill",
  color = "rgba(139, 0, 0, 0.85)",
  animation = { scale: 60, speed: 30 },
  noise = { opacity: 0.8, scale: 1.2 },
  style,
  className,
}) {
  const id = useId().replace(/:/g, "");
  const filterId = `shadowoverlay-${id}`;
  const animationEnabled = animation && animation.scale > 0;
  const feColorMatrixRef = useRef(null);
  const animFrameRef = useRef(null);
  const hueRef = useRef(0);

  const displacementScale = animation
    ? mapRange(animation.scale, 1, 100, 20, 100)
    : 0;
  const animationDuration = animation
    ? mapRange(animation.speed, 1, 100, 1000, 50)
    : 1;

  useEffect(() => {
    if (!animationEnabled || !feColorMatrixRef.current) return;
    const degreesPerMs = 360 / ((animationDuration / 25) * 1000);
    let lastTime = null;

    const loop = (timestamp) => {
      if (lastTime !== null) {
        hueRef.current =
          (hueRef.current + degreesPerMs * (timestamp - lastTime)) % 360;
        if (feColorMatrixRef.current) {
          feColorMatrixRef.current.setAttribute(
            "values",
            String(hueRef.current)
          );
        }
      }
      lastTime = timestamp;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animationEnabled, animationDuration]);

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${filterId}) blur(4px)` : "none",
        }}
      >
        {animationEnabled && (
          <svg style={{ position: "absolute" }}>
            <defs>
              <filter id={filterId}>
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix
                  ref={feColorMatrixRef}
                  in="undulation"
                  type="hueRotate"
                  values="180"
                />
                <feColorMatrix
                  in="dist"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="circulation"
                  scale={displacementScale}
                  result="dist"
                />
                <feDisplacementMap
                  in="dist"
                  in2="undulation"
                  scale={displacementScale}
                  result="output"
                />
              </filter>
            </defs>
          </svg>
        )}
        <div
          style={{
            backgroundColor: color,
            maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            WebkitMaskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
            maskSize: sizing === "stretch" ? "100% 100%" : "cover",
            WebkitMaskSize: sizing === "stretch" ? "100% 100%" : "cover",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
          }}
        />
      )}
    </div>
  );
}
