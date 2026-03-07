import { useCallback } from 'react';

let memoryCollected = {};
let memoryCompleted = [];
let memorySessionId = null;
let memoryUsername = null;

export function useGameState() {
    const getSessionId = useCallback(() => {
        if (!memorySessionId) {
            memorySessionId = 'user_' + Math.random().toString(36).substr(2, 9);
        }
        return memorySessionId;
    }, []);

    const getCollected = useCallback(() => {
        return memoryCollected;
    }, []);

    const getCompleted = useCallback(() => {
        return memoryCompleted;
    }, []);

    const saveCollected = useCallback((obj) => {
        memoryCollected = { ...obj };
    }, []);

    const saveCompleted = useCallback((arr) => {
        memoryCompleted = [...arr];
    }, []);

    const collectLetter = useCallback((stationId, letter) => {
        memoryCollected[stationId] = letter;
    }, []);

    const markCompleted = useCallback((stationId) => {
        if (!memoryCompleted.includes(stationId)) {
            memoryCompleted.push(stationId);
        }
        return memoryCompleted;
    }, []);

    const getUsername = useCallback(() => {
        return memoryUsername;
    }, []);

    const setUsernameState = useCallback((name) => {
        memoryUsername = name;
    }, []);

    const resetGameState = useCallback(() => {
        memoryCollected = {};
        memoryCompleted = [];
        memorySessionId = null;
        memoryUsername = null;
    }, []);

    return { 
        getSessionId, getCollected, getCompleted, saveCollected, saveCompleted, 
        collectLetter, markCompleted, getUsername, setUsernameState, resetGameState
    };
}
