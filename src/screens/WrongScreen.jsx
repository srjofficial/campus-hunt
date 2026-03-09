import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import ElectricCard from '../components/ElectricCard';

export default function WrongScreen({ station, isRevisit, onTaskDone }) {
    const { getUsername } = useGameState();

    // Persist unlock state in localStorage keyed per station
    const storageKey = `wa_unlocked_station_${station.id}`;
    const [unlocked, setUnlocked] = useState(() => {
        try { return localStorage.getItem(storageKey) === '1'; } catch { return false; }
    });

    const handleWhatsAppTap = () => {
        try { localStorage.setItem(storageKey, '1'); } catch {}
        setUnlocked(true);
    };

    const handleTaskDone = () => {
        onTaskDone(station);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
            
            {/* Ambient Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blood-red/20 blur-[100px] rounded-full pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAweDRIMHptMiAydi0yaDJ2MnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPgo8L3N2Zz4=')] pointer-events-none opacity-20" />
            
            <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center gap-6">
                
                {isRevisit && (
                    <div className="w-full bg-blood-red/10 border border-neon-red/50 text-neon-red p-3 text-xs font-cinematic uppercase tracking-widest animate-pulse">
                        ⚠️ Data Already Extracted. Proceed to next coordinate.
                    </div>
                )}

                {/* Horror Icon */}
                <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 border border-neon-red/50 skew-x-12 animate-glitch" />
                    <div className="absolute inset-2 border border-blood-red bg-blood-red/10 animate-[pulse_1s_infinite]" />
                    <span className="text-4xl drop-shadow-[0_0_15px_#FF2E2E]">💀</span>
                </div>

                <h1 className="font-cinematic text-4xl font-black tracking-widest text-neon-red uppercase drop-shadow-[0_0_10px_rgba(255,46,46,0.6)] animate-glitch">
                    Fatal Error
                </h1>
                <p className="font-body text-sm text-white/50 tracking-widest uppercase mb-4">
                    Incorrect Input Detected
                </p>

                {/* Punishment Task Block — violet swirl ElectricCard */}
                <ElectricCard
                    variant="swirl"
                    color="#c084fc"
                    badge="Penalty Protocol"
                    width="100%"
                >
                    <div style={{ marginBottom: '16px' }}>
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: '600', color: '#F5F5F5', lineHeight: '1.6', marginBottom: '24px' }}>
                            {station.funTask}
                        </p>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                Submission Directive
                            </div>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px', lineHeight: '1.6' }}>
                                Record visual proof and transmit to command:
                            </p>
                            <a
                                href="https://wa.me/918590723437"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleWhatsAppTap}
                                style={{ display: 'inline-block', border: '1px solid rgba(52,211,153,0.5)', background: 'rgba(52,211,153,0.08)', padding: '10px 24px', color: '#34d399', fontFamily: 'Orbitron, sans-serif', fontWeight: '700', fontSize: '18px', letterSpacing: '0.1em', marginBottom: '16px', boxShadow: '0 0 15px rgba(52,211,153,0.1)', textDecoration: 'none', cursor: 'pointer' }}
                            >
                                +91 85907 23437
                            </a>
                            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Include syntax:
                            </div>
                            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(192,132,252,0.7)', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                [ ID: {getUsername() || 'UNKNOWN'} ] — [ SYS: {station.id} ]
                            </div>
                        </div>
                    </div>
                </ElectricCard>

                {/* Override button — locked until WhatsApp number is tapped */}
                <button
                    onClick={unlocked ? handleTaskDone : undefined}
                    disabled={!unlocked}
                    className={`w-full mt-6 py-4 font-cinematic uppercase tracking-[0.2em] font-bold transition-all duration-300 relative overflow-hidden
                        ${unlocked
                            ? 'bg-[rgba(168,85,247,0.1)] border border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white cursor-pointer group'
                            : 'bg-white/5 border border-white/10 text-white/25 cursor-not-allowed'
                        }`}
                >
                    {unlocked && (
                        <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 translate-x-[2px] bg-purple-400 mix-blend-screen opacity-50 animate-pulse" />
                        </div>
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">

                        Data Transmitted — Override
                        {!unlocked && <span className="text-[10px] tracking-widest normal-case opacity-60 ml-1">tap WhatsApp first</span>}
                    </span>
                </button>

            </div>
        </div>
    );
}

