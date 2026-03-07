import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicIntro({ onComplete }) {
  const containerRef = useRef(null);
  const qrRef = useRef(null);
  const glowRef = useRef(null);
  const tentacleLeftRef = useRef(null);
  const tentacleRightRef = useRef(null);
  const textRef = useRef(null);
  const faderRef = useRef(null);
  
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    // 1. Initialize Lenis for buttery smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Setup GSAP Timelines bound to the scroll container
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth dragging effect
          onUpdate: (self) => {
            if (self.progress > 0.25 && self.progress < 0.8) {
              setGlitching(true);
            } else {
              setGlitching(false);
            }
            if (self.progress > 0.98) {
              // Transition complete
              onComplete();
            }
          }
        }
      });

      // Scene 1: Discovery 
      // Zoom into the QR code and increase red glow
      tl.to(qrRef.current, { scale: 1.5, y: -50, duration: 1 }, 0)
        .to(glowRef.current, { opacity: 0.8, scale: 2, duration: 1 }, 0)
        .to(textRef.current, { opacity: 1, y: -20, duration: 1 }, 0.2);

      // Scene 2: Activation
      // The text glitches, environment darkens (handled by CSS glitch class triggered by React state)
      tl.to(qrRef.current, { filter: "invert(1) sepia(1) hue-rotate(-50deg) saturate(5)", duration: 0.5 }, 1);

      // Scene 3: Horror Emergence
      // Tentacles rise out of the QR code
      tl.to(tentacleLeftRef.current, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }, 1.5)
        .to(tentacleRightRef.current, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }, 1.5);

      // Scene 4: Chaos
      // Tentacles expand, layout distorts
      tl.to(qrRef.current, { rotation: 15, scale: 2, filter: "blur(4px)", duration: 1 }, 3)
        .to(tentacleLeftRef.current, { scale: 1.2, rotation: -10, duration: 1 }, 3)
        .to(tentacleRightRef.current, { scale: 1.2, rotation: 10, duration: 1 }, 3)
        .to(textRef.current, { opacity: 0, scale: 0.5, duration: 0.5 }, 3);

      // Scene 5: Transition
      // Flash white/red and fade entire screen to black to transition to main app
      tl.to(faderRef.current, { opacity: 1, duration: 0.5 }, 4);

    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-background">
      
      {/* Scrollable Tracker text to inform user to scroll */}
      <div className="fixed top-10 w-full text-center z-40 opacity-50 font-cinematic text-sm tracking-[0.5em] text-foreground animate-pulse">
        SCROLL TO INITIATE SEQUENCE
      </div>

      {/* Sticky viewport content - stays on screen while user scrolls through the 500vh container */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Background dark overlay / Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#000_100%)] z-10 pointer-events-none" />

        {/* Global Red Glow behind the scene */}
        <div 
          ref={glowRef}
          className="absolute opacity-0 w-[400px] h-[400px] rounded-full bg-blood-red blur-[120px] mix-blend-screen pointer-events-none z-0"
        />

        {/* The mysterious QR code / Document block */}
        <div ref={qrRef} className={`relative z-20 flex flex-col items-center gap-6 ${glitching ? 'animate-glitch' : ''}`}>
          <div className="w-48 h-48 border border-white/20 bg-black/50 backdrop-blur-md p-4 flex items-center justify-center shadow-[0_0_30px_rgba(139,0,0,0.2)]">
            {/* SVG mimicking a complex QR/Data matrix */}
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white/80">
              <rect x="10" y="10" width="20" height="20" />
              <rect x="70" y="10" width="20" height="20" />
              <rect x="10" y="70" width="20" height="20" />
              <rect x="40" y="40" width="20" height="20" />
              <circle cx="20" cy="20" r="5" className="fill-background" />
              <circle cx="80" cy="20" r="5" className="fill-background" />
              <circle cx="20" cy="80" r="5" className="fill-background" />
              <path d="M40 10 h20 v10 h-20 z M10 40 h20 v10 h-20 z M70 40 h20 v10 h-20 z M40 70 h20 v10 h-20 z M40 85 h10 v5 h-10 z M85 70 h5 v20 h-5 z" />
            </svg>
          </div>
          
          <h1 ref={textRef} className="opacity-0 font-cinematic text-2xl md:text-4xl text-neon-red font-bold uppercase tracking-widest text-shadow-red">
            Classified Payload
          </h1>
        </div>

        {/* Scene 3: The Horror Tentacles emerging from the center */}
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-visible">
          {/* Left Tentacle */}
          <svg className="absolute w-[600px] h-[600px] overflow-visible" viewBox="0 0 500 500">
            <path 
              ref={tentacleLeftRef}
              d="M 250 250 C 150 200, 50 300, -50 150 C -150 0, -50 -100, 0 -200"
              fill="none" 
              stroke="#050505" 
              strokeWidth="15"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_#8B0000]"
              style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
            />
          </svg>
          
          {/* Right Tentacle */}
          <svg className="absolute w-[600px] h-[600px] overflow-visible" viewBox="0 0 500 500">
            <path 
              ref={tentacleRightRef}
              d="M 250 250 C 350 300, 450 150, 550 250 C 650 350, 500 450, 550 550"
              fill="none" 
              stroke="#050505" 
              strokeWidth="20"
              strokeLinecap="round"
              className="drop-shadow-[0_0_12px_#FF2E2E]"
              style={{ strokeDasharray: 1000, strokeDashoffset: 1000 }}
            />
          </svg>
        </div>

        {/* Transition Fader - covers screen at the end */}
        <div ref={faderRef} className="absolute inset-0 bg-black opacity-0 z-50 pointer-events-none flex items-center justify-center">
            <div className="text-neon-red font-cinematic text-6xl font-black tracking-tighter opacity-50 blur-[2px]">SYS_BREACH</div>
        </div>

      </div>
    </div>
  );
}
