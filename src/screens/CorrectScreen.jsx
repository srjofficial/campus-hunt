import { useStations } from '../hooks/useStations';
import ProgressLetters from '../components/ProgressLetters';

export default function CorrectScreen({ station, isRevisit, onNext }) {
    const { stations } = useStations();
    const isLast = station.id === stations.length;

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
            
            {/* Ambient Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-900/10 blur-[100px] rounded-full pointer-events-none z-0" />
            
            <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center gap-6">
                
                {isRevisit && (
                    <div className="w-full bg-blood-red/10 border border-neon-red/50 text-neon-red p-3 text-xs font-cinematic uppercase tracking-widest animate-pulse">
                        ⚠️ Data Already Extracted. Proceed to next coordinate.
                    </div>
                )}

                {/* Success Icon */}
                <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 border border-green-500/30 rounded-full animate-ping" />
                    <div className="absolute inset-2 border-t border-green-500/50 rounded-full animate-spin" />
                    <span className="text-4xl drop-shadow-[0_0_15px_#22c55e]">✔️</span>
                </div>

                <h1 className="font-cinematic text-4xl font-black tracking-widest text-green-500 uppercase drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                    Validated
                </h1>
                <p className="font-body text-sm text-white/50 tracking-widest uppercase">
                    Answer Confirmed
                </p>

                {/* Secret Letter Reveal */}
                <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 p-6 relative group mt-4 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500 opacity-50" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500 opacity-50" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500 opacity-50" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500 opacity-50" />

                    <div className="text-[10px] font-cinematic text-green-500 uppercase tracking-widest mb-4">
                        Decrypted Payload Fragment
                    </div>
                    
                    <div className="text-6xl font-cinematic font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] my-6">
                        {station.secretLetter}
                    </div>
                    
                    <div className="text-[10px] font-body text-white/40 uppercase tracking-widest">
                        Collect {stations.length} fragments to unlock the core
                    </div>
                </div>

                {/* Next Station Clue */}
                <div className="w-full bg-green-900/10 border border-green-500/30 p-5 text-left relative overflow-hidden mt-4">
                    <div className="absolute -left-[100%] top-0 w-[200%] h-full bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-[shimmer_3s_infinite]" />
                    <div className="text-[10px] font-cinematic text-green-500 uppercase tracking-widest mb-2">
                        {isLast ? 'Final Objective' : 'Next Coordinate Clue'}
                    </div>
                    <p className="font-body text-sm font-medium text-white/90 leading-relaxed">
                        {station.nextClue}
                    </p>
                </div>

                <button
                    onClick={onNext}
                    className="w-full mt-6 bg-[rgba(0,255,0,0.1)] border border-green-500 py-4 font-cinematic uppercase tracking-[0.2em] font-bold text-green-500 hover:bg-green-500 hover:text-black transition-all duration-300 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 translate-x-[2px] bg-green-400 mix-blend-screen opacity-50" />
                    </div>
                    <span className="relative z-10 group-hover:animate-pulse">Acknowledge</span>
                </button>

            </div>
        </div>
    );
}

