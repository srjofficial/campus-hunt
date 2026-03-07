import { useEffect, useRef } from 'react';

export default function LoadingScreen({ onDone }) {
    const barRef = useRef(null);

    useEffect(() => {
        let pct = 0;
        const iv = setInterval(() => {
            pct += Math.random() * 18;
            if (pct >= 100) {
                pct = 100;
                clearInterval(iv);
                if (barRef.current) barRef.current.style.width = '100%';
                setTimeout(() => onDone && onDone(), 400);
            }
            if (barRef.current) barRef.current.style.width = pct + '%';
        }, 120);
        return () => clearInterval(iv);
    }, [onDone]);

    return (
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', textAlign: 'center' }}>
                {/* Logo ring */}
                <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                        position: 'absolute', inset: 0,
                        border: '2px solid transparent',
                        borderTopColor: '#FF2E2E',
                        borderRightColor: '#8B0000',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }} />
                    <span style={{ fontSize: '36px' }}>🔍</span>
                </div>

                {/* Text */}
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: '900', letterSpacing: '10px', color: '#F5F5F5', textTransform: 'uppercase' }}>
                    CAMPUS<span style={{ display: 'inline-block', width: '16px' }} />HUNT
                </div>

                {/* Progress bar */}
                <div style={{ width: '200px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div
                        ref={barRef}
                        style={{
                            height: '100%',
                            width: '0%',
                            background: 'linear-gradient(90deg, #8B0000, #FF2E2E)',
                            borderRadius: '99px',
                            transition: 'width 0.1s linear',
                            boxShadow: '0 0 12px #FF2E2E',
                        }}
                    />
                </div>

                <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                    Initializing Station...
                </p>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
