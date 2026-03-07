import { STATION_DATA } from '../data';

export default function TaskDoneScreen({ station, onNext }) {
    const isLast = station.id === STATION_DATA.length;

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
            
            {/* Ambient Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 blur-[100px] rounded-full pointer-events-none z-0" />
            
            <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center gap-6">
                
                {/* Override Icon */}
                <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 border border-gold/30 rounded-full animate-ping" />
                    <div className="absolute inset-2 border-t border-gold/50 rounded-full animate-spin" />
                    <span className="text-4xl drop-shadow-[0_0_15px_#D4AF37]">⚙️</span>
                </div>

                <h1 className="font-cinematic text-4xl font-black tracking-widest text-gold uppercase drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                    Override Successful
                </h1>
                <p className="font-body text-sm text-white/50 tracking-widest uppercase mb-4">
                    Penalty Satisfied
                </p>

                {/* Secret Letter Reveal */}
                <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 p-6 relative group mt-4 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold opacity-50" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold opacity-50" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold opacity-50" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold opacity-50" />

                    <div className="text-[10px] font-cinematic text-gold uppercase tracking-widest mb-4">
                        Recovered Payload
                    </div>
                    
                    <div className="text-6xl font-cinematic font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] my-6">
                        {station.secretLetter}
                    </div>
                    
                    <div className="text-[10px] font-body text-white/40 uppercase tracking-widest">
                        Collect {STATION_DATA.length} fragments to unlock the core
                    </div>
                </div>

                {/* Next Station Clue */}
                <div className="w-full bg-black/40 border border-gold/30 p-5 text-left relative overflow-hidden mt-4">
                    <div className="absolute -left-[100%] top-0 w-[200%] h-full bg-gradient-to-r from-transparent via-gold/10 to-transparent animate-[shimmer_3s_infinite]" />
                    <div className="text-[10px] font-cinematic text-gold uppercase tracking-widest mb-2">
                        {isLast ? 'Final Objective' : 'Next Coordinate Clue'}
                    </div>
                    <p className="font-body text-sm font-medium text-white/90 leading-relaxed">
                        {station.nextClue}
                    </p>
                </div>

                <button
                    onClick={onNext}
                    className="w-full mt-6 bg-[rgba(255,200,0,0.1)] border border-gold/50 py-4 font-cinematic uppercase tracking-[0.2em] font-bold text-gold hover:bg-gold hover:text-black transition-all duration-300 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 translate-x-[2px] bg-yellow-500 mix-blend-screen opacity-50" />
                    </div>
                    <span className="relative z-10 group-hover:animate-pulse">Proceed to Coordinates</span>
                </button>

            </div>
        </div>
    );
}

