import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const StationContext = createContext();

export function StationProvider({ children }) {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadStations = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('hunt_stations')
                .select('*')
                .order('id', { ascending: true });
                
            if (error) throw error;
            
            // Map db schema back to original object shape to minimize breaking changes
            const formatted = (data || []).map(s => ({
                id: s.id,
                name: s.name,
                question: s.question,
                options: s.options,
                correctIndex: s.correct_index,
                secretLetter: s.secret_letter,
                nextClue: s.next_clue,
                funTask: s.fun_task
            }));
            
            setStations(formatted);
            setError(null);
        } catch (err) {
            console.error("Failed to load stations:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStations();
    }, []);

    const value = {
        stations,
        loading,
        error,
        refreshStations: loadStations
    };

    return (
        <StationContext.Provider value={value}>
            {children}
        </StationContext.Provider>
    );
}

export function useStations() {
    return useContext(StationContext);
}
