import { useEffect } from 'react';
import { useStations } from '../hooks/useStations';
import { useGameState } from '../hooks/useGameState';

function spawnConfetti(wrap) {
    const colors = ['#6c63ff', '#ff6b6b', '#00e5a0', '#ffd166', '#ff9f43', '#48dbfb', '#FF2E2E'];
    for (let i = 0; i < 100; i++) {
        const c = document.createElement('div');
        c.style.cssText = `
            position: absolute;
            left:${Math.random() * 100}%;
            top:-16px;
            background:${colors[Math.floor(Math.random() * colors.length)]};
            width:${Math.random() * 10 + 6}px;
            height:${Math.random() * 10 + 6}px;
            border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
            opacity: 0.9;
            animation: confettiFall ${Math.random() * 3 + 2}s ${Math.random() * 2}s linear forwards;
        `;
        wrap.appendChild(c);
    }
}

export default function FinalScreen() {
    const { stations } = useStations();
    const { getCollected } = useGameState();
    const collected = getCollected();

    useEffect(() => {
        const wrap = document.getElementById('confettiWrap');
        if (wrap) spawnConfetti(wrap);
        return () => { if (wrap) wrap.innerHTML = ''; };
    }, []);

    let word = '';
    const letters = stations.map(s => {
        const letter = collected[s.id];
        if (letter) { word += letter; return { letter, got: true }; }
        else { word += '_'; return { letter: '?', got: false }; }
    });



    return (
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden bg-background">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blood-red/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-neon-red/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Confetti container */}
            <div id="confettiWrap" className="absolute inset-0 overflow-hidden pointer-events-none z-0" />

            {/* Main card */}
            <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">

                {/* SVG "DECODED" Animation */}
                <div className="w-full flex flex-col items-center">
                    <svg viewBox="0 0 400 160" className="w-full max-w-sm" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <linearGradient id="redGold" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FF2E2E" />
                                <stop offset="50%" stopColor="#D4AF37" />
                                <stop offset="100%" stopColor="#FF2E2E">
                                    <animate attributeName="stop-color" values="#FF2E2E;#D4AF37;#FF2E2E" dur="3s" repeatCount="indefinite" />
                                </stop>
                            </linearGradient>
                        </defs>

                        {/* Scan‑line sweep */}
                        <rect x="0" y="0" width="400" height="160" fill="none" />
                        <line x1="0" y1="80" x2="400" y2="80" stroke="#FF2E2E" strokeWidth="0.5" opacity="0.2" />

                        {/* Corner bracket — top-left */}
                        <path d="M 28 8 L 6 8 L 6 30" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="square" filter="url(#glow)">
                            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                        </path>
                        {/* Corner bracket — top-right */}
                        <path d="M 372 8 L 394 8 L 394 30" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="square" filter="url(#glow)">
                            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="0.5s" repeatCount="indefinite" />
                        </path>
                        {/* Corner bracket — bottom-left */}
                        <path d="M 28 152 L 6 152 L 6 130" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="square" filter="url(#glow)">
                            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1s" repeatCount="indefinite" />
                        </path>
                        {/* Corner bracket — bottom-right */}
                        <path d="M 372 152 L 394 152 L 394 130" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="square" filter="url(#glow)">
                            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" begin="1.5s" repeatCount="indefinite" />
                        </path>

                        {/* Main text DECODED */}
                        <text
                            x="200" y="100"
                            textAnchor="middle"
                            fontFamily="'Orbitron', sans-serif"
                            fontWeight="900"
                            fontSize="62"
                            letterSpacing="8"
                            fill="url(#redGold)"
                            filter="url(#glow)"
                        >
                            <animate attributeName="opacity" values="0;1" dur="1.2s" fill="freeze" />
                            DECODED
                        </text>

                        {/* Glitch layer 1 */}
                        <text
                            x="200" y="100"
                            textAnchor="middle"
                            fontFamily="'Orbitron', sans-serif"
                            fontWeight="900"
                            fontSize="62"
                            letterSpacing="8"
                            fill="#FF2E2E"
                            opacity="0"
                        >
                            <animate attributeName="opacity" values="0;0.6;0" dur="0.15s" begin="1.5s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;0.5;1" />
                            <animate attributeName="x" values="200;203;200" dur="0.15s" begin="1.5s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;0.5;1" />
                            DECODED
                        </text>

                        {/* Glitch layer 2 */}
                        <text
                            x="200" y="100"
                            textAnchor="middle"
                            fontFamily="'Orbitron', sans-serif"
                            fontWeight="900"
                            fontSize="62"
                            letterSpacing="8"
                            fill="#48dbfb"
                            opacity="0"
                        >
                            <animate attributeName="opacity" values="0;0.4;0" dur="0.12s" begin="1.7s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;0.5;1" />
                            <animate attributeName="x" values="200;197;200" dur="0.12s" begin="1.7s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;0.5;1" />
                            DECODED
                        </text>

                        {/* Sub-label */}
                        <text
                            x="200" y="128"
                            textAnchor="middle"
                            fontFamily="'Orbitron', sans-serif"
                            fontWeight="400"
                            fontSize="11"
                            letterSpacing="6"
                            fill="#ffffff"
                            opacity="0.4"
                        >
                            <animate attributeName="opacity" values="0;0.4" dur="2s" begin="1s" fill="freeze" />
                            ENCRYPTION BROKEN
                        </text>

                        {/* Horizontal scan line animated */}
                        <rect x="4" y="0" width="392" height="2" fill="#FF2E2E" opacity="0.6">
                            <animate attributeName="y" from="-4" to="164" dur="2.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.5s" repeatCount="indefinite" />
                        </rect>
                    </svg>
                </div>

                {/* Title */}
                <div className="text-center -mt-2">
                    <h1 className="font-cinematic text-3xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
                        Mission <span className="text-neon-red">Complete</span>
                    </h1>
                </div>

                {/* Encrypted Fragments Grid */}
                <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 p-6 relative">
                    <div className="absolute top-0 left-0 w-8 h-[1px] bg-gold" />
                    <div className="absolute top-0 left-0 w-[1px] h-8 bg-gold" />
                    <div className="absolute bottom-0 right-0 w-8 h-[1px] bg-gold" />
                    <div className="absolute bottom-0 right-0 w-[1px] h-8 bg-gold" />

                    <p className="font-cinematic text-xs uppercase tracking-widest text-white/40 mb-4 text-center">
                        Encrypted Fragments
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {letters.map((l, i) => (
                            <div
                                key={i}
                                className={`w-12 h-12 flex items-center justify-center border font-cinematic text-xl font-bold transition-all
                                    ${l.got
                                        ? 'border-neon-red bg-blood-red/20 text-neon-red shadow-[0_0_12px_#8b0000]'
                                        : 'border-dashed border-white/20 text-white/20'
                                    }`}
                            >
                                {l.letter}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full bg-blood-red/10 border border-neon-red/40 p-8 text-center rounded relative overflow-hidden mt-8 shadow-[0_0_30px_rgba(255,46,46,0.15)]">
                    <div className="absolute -left-[100%] top-0 w-[200%] h-full bg-gradient-to-r from-transparent via-blood-red/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
                    <p className="relative z-10 font-body text-xl font-medium text-white tracking-wide leading-relaxed drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                        Show this screen to the organizer to proceed to next level!
                    </p>
                </div>
            </div>

            {/* Keyframes */}
            <style>{`
                @keyframes confettiFall {
                    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
                @keyframes shimmer {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(50%); }
                }
            `}</style>
        </div>
    );
}
