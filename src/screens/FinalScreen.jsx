import { useEffect } from 'react';
import { STATION_DATA } from '../data';
import { useGameState } from '../hooks/useGameState';

function spawnConfetti(wrap) {
    const colors = ['#6c63ff', '#ff6b6b', '#00e5a0', '#ffd166', '#ff9f43', '#48dbfb'];
    for (let i = 0; i < 80; i++) {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        c.style.cssText = `
            left:${Math.random() * 100}%;
            top:-10px;
            background:${colors[Math.floor(Math.random() * colors.length)]};
            width:${Math.random() * 12 + 6}px;
            height:${Math.random() * 12 + 6}px;
            border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
            animation:confettiFall ${Math.random() * 3 + 2}s ${Math.random() * 2}s linear forwards;
        `;
        wrap.appendChild(c);
    }
}

export default function FinalScreen() {
    const { getCollected } = useGameState();
    const collected = getCollected();

    useEffect(() => {
        const wrap = document.getElementById('confettiWrap');
        if (wrap) spawnConfetti(wrap);
        return () => { if (wrap) wrap.innerHTML = ''; };
    }, []);

    let word = '';
    const letters = STATION_DATA.map(s => {
        const letter = collected[s.id];
        if (letter) { word += letter; return { letter, got: true }; }
        else { word += '_'; return { letter: '?', got: false }; }
    });

    return (
        <div className="screen">
            <div className="confetti-wrap" id="confettiWrap" />
            <div className="final-container">
                <div className="final-trophy">🏆</div>
                <h1 className="final-title">Hunt Complete!</h1>
                <p className="final-sub">You've completed all stations! Assemble your secret word:</p>

                <div className="final-letters">
                    {letters.map((l, i) => (
                        <div key={i} className={`final-letter ${l.got ? 'got' : 'missed-l'}`}>
                            {l.letter}
                        </div>
                    ))}
                </div>

                <div className="final-word-box">
                    <div className="word-label">🔑 Secret Word</div>
                    <div className="word-display">{word.split('').join(' ')}</div>
                </div>

                <p className="final-note">Show this to the organizer to claim your prize! 🎁</p>
            </div>
        </div>
    );
}
