import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGameState } from './hooks/useGameState';
import { useStations } from './hooks/useStations';
import { supabase } from './lib/supabase';
import EtherealShadow from './components/EtherealShadow';
import LoginScreen from './screens/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';
import NoStationScreen from './screens/NoStationScreen';
import AlreadyDoneScreen from './screens/AlreadyDoneScreen';
import QuestionScreen from './screens/QuestionScreen';
import CorrectScreen from './screens/CorrectScreen';
import WrongScreen from './screens/WrongScreen';
import TaskDoneScreen from './screens/TaskDoneScreen';
import WaitingScreen from './screens/WaitingScreen';
import FinalScreen from './screens/FinalScreen';
import DashboardScreen from './screens/DashboardScreen';
import CinematicIntro from './screens/CinematicIntro';

const SCREENS = {
  INTRO: 'intro',
  LOGIN: 'login',
  LOADING: 'loading',
  NO_STATION: 'no-station',
  DASHBOARD: 'dashboard',
  ALREADY: 'already-done',
  QUESTION: 'question',
  CORRECT: 'correct',
  WRONG: 'wrong',
  TASK_DONE: 'task-done',
  WAITING: 'waiting',
  FINAL: 'final',
};

export default function App() {
  const { stations, loading } = useStations();
  const [searchParams] = useSearchParams();
  
  let stationId = NaN;
  const rawStationParam = searchParams.get('station');
  if (rawStationParam) {
    try {
      // Decode base64 obfuscated station ID
      stationId = parseInt(atob(rawStationParam));
    } catch (e) {
      // Fallback for non-base64 (legacy links or tampering)
      stationId = parseInt(rawStationParam);
    }
  }
  
  const hasStation = !isNaN(stationId);

  // Always start at login — skip the scrolling cinematic intro
  const initialScreen = SCREENS.LOGIN;
  
  const [screen, setScreen] = useState(initialScreen);
  const [station, setStation] = useState(null);
  const [isRevisit, setIsRevisit] = useState(false);

  const { getCompleted, collectLetter, markCompleted, getUsername } = useGameState();

  const currentStation = hasStation
    ? stations.find(s => s.id === stationId) || null
    : null;

  // After login succeeds → go to loading
  const handleLoginSuccess = () => {
    setScreen(SCREENS.LOADING);
  };

  // After CinematicIntro finishes → go to login
  const handleIntroComplete = () => {
    setScreen(SCREENS.LOGIN);
  };

  // After loading finishes, sync with Supabase and route appropriately
  const handleLoadingDone = async () => {
    // If no specific station is scanned, we just want to show the Dashboard
    if (!currentStation) {
      setScreen(SCREENS.DASHBOARD);
      return;
    }

    const username = getUsername();
    if (username) {
      try {
        // Fetch all answers for this player to restore game progress across logins
        const { data: allAnswers } = await supabase
          .from('hunt_answers')
          .select('*')
          .eq('username', username);

        if (allAnswers && allAnswers.length > 0) {
          // Restore progress into memory
          allAnswers.forEach(ans => {
            markCompleted(ans.station_id);
            const s = stations.find(st => st.id === ans.station_id);
            if (s) collectLetter(s.id, s.secretLetter);
          });

          // Check if they already answered THIS specific station scanned
          const thisAns = allAnswers.find(a => a.station_id === currentStation.id);
          if (thisAns) {
            setStation(currentStation);
            setIsRevisit(true);
            // Show outcome again instead of a generic "Already Done"
            if (thisAns.is_correct) setScreen(SCREENS.CORRECT);
            else setScreen(SCREENS.WRONG);
            return;
          }
        }
      } catch (err) {
        console.error('Answer check failed:', err);
      }
    }

    setStation(currentStation);
    setIsRevisit(false);
    setScreen(SCREENS.QUESTION);
  };

  const handleCorrect = (s) => {
    collectLetter(s.id, s.secretLetter);
    setStation(s);
    setScreen(SCREENS.CORRECT);
  };

  const handleWrong = (s) => {
    setStation(s);
    setScreen(SCREENS.WRONG);
  };

  const handleTaskDone = (s) => {
    collectLetter(s.id, s.secretLetter);
    const completed = markCompleted(s.id);
    setStation(s);
    if (completed.length >= stations.length) setScreen(SCREENS.FINAL);
    else setScreen(SCREENS.TASK_DONE);
  };

  const handleCorrectNext = () => {
    const completed = markCompleted(station.id);
    if (completed.length >= stations.length) setScreen(SCREENS.FINAL);
    else {
      window.history.pushState(null, '', window.location.pathname);
      setScreen(SCREENS.DASHBOARD);
    }
  };

  const handleTaskDoneNext = () => {
    const completed = getCompleted();
    if (completed.length >= stations.length) setScreen(SCREENS.FINAL);
    else {
      window.history.pushState(null, '', window.location.pathname);
      setScreen(SCREENS.DASHBOARD);
    }
  };

  const handleScanStation = (id) => {
    const parsedParams = new URLSearchParams(window.location.search);
    // encode station ID to base64 when updating URL
    parsedParams.set('station', btoa(id.toString()));
    window.history.pushState(null, '', `?${parsedParams.toString()}`);
    // Reload so App state grabs the station
    window.location.reload();
  };

  if (loading) {
    return <EtherealShadow color="rgba(139, 0, 0, 0.8)" sizing="fill" style={{ width: '100%', height: '100%' }} />;
  }

  const getShadowColor = () => {
    switch (screen) {
      case SCREENS.QUESTION:
        return 'rgba(0, 150, 255, 0.6)'; // Blue
      case SCREENS.CORRECT:
        return 'rgba(0, 255, 100, 0.6)'; // Green
      case SCREENS.WRONG:
        return 'rgba(255, 0, 0, 0.7)'; // Red
      case SCREENS.TASK_DONE:
        return 'rgba(255, 215, 0, 0.6)'; // Gold
      default:
        return 'rgba(139, 0, 0, 0.8)'; // Default dark red
    }
  };

  return (
    <>
      {/* Universal Ethereal Shadow Background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <EtherealShadow
          color={getShadowColor()}
          animation={{ scale: 60, speed: 30 }}
          noise={{ opacity: 0.6, scale: 1.5 }}
          sizing="fill"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="noise-overlay" />
      <div className="vignette-overlay" />
      <div className="relative z-10 w-full min-h-screen text-foreground">
        {screen === SCREENS.INTRO && <CinematicIntro onComplete={handleIntroComplete} />}
        {screen === SCREENS.LOGIN && <LoginScreen onSuccess={handleLoginSuccess} />}
        {screen === SCREENS.LOADING && <LoadingScreen onDone={handleLoadingDone} />}
        {screen === SCREENS.NO_STATION && <NoStationScreen />}
        {screen === SCREENS.DASHBOARD && <DashboardScreen onScanStation={handleScanStation} />}
        {screen === SCREENS.ALREADY && <AlreadyDoneScreen station={station} />}
        {screen === SCREENS.QUESTION && <QuestionScreen station={station} onCorrect={handleCorrect} onWrong={handleWrong} />}
        {screen === SCREENS.CORRECT && <CorrectScreen station={station} isRevisit={isRevisit} onNext={handleCorrectNext} />}
        {screen === SCREENS.WRONG && <WrongScreen station={station} isRevisit={isRevisit} onTaskDone={handleTaskDone} />}
        {screen === SCREENS.TASK_DONE && <TaskDoneScreen station={station} isRevisit={isRevisit} onNext={handleTaskDoneNext} />}
        {screen === SCREENS.WAITING && <WaitingScreen station={station} />}
        {screen === SCREENS.FINAL && <FinalScreen />}
      </div>
    </>
  );
}
