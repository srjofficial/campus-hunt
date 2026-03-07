import { useEffect } from 'react';

export default function BgParticles() {
    useEffect(() => {
        const colors = ['#6c63ff', '#ff6b6b', '#00e5a0', '#ffd166', '#8b85ff'];
        const wrap = document.getElementById('particles');
        if (!wrap) return;
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.cssText = `
                left:${Math.random() * 100}%;
                bottom:${Math.random() * 20 - 10}%;
                width:${Math.random() * 6 + 3}px;
                height:${Math.random() * 6 + 3}px;
                background:${colors[Math.floor(Math.random() * colors.length)]};
                animation-duration:${Math.random() * 12 + 8}s;
                animation-delay:${Math.random() * 8}s;
                opacity:0.5;
            `;
            wrap.appendChild(p);
        }
        return () => { if (wrap) wrap.innerHTML = ''; };
    }, []);

    return <div className="bg-particles" id="particles" />;
}
