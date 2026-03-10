import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useStations } from '../hooks/useStations';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function DashboardScreen({ onScanStation, onScanMeme }) {
    const { stations } = useStations();
    const { getCollected, getCompleted, getUsername } = useGameState();
    const [showScanner, setShowScanner] = useState(false);
    const [scanError, setScanError] = useState(null);
    const [scannerKey, setScannerKey] = useState(0);
    const [scanned, setScanned] = useState(false);

    const collectedObj = getCollected();
    const completedArr = getCompleted();
    const username = getUsername() || 'Agent';

    // Find the last completed station
    let lastCompletedStation = null;
    let nextClue = "Search for a starting point! 🔍";

    if (completedArr.length > 0) {
        // Find the station with the highest ID that they have completed
        const highestCompletedId = Math.max(...completedArr);
        lastCompletedStation = stations.find(s => s.id === highestCompletedId);
        if (lastCompletedStation) {
            nextClue = lastCompletedStation.nextClue;
        }
    } else {
        // First station clue
        if (stations.length > 0) {
            nextClue = "Your journey begins! Find Station 1 to start.";
        }
    }

    const collectedLetters = stations.map(station => ({
        id: station.id,
        letter: collectedObj[station.id] || null,
        isCompleted: completedArr.includes(station.id) // They might have completed it but got it wrong
    }));

    const handleScan = (result) => {
        if (scanned) return; // prevent multiple fires
        if (result && result.length > 0) {
            const scanResult = result[0].rawValue;
            console.log('[QR Scan] Raw value:', scanResult); // DEBUG
            setScanned(true);
            try {
                // expecting url like: http://domain.com/?station=X (station may be base64 encoded)
                const url = new URL(scanResult);
                
                // Check if it's a Fake Meme QR trap
                const memeStr = url.searchParams.get('meme');
                if (memeStr) {
                    let parsedMemeId = parseInt(memeStr, 10);
                    if (isNaN(parsedMemeId)) {
                        try {
                            const decoded = atob(memeStr);
                            parsedMemeId = parseInt(decoded, 10);
                        } catch (_) {}
                    }
                    if (!isNaN(parsedMemeId)) {
                        setShowScanner(false);
                        if (onScanMeme) onScanMeme(parsedMemeId);
                        return;
                    }
                }

                // Check if it's a valid Station QR
                const stationStr = url.searchParams.get('station');
                if (stationStr) {
                    // Try direct integer first, then base64 decode
                    let parsedId = parseInt(stationStr, 10);
                    if (isNaN(parsedId)) {
                        try {
                            const decoded = atob(stationStr);
                            parsedId = parseInt(decoded, 10);
                        } catch (_) {}
                    }
                    if (!isNaN(parsedId)) {
                        setShowScanner(false);
                        onScanStation(parsedId);
                        return;
                    }
                }
                setScanError(`Invalid QR Code for Campus Hunt.`);
                setScanned(false);
            } catch (e) {
                // Could be just a raw number or base64 number
                let parsedId = parseInt(scanResult, 10);
                if (isNaN(parsedId)) {
                    try {
                        parsedId = parseInt(atob(scanResult), 10);
                    } catch (_) {}
                }
                if (!isNaN(parsedId)) {
                    setShowScanner(false);
                    onScanStation(parsedId);
                    return;
                }
                setScanError(`Invalid QR Code.`);
                setScanned(false);
            }
        }
    };

    const handleScanError = (error) => {
        console.error('QR Scanner error:', error);
        const msg = error?.message || String(error);
        if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
            setScanError('Camera permission denied. Please allow camera access and try again.');
        } else if (msg.toLowerCase().includes('notfound') || msg.toLowerCase().includes('no camera')) {
            setScanError('No camera found on this device.');
        } else {
            setScanError('Camera error: ' + msg);
        }
    };

    const handleRetry = () => {
        setScanError(null);
        setScanned(false);
        setScannerKey(k => k + 1); // remount scanner
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center pt-10 px-6 relative overflow-hidden bg-background">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blood-red/10 blur-[100px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 w-full max-w-lg flex flex-col gap-6">

                {/* Header Profile */}
                <div className="text-center mb-4">
                    {/* <div className="inline-block relative mb-4">
                        <div className="absolute inset-0 border border-blood-red/40 rounded-full animate-ping opacity-50" />
                        <div className="w-16 h-16 rounded-full bg-black border border-neon-red flex items-center justify-center shadow-[0_0_15px_#FF2E2E]">
                            <span className="text-2xl">🕵️</span>
                        </div>
                    </div> */}
                    <h1 className="font-cinematic text-2xl font-black tracking-widest text-foreground uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                        Agent: <span className="text-neon-red">{username}</span>
                    </h1>
                    <p className="font-body text-xs text-white/50 tracking-widest uppercase mt-1">
                        Active Mission Status Screen
                    </p>
                </div>

                {/* Collected Letters Panel */}
                <div className="bg-black/60 backdrop-blur-md border border-white/10 p-6 relative group">
                    <div className="absolute top-0 left-0 w-8 h-[1px] bg-gold" />
                    <div className="absolute top-0 left-0 w-[1px] h-8 bg-gold" />

                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-gold animate-pulse">🏆</span>
                        <h2 className="font-cinematic text-sm uppercase tracking-widest text-gold font-bold">Encrypted Fragments</h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {collectedLetters.map((item, idx) => {
                            const isMissed = !item.letter && item.isCompleted;
                            const isLocked = !item.letter && !item.isCompleted;

                            return (
                                <div
                                    key={idx}
                                    className={`relative w-12 h-12 flex items-center justify-center border font-cinematic text-xl font-bold transition-all
                                        ${item.letter ? 'border-neon-red bg-blood-red/20 text-neon-red shadow-[0_0_10px_#8b0000]' : ''}
                                        ${isMissed ? 'border-white/10 bg-white/5 text-white/20' : ''}
                                        ${isLocked ? 'border-dashed border-white/20 text-white/20' : ''}
                                    `}
                                >
                                    {item.letter ? item.letter : (isMissed ? '❌' : '🔒')}
                                    {item.letter && (
                                        <div className="absolute inset-0 bg-neon-red opacity-0 group-hover:opacity-10 transition-opacity" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Current Clue Panel */}
                <div className="bg-blood-red/5 border border-neon-red/30 p-6 relative overflow-hidden">
                    <div className="absolute -left-[100%] top-0 w-[200%] h-full bg-gradient-to-r from-transparent via-blood-red/10 to-transparent animate-[shimmer_3s_infinite]" />

                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <span className="text-neon-red">🗺️</span>
                        <h2 className="font-cinematic text-sm uppercase tracking-widest text-neon-red font-bold animate-pulse">Active Directive</h2>
                    </div>

                    <p className="font-body text-lg text-white/90 relative z-10 leading-relaxed font-medium">
                        {nextClue}
                    </p>
                    {lastCompletedStation?.id === 3 && (
                        <div className="mt-4 flex flex-row gap-4 justify-center items-center p-4 bg-black/40 border border-white/10 rounded relative z-10">
                            <img src="/images/NAND.png" alt="NAND Gate" className="h-[80px] md:h-[100px] w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                            <img src="/images/NOR.png" alt="NOR Gate" className="h-[80px] md:h-[100px] w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
                        </div>
                    )}
                    {lastCompletedStation?.id === 6 && (
                        <div className="mt-4 border border-white/10 rounded overflow-hidden relative z-10 w-full flex justify-center bg-black/40">
                            <img src="/images/lab.jpeg" alt="Coordinate Clue" className="w-full max-h-[300px] object-contain" />
                        </div>
                    )}
                </div>

                {/* Scanner Interface */}
                {!showScanner ? (
                    <button
                        className="w-full relative overflow-hidden bg-black border border-white/20 p-6 flex flex-col items-center justify-center gap-3 hover:border-gold hover:bg-white/5 transition-all group"
                        onClick={() => { setShowScanner(true); setScanError(null); }}
                    >
                        {/* Radar sweep line */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gold/50 translate-y-[-10px] group-hover:animate-[scan_2s_ease-in-out_infinite]" />

                        <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center group-hover:shadow-[0_0_15px_#D4AF37] transition-all">
                            <span className="text-xl">📷</span>
                        </div>
                        <span className="font-cinematic text-sm uppercase tracking-widest text-gold font-bold">
                            Scan Next Checkpoint QR
                        </span>
                    </button>
                ) : (
                    <div className="bg-black border border-neon-red p-4 relative animate-in fade-in zoom-in duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse" />
                                <span className="font-cinematic text-sm uppercase tracking-widest text-neon-red">Targeting...</span>
                            </div>
                            <button
                                onClick={() => setShowScanner(false)}
                                className="text-xs uppercase tracking-wider text-white/50 hover:text-white"
                            >
                                [ ABORT ]
                            </button>
                        </div>

                        <div className="rounded border border-white/10 overflow-hidden relative bg-background">
                            {/* Four corner targeting brackets */}
                            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-neon-red z-30 pointer-events-none" />
                            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-neon-red z-30 pointer-events-none" />
                            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-neon-red z-30 pointer-events-none" />
                            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-neon-red z-30 pointer-events-none" />

                            <Scanner
                                key={scannerKey}
                                onScan={handleScan}
                                onError={handleScanError}
                                formats={['qr_code']}
                                sound={false}
                                scanDelay={1500}
                                constraints={{ facingMode: 'environment' }}
                                components={{ finder: false }}
                            />
                        </div>

                        {scanError && (
                            <div className="mt-4 p-2 bg-blood-red/20 border border-neon-red text-neon-red text-center text-xs font-cinematic uppercase tracking-widest">
                                <div>{scanError}</div>
                                <button
                                    onClick={handleRetry}
                                    className="mt-2 text-white/70 hover:text-white underline text-xs"
                                >
                                    Tap to retry
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Custom Tailwind animation injection for the scanner sweep since we didn't add it to tailwind config yet */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(50%); }
                }
                @keyframes scan {
                    0% { transform: translateY(-10px); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(100px); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
