import { useState } from 'react';
import { useStations } from '../hooks/useStations';
import { supabase } from '../lib/supabase';
import { useGameState } from '../hooks/useGameState';
import ElectricCard from '../components/ElectricCard';

const LABELS = ['A', 'B', 'C', 'D'];

// Card config per answer state
const CARD_STATE = {
    unanswered: { variant: 'hue',   color: '#1e90ff', badge: 'Active Query' },
    correct:    { variant: 'swirl', color: '#34d399', badge: 'Validated'    },
    wrong:      { variant: 'swirl', color: '#FF2E2E', badge: 'Fatal Error'  },
};

export default function QuestionScreen({ station, onCorrect, onWrong }) {
    const [selected, setSelected] = useState(null);
    const [locked, setLocked] = useState(false);
    const [answerResult, setAnswerResult] = useState('unanswered'); // 'unanswered' | 'correct' | 'wrong'
    const { getUsername } = useGameState();
    const { stations } = useStations();

    const handleAnswer = async (idx) => {
        if (locked) return;
        setLocked(true);
        setSelected(idx);
        const correct = idx === station.correctIndex;
        setAnswerResult(correct ? 'correct' : 'wrong');

        // Log answer to Supabase (fire-and-forget)
        const username = getUsername() || 'unknown';
        supabase.from('hunt_answers').insert([{
            username,
            station_id: station.id,
            station_name: station.name,
            selected_option: station.options[idx],
            is_correct: correct,
            answered_at: new Date().toISOString()
        }]).then(() => { });

        setTimeout(() => {
            if (correct) onCorrect(station);
            else onWrong(station);
        }, correct ? 1000 : 1100);
    };

    const getOptionStyle = (i) => {
        const base = {
            display: 'flex',
            width: '100%',
            textAlign: 'left',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
            color: '#F5F5F5',
            fontFamily: 'inherit',
            fontSize: '15px',
            cursor: locked ? 'default' : 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none',
            borderRadius: '4px',
        };
        if (selected !== null) {
            if (i === station.correctIndex) {
                return { ...base, background: 'rgba(52,211,153,0.15)', border: '1px solid #34d399', color: '#34d399', boxShadow: '0 0 15px rgba(52,211,153,0.3)' };
            } else if (i === selected) {
                return { ...base, opacity: 0.35, textDecoration: 'line-through', border: '1px solid rgba(255,46,46,0.2)', color: '#FF2E2E' };
            } else {
                return { ...base, opacity: 0.15, border: '1px solid transparent' };
            }
        }
        return base;
    };

    const cardCfg = CARD_STATE[answerResult];

    return (
        <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '48px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Station Badge */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', alignSelf: 'flex-start' }}>
                    <span style={{ color: '#FF2E2E' }}>📍</span>
                    <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', color: '#F5F5F5', textTransform: 'uppercase' }}>{station.name}</span>
                </div>

                {/* ElectricCard wrapping the entire question */}
                <ElectricCard
                    variant={cardCfg.variant}
                    color={cardCfg.color}
                    badge={cardCfg.badge}
                    width="100%"
                    aspectRatio="auto"
                    style={{ transition: 'all 0.5s ease' }}
                >
                    {/* Header Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Station {station.id} / {stations.length}
                        </div>
                    </div>

                    {/* Question */}
                    <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '19px', fontWeight: '700', color: '#F5F5F5', marginBottom: '24px', lineHeight: '1.55', paddingBottom: '8px' }}>
                        {station.question}
                    </h2>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                        {station.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                disabled={locked}
                                style={getOptionStyle(i)}
                                onMouseEnter={e => { if (!locked && selected === null) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; } }}
                                onMouseLeave={e => { if (!locked && selected === null) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; } }}
                            >
                                <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: '700', fontSize: '13px', color: cardCfg.color, width: '22px', flexShrink: 0, opacity: 0.8 }}>
                                    {LABELS[i]}.
                                </div>
                                <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', flex: 1, fontSize: '14px' }}>
                                    {opt}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Hint */}
                    <div style={{ paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', paddingBottom: '8px' }}>
                        <span style={{ color: '#D4AF37' }}>💡</span> Analyze carefully before input
                    </div>
                </ElectricCard>

            </div>
        </div>
    );
}
