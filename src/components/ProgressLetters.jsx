import { STATION_DATA } from '../data';
import { useGameState } from '../hooks/useGameState';

export default function ProgressLetters() {
    const { getCollected, getCompleted } = useGameState();
    const collected = getCollected();
    const completed = getCompleted();

    return (
        <div className="progress-letters">
            {STATION_DATA.map(s => {
                const letter = collected[s.id];
                let cls = 'prog-letter';
                let label = String(s.id);
                if (letter) { cls += ' collected'; label = letter; }
                else if (completed.includes(s.id)) { cls += ' missed'; label = '✗'; }
                return <div key={s.id} className={cls}>{label}</div>;
            })}
        </div>
    );
}
