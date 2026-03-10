import { useState, useRef, useEffect } from 'react';
import GlassButton from '../components/GlassButton';

export default function FakeMemeScreen({ memeFilename, onSkip }) {
    const [canSkip, setCanSkip] = useState(false);
    const videoRef = useRef(null);

    // Some devices might pause indefinitely or have issues with events.
    // We can also use timeupdate just in case onEnded is flaky with loop=true.
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        // If we played at least 95% of the duration, allow skipping
        // (onEnded sometimes doesn't fire when loop is true)
        if (videoRef.current.currentTime >= videoRef.current.duration - 0.5) {
            setCanSkip(true);
        }
    };

    return (
        <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center fixed inset-0 z-50 overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/20 blur-[100px] rounded-full pointer-events-none z-0" />
            
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
                
                <div className="text-center mb-6 animate-pulse px-4">
                    <h1 className="font-cinematic pt-4 text-2xl md:text-3xl font-black tracking-widest text-red-600 uppercase drop-shadow-[0_0_10px_rgba(255,0,0,0.4)]">
                        You been taken adwantage of your ideocy
                    </h1>
                    <p className="font-body text-xs text-white/50 tracking-widest uppercase mt-4">
                        Bogus Data Extracted
                    </p>
                </div>

                <div className="w-full max-w-lg rounded-md overflow-hidden border-2 border-red-600/50 shadow-[0_0_30px_rgba(255,0,0,0.2)] bg-black relative">
                    <video 
                        ref={videoRef}
                        src={`/meme/${memeFilename}`} 
                        className="w-full max-h-[50vh] object-contain relative z-10 bg-black"
                        autoPlay 
                        loop 
                        playsInline
                        muted={false}
                        onTimeUpdate={handleTimeUpdate}
                        // To be safe we disable context menu and controls
                        onContextMenu={e => e.preventDefault()}
                        controls={false}
                    />
                </div>

                <div className="mt-10 min-h-[60px] flex justify-center w-full max-w-xs">
                    {canSkip ? (
                        <GlassButton size="default" variant="red" onClick={onSkip} className="animate-in fade-in zoom-in duration-500">
                            Skip Prank
                        </GlassButton>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-white/30 text-xs font-cinematic uppercase tracking-[0.2em] animate-pulse">
                            <div className="w-6 h-6 border-t-2 border-red-600/50 rounded-full animate-spin mb-2" />
                            Analyzing payload...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
