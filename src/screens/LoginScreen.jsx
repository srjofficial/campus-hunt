import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useGameState } from '../hooks/useGameState';


export default function LoginScreen({ onSuccess, stations = [] }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetGameState, setUsernameState } = useGameState();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { data, error: dbErr } = await supabase
                .from('hunt_credentials')
                .select('id')
                .eq('username', username.trim())
                .eq('password', password.trim())
                .maybeSingle();

            if (dbErr) throw dbErr;

            if (data) {
                // Log the login event
                const rawStationParam = new URLSearchParams(window.location.search).get('station');
                let stationId = null;
                let stationName = null;
                if (rawStationParam) {
                    // Station param is base64 encoded (e.g. 'Ng==' = 6)
                    try {
                        stationId = parseInt(atob(rawStationParam), 10);
                    } catch (_) {
                        stationId = parseInt(rawStationParam, 10);
                    }
                    if (!isNaN(stationId)) {
                        const found = stations.find(s => s.id === stationId);
                        stationName = found ? found.name : null;
                    } else {
                        stationId = null;
                    }
                }
                await supabase.from('hunt_logins').insert([{
                    username: username.trim(),
                    station_id: stationId,
                    station_name: stationName,
                    logged_in_at: new Date().toISOString()
                }]);

                // Clear previous player's game progress so this user starts fresh
                resetGameState();
                setUsernameState(username.trim());

                onSuccess();
            } else {
                setError('Invalid username or password. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Login failed. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blood-red/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blood-red to-transparent opacity-50" />

            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
                
                {/* Logo / Radar scanner effect */}
                <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 border border-blood-red/30 rounded-full animate-[spin_4s_linear_infinite]" />
                    <div className="absolute inset-2 border-t border-neon-red/50 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                    <svg className="w-10 h-10 text-white drop-shadow-[0_0_8px_#FF2E2E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                </div>

                <div className="text-center mb-10">
                    <h1 className="font-cinematic text-4xl font-black tracking-[0.2em] text-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2 uppercase">
                        Protocol Init
                    </h1>
                    <p className="font-body text-sm text-white/50 tracking-widest uppercase">
                        Authorized Personnel Only
                    </p>
                </div>

                <form 
                    className="w-full backdrop-blur-xl border border-white/10 p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative"
                    style={{ background: 'rgba(5,5,5,0.85)' }}
                    onSubmit={handleLogin}
                >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-red" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neon-red" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neon-red" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-red" />

                    <div className="space-y-8">
                        <div className="flex flex-col gap-2">
                            <label
                                className="font-cinematic text-[10px] text-neon-red uppercase tracking-[0.2em]"
                                htmlFor="ch-username"
                            >
                                Identification (Username)
                            </label>
                            <input
                                id="ch-username"
                                type="text"
                                placeholder="Enter ID..."
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoComplete="username"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.6)',
                                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderRight: 'none',
                                    padding: '12px 16px',
                                    color: '#F5F5F5',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '15px',
                                    outline: 'none',
                                    letterSpacing: '0.05em',
                                }}
                                onFocus={e => { e.target.style.borderBottomColor = '#FF2E2E'; e.target.style.background = 'rgba(139,0,0,0.08)'; }}
                                onBlur={e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'; e.target.style.background = 'rgba(0,0,0,0.6)'; }}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                className="font-cinematic text-[10px] text-neon-red uppercase tracking-[0.2em]"
                                htmlFor="ch-password"
                            >
                                Clearance Code (Password)
                            </label>
                            <input
                                id="ch-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.6)',
                                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                                    borderTop: 'none',
                                    borderLeft: 'none',
                                    borderRight: 'none',
                                    padding: '12px 16px',
                                    color: '#F5F5F5',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '15px',
                                    outline: 'none',
                                    letterSpacing: '0.1em',
                                }}
                                onFocus={e => { e.target.style.borderBottomColor = '#FF2E2E'; e.target.style.background = 'rgba(139,0,0,0.08)'; }}
                                onBlur={e => { e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'; e.target.style.background = 'rgba(0,0,0,0.6)'; }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-6 text-center border border-neon-red/50 bg-blood-red/10 text-neon-red text-xs p-3 font-cinematic uppercase tracking-wider animate-glitch">
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full relative overflow-hidden bg-[rgba(255,0,0,0.1)] border border-neon-red/50 hover:bg-neon-red hover:text-black transition-all duration-300 py-4 font-cinematic uppercase tracking-[0.2em] font-bold text-neon-red mt-8 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {/* Glitch hover effect */}
                        <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="absolute inset-0 translate-x-[2px] bg-red-500 mix-blend-screen opacity-50" />
                            <div className="absolute inset-0 -translate-x-[2px] bg-blue-500 mix-blend-screen opacity-50" />
                        </div>
                        <span className="relative z-10 transition-colors duration-300 group-hover:animate-pulse">
                            {loading ? 'Decrypting...' : 'Initiate Sequence →'}
                        </span>
                    </button>
                    
                </form>

            </div>
        </div>
    );
}
