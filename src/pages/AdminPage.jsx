import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';
import { STATION_DATA } from '../data';
import GlowCard from '../components/GlowCard';
import GlassButton from '../components/GlassButton';
import './admin.css';

export default function AdminPage() {
    const [baseUrl, setBaseUrl] = useState('');
    const [qrCards, setQrCards] = useState([]);
    const [urlPreview, setUrlPreview] = useState('...');
    const [videos, setVideos] = useState([]);
    const [videoStatus, setVideoStatus] = useState('⏳ Loading submissions...');
    const canvasRefs = useRef({});

    // Login activity state
    const [logins, setLogins] = useState([]);
    const [loginStatus, setLoginStatus] = useState('⏳ Loading activity...');

    // Answer activity state
    const [answers, setAnswers] = useState([]);
    const [answerStatus, setAnswerStatus] = useState('⏳ Loading answers...');

    // Credentials state
    const [creds, setCreds] = useState([]);
    const [credStatus, setCredStatus] = useState('');
    const [newUser, setNewUser] = useState('');
    const [newPass, setNewPass] = useState('');
    const [addMsg, setAddMsg] = useState('');

    useEffect(() => {
        const auto = window.location.href.split('abpasa')[0];
        setBaseUrl(auto);
        setUrlPreview(auto + '?station=' + btoa('1'));
        loadVideos();
        loadCreds();
        loadLogins();
        loadAnswers();
        // Auto-refresh every 30s
        const iv = setInterval(() => { loadLogins(); loadAnswers(); }, 30000);
        return () => clearInterval(iv);
    }, []);

    /* ---- Helpers ---- */
    const getBase = () => {
        let base = baseUrl.trim() || window.location.href.split('abpasa')[0];
        if (!base.endsWith('/')) base += '/';
        return base;
    };

    const handleBaseChange = (v) => {
        setBaseUrl(v);
        const base = v.trim().endsWith('/') ? v.trim() : v.trim() + '/';
        setUrlPreview(base + '?station=' + btoa('1'));
    };

    /* ---- QR Generation ---- */
    const generateAllQRs = async () => {
        const base = getBase();
        const cards = STATION_DATA.map(station => ({
            station, url: base + '?station=' + btoa(station.id.toString())
        }));
        setQrCards(cards);
        setTimeout(async () => {
            for (const { station, url } of cards) {
                const canvas = canvasRefs.current[station.id];
                if (canvas) {
                    try { await QRCode.toCanvas(canvas, url, { width: 180, margin: 1 }); }
                    catch (err) { console.error(err); }
                }
            }
        }, 100);
    };

    const downloadQR = (station) => {
        const src = canvasRefs.current[station.id];
        if (!src) return;
        const out = document.createElement('canvas');
        out.width = 280; out.height = 340;
        const ctx = out.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 280, 340);
        ctx.drawImage(src, 50, 20, 180, 180);
        ctx.fillStyle = '#000'; ctx.font = 'bold 14px Outfit'; ctx.textAlign = 'center';
        ctx.fillText('CAMPUS HUNT', 140, 225);
        ctx.fillText(station.name, 140, 245);
        const link = document.createElement('a');
        link.download = `station-${station.id}.png`;
        link.href = out.toDataURL(); link.click();
    };

    /* ---- Videos ---- */
    const loadVideos = async () => {
        try {
            const { data, error } = await supabase
                .from('hunt_tasks').select('*')
                .not('video_url', 'is', null)
                .order('created_at', { ascending: false });
            if (error) throw error;
            if (!data || data.length === 0) { setVideoStatus('📭 No submissions yet'); return; }
            setVideos(data); setVideoStatus('');
        } catch (err) {
            console.error(err); setVideoStatus('❌ Load Error');
        }
    };

    /* ---- Answer Activity ---- */
    const loadAnswers = async () => {
        try {
            const { data, error } = await supabase
                .from('hunt_answers')
                .select('*')
                .order('answered_at', { ascending: false })
                .limit(100);
            if (error) throw error;
            setAnswers(data || []);
            setAnswerStatus('');
        } catch (err) {
            console.error(err);
            setAnswerStatus('❌ Could not load answers');
        }
    };

    /* ---- Login Activity ---- */
    const loadLogins = async () => {
        try {
            const { data, error } = await supabase
                .from('hunt_logins')
                .select('*')
                .order('logged_in_at', { ascending: false })
                .limit(50);
            if (error) throw error;
            setLogins(data || []);
            setLoginStatus('');
        } catch (err) {
            console.error(err);
            setLoginStatus('❌ Could not load activity');
        }
    };

    /* ---- Credentials ---- */
    const loadCreds = async () => {
        setCredStatus('Loading...');
        try {
            const { data, error } = await supabase
                .from('hunt_credentials').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setCreds(data || []); setCredStatus('');
        } catch (err) {
            console.error(err); setCredStatus('❌ Failed to load credentials');
        }
    };

    const addCred = async () => {
        if (!newUser.trim() || !newPass.trim()) {
            setAddMsg('⚠️ Please enter both username and password.'); return;
        }
        setAddMsg('');
        try {
            const { error } = await supabase
                .from('hunt_credentials')
                .insert([{ username: newUser.trim(), password: newPass.trim() }]);
            if (error) throw error;
            setNewUser(''); setNewPass('');
            setAddMsg('✅ Credential added!');
            loadCreds();
            setTimeout(() => setAddMsg(''), 2500);
        } catch (err) {
            console.error(err); setAddMsg('❌ Failed to add: ' + err.message);
        }
    };

    const deleteCred = async (id, username) => {
        if (!confirm(`Delete credentials for "${username}"? Their login history and all submitted answers will also be removed.`)) return;
        try {
            // Delete login history for this username
            await supabase.from('hunt_logins').delete().eq('username', username);
            // Delete answer history for this username
            await supabase.from('hunt_answers').delete().eq('username', username);
            // Then delete the credential
            const { error } = await supabase.from('hunt_credentials').delete().eq('id', id);
            if (error) throw error;
            loadCreds();
            loadLogins(); // refresh activity table too
            loadAnswers(); // refresh answer table too
        } catch (err) { alert('Delete failed: ' + err.message); }
    };

    /* ---- Render ---- */
    return (
        <div className="admin-page">
            {/* Header */}
            <div className="admin-header-bar">
                <div className="admin-logo">🔍</div>
                <div className="admin-title">
                    <h1>Campus Hunt — Admin Panel v2.0</h1>
                    <p>Generate QRs · Manage Logins · View Submissions</p>
                </div>
                <div className="badge-admin">ORGANIZER</div>
            </div>

            {/* ===== BODY ===== */}
            <div className="admin-body">

            {/* ===== LOGIN CREDENTIALS ===== */}
            <p className="section-title">🔐 Player Login Credentials</p>
            <GlowCard glowColor="blue" className="!w-full mb-10 h-auto">
                <div style={{ padding: '30px' }}>
                    <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '20px' }}>
                        Add username &amp; password pairs for participants. Each team gets their own credentials to log in before starting the hunt.
                    </p>
                    <div className="cred-form-row">
                        <input
                            id="cred-username"
                            name="cred-username"
                            className="cred-input"
                            type="text"
                            placeholder="Username (e.g. Team Alpha)"
                            autoComplete="off"
                            value={newUser}
                            onChange={e => setNewUser(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCred()}
                        />
                        <input
                            id="cred-password"
                            name="cred-password"
                            className="cred-input"
                            type="text"
                            placeholder="Password"
                            autoComplete="off"
                            value={newPass}
                            onChange={e => setNewPass(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCred()}
                        />
                        <GlassButton size="default" variant="blue" onClick={addCred}>＋ Add</GlassButton>
                    </div>
                {addMsg && (
                    <p style={{ fontSize: '13px', color: addMsg.startsWith('✅') ? 'var(--green)' : 'var(--accent)', marginBottom: '12px' }}>
                        {addMsg}
                    </p>
                )}
                {credStatus && <p style={{ color: 'var(--text3)', fontSize: '13px' }}>{credStatus}</p>}
                {creds.length === 0 && !credStatus ? (
                    <p className="cred-empty">No credentials yet. Add your first one above!</p>
                ) : (
                    <table className="cred-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>USERNAME</th>
                                <th>PASSWORD</th>
                                <th>ADDED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {creds.map((c, i) => (
                                <tr key={c.id}>
                                    <td style={{ color: 'var(--text3)' }}>{i + 1}</td>
                                    <td><b>{c.username}</b></td>
                                    <td><span className="cred-pass">{c.password}</span></td>
                                    <td style={{ color: 'var(--text3)', fontSize: '12px' }}>
                                        {new Date(c.created_at).toLocaleString()}
                                    </td>
                                    <td>
                                        <GlassButton size="sm" variant="red" onClick={() => deleteCred(c.id, c.username)}>Delete</GlassButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                </div>
            </GlowCard>

            {/* ===== URL CONFIG / QR ===== */}
            <p className="section-title">🔗 QR Generator Config</p>
            <GlowCard glowColor="purple" className="!w-full mb-10 h-auto">
                <div style={{ padding: '30px' }}>
                    <div className="url-label" style={{ marginBottom: '12px' }}>🌐 Enter the base URL where your app is hosted:</div>
                    <div className="url-input-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                        <input
                            type="text"
                            className="url-input"
                            style={{ flex: 1 }}
                            placeholder="https://your-domain.com/"
                            value={baseUrl}
                            onChange={e => handleBaseChange(e.target.value)}
                        />
                        <GlassButton size="default" variant="purple" onClick={generateAllQRs}>Generate QRs ✨</GlassButton>
                    </div>
                    <div className="url-note" style={{ color: 'var(--text3)', fontSize: '13px' }}>Each station QR will link to: <code>{urlPreview}</code></div>
                </div>
            </GlowCard>

            <p className="section-title">QR Codes for All Stations</p>
            <div className="print-row" style={{ marginBottom: '24px' }}>
                <GlassButton size="default" variant="amber" onClick={() => window.print()}>🖨️ Print All QR Codes</GlassButton>
            </div>
            <div className="qr-grid">
                {qrCards.length === 0 && (
                    <p style={{ color: 'var(--text2)', padding: '20px 0' }}>
                        Enter a base URL and click "Generate QRs ✨" to create QR codes.
                    </p>
                )}
                {qrCards.map(({ station, url }) => (
                    <GlowCard key={station.id} glowColor="orange" width={280} height={420}>
                        <div className="qr-card" style={{ height: '100%', border: 'none', background: 'transparent' }}>
                            <div className="qr-station-badge">STATION {station.id}</div>
                            <div className="qr-canvas-wrap">
                                <canvas ref={el => { canvasRefs.current[station.id] = el; }} />
                            </div>
                            <div className="qr-station-name">{station.name}</div>
                            <div className="qr-letter">🔐 {station.secretLetter}</div>
                            <div className="qr-url">{url}</div>
                            <GlassButton size="sm" variant="blue" style={{ marginTop: 'auto', width: '100%' }} onClick={() => downloadQR(station)}>⬇️ Download PNG</GlassButton>
                        </div>
                    </GlowCard>
                ))}
            </div>

            {/* ===== STATION SUMMARY ===== */}
            <p className="section-title">Station Summary Table</p>
            <table className="summary-table">
                <thead>
                    <tr>
                        <th>#</th><th>Station</th><th>Secret Letter</th><th>Question</th><th>Fun Task (if wrong)</th>
                    </tr>
                </thead>
                <tbody>
                    {STATION_DATA.map(s => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td><b>{s.name}</b></td>
                            <td><span className="tbl-letter">{s.secretLetter}</span></td>
                            <td>{s.question}</td>
                            <td className="tbl-wrong">{s.funTask}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ===== PLAYER ACTIVITY ===== */}
            <p className="section-title">📊 Player Login Activity</p>
            <GlowCard glowColor="green" className="!w-full mb-10 h-auto">
                <div style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Live log of players who scanned a QR and logged in. Auto-refreshes every 30s.</p>
                        <GlassButton size="sm" variant="green" onClick={loadLogins}>🔄 Refresh</GlassButton>
                    </div>
                    {loginStatus && <p style={{ color: 'var(--text3)', fontSize: '13px', padding: '10px 0' }}>{loginStatus}</p>}
                    {logins.length === 0 && !loginStatus ? (
                        <p className="cred-empty">No logins yet. Players will appear here after scanning a QR and logging in.</p>
                    ) : (
                        <table className="cred-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>PLAYER / TEAM</th>
                                    <th>STATION SCANNED</th>
                                    <th>LOGIN TIME</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logins.map((l, i) => (
                                    <tr key={l.id}>
                                        <td style={{ color: 'var(--text3)' }}>{i + 1}</td>
                                        <td><b>{l.username}</b></td>
                                        <td>
                                            <span style={{
                                                background: 'rgba(108,99,255,0.15)',
                                                color: 'var(--primary2)',
                                                padding: '3px 10px',
                                                borderRadius: '99px',
                                                fontSize: '12px',
                                                fontWeight: 700
                                            }}>
                                                Station {l.station_id}{STATION_DATA.find(s => s.id === l.station_id) ? ` — ${STATION_DATA.find(s => s.id === l.station_id).name}` : ''}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text2)', fontSize: '13px' }}>
                                            {new Date(l.logged_in_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </GlowCard>


            {/* ===== ANSWER ACTIVITY ===== */}
            <p className="section-title">📝 Answer Activity</p>
            <GlowCard glowColor="amber" className="!w-full mb-10 h-auto">
                <div style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Every answer submitted by players — correct or wrong. Auto-refreshes every 30s.</p>
                        <GlassButton size="sm" variant="amber" onClick={loadAnswers}>🔄 Refresh</GlassButton>
                    </div>
                    {answerStatus && <p style={{ color: 'var(--text3)', fontSize: '13px', padding: '10px 0' }}>{answerStatus}</p>}
                    {answers.length === 0 && !answerStatus ? (
                        <p className="cred-empty">No answers yet. They will appear here once players start answering questions.</p>
                    ) : (
                        <table className="cred-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>PLAYER / TEAM</th>
                                    <th>STATION</th>
                                    <th>ANSWER CHOSEN</th>
                                    <th>RESULT</th>
                                    <th>TIME</th>
                                </tr>
                            </thead>
                            <tbody>
                                {answers.map((a, i) => (
                                    <tr key={a.id}>
                                        <td style={{ color: 'var(--text3)' }}>{i + 1}</td>
                                        <td><b>{a.username}</b></td>
                                        <td>
                                            <span style={{ color: 'var(--primary2)', fontSize: '13px', fontWeight: 600 }}>
                                                {a.station_id} — {a.station_name}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '13px', color: 'var(--text)', maxWidth: '200px' }}>
                                            {a.selected_option}
                                        </td>
                                        <td>
                                            {a.is_correct ? (
                                                <span style={{
                                                    background: 'rgba(0,229,160,0.12)',
                                                    color: 'var(--green)',
                                                    padding: '3px 12px', borderRadius: '99px',
                                                    fontSize: '12px', fontWeight: 700,
                                                    border: '1px solid rgba(0,229,160,0.3)'
                                                }}>✅ Correct</span>
                                            ) : (
                                                <span style={{
                                                    background: 'rgba(255,107,107,0.1)',
                                                    color: 'var(--accent)',
                                                    padding: '3px 12px', borderRadius: '99px',
                                                    fontSize: '12px', fontWeight: 700,
                                                    border: '1px solid rgba(255,107,107,0.3)'
                                                }}>❌ Wrong</span>
                                            )}
                                        </td>
                                        <td style={{ color: 'var(--text2)', fontSize: '12px' }}>
                                            {new Date(a.answered_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </GlowCard>

            {/* ===== VIDEO GALLERY ===== */}
            <p className="section-title">📹 Participant Submissions</p>
            <GlowCard glowColor="red" className="!w-full mb-10 h-auto">
                <div style={{ padding: '30px' }}>
                    <p style={{ color: 'var(--text2)', marginBottom: '20px' }}>View recorded task videos from participants</p>
                    <div className="video-gallery">
                        {videoStatus && <div className="gallery-status">{videoStatus}</div>}
                        {videos.map((task, i) => (
                            <div className="video-card" key={i}>
                                <div className="video-station-badge">STATION {task.station_id}</div>
                                <video src={task.video_url} controls playsInline />
                                <div className="video-info">
                                    <span>🕒 {new Date(task.created_at).toLocaleString()}</span>
                                    <span>👤 {task.session_id?.substring(0, 8)}...</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </GlowCard>
            </div>{/* /admin-body */}
        </div>
    );
}
