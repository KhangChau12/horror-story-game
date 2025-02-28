// src/App.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import StartScreen from './components/StartScreen';
import StoryScreen from './components/StoryScreen';
import LoadingScreen from './components/LoadingScreen';
import { GlobalStyles, darkTheme } from './styles/GlobalStyles';
import { getStory, makeChoice, saveGame } from './services/api';

function App() {
  const [gameState, setGameState] = useState({
    started: false,
    loading: false,
    storyText: '',
    choices: [],
    sessionId: null,
    scenario: '',
    fearLevel: 0,
    character: {
      name: '',
      gender: ''
    }
  });
  
  const [audio] = useState(new Audio('/horror-ambience.mp3'));

  useEffect(() => {
    // Attempt to load saved game
    const savedGame = localStorage.getItem('horrorStoryGame');
    if (savedGame) {
      const parsed = JSON.parse(savedGame);
      setGameState(prevState => ({
        ...prevState,
        ...parsed
      }));
    }
    
    // Set up audio
    audio.loop = true;
    
    return () => {
      audio.pause();
    };
  }, [audio]);

  const startGame = async (scenario, character) => {
    setGameState(prevState => ({
      ...prevState,
      loading: true,
      character
    }));
    
    try {
      audio.play().catch(e => console.log("Audio play failed:", e));
      
      const response = await getStory(scenario, character);
      setGameState(prevState => ({
        ...prevState,
        started: true,
        loading: false,
        storyText: response.story,
        choices: response.choices,
        sessionId: response.sessionId,
        scenario,
        fearLevel: 10
      }));
      
      // Save game
      saveGameState({
        started: true,
        storyText: response.story,
        choices: response.choices,
        sessionId: response.sessionId,
        scenario,
        fearLevel: 10,
        character
      });
    } catch (error) {
      console.error("Failed to start game:", error);
      setGameState(prevState => ({
        ...prevState,
        loading: false
      }));
    }
  };

  const handleChoice = async (choiceIndex) => {
    const selectedChoice = gameState.choices[choiceIndex];
    
    setGameState(prevState => ({
      ...prevState,
      loading: true
    }));
    
    try {
      const response = await makeChoice(
        gameState.sessionId, 
        selectedChoice, 
        gameState.storyText,
        gameState.scenario
      );
      
      const newFearLevel = Math.min(100, gameState.fearLevel + response.fearIncrease);
      
      setGameState(prevState => ({
        ...prevState,
        loading: false,
        storyText: prevState.storyText + "\n\n" + response.story,
        choices: response.choices,
        fearLevel: newFearLevel
      }));
      
      // Save game
      saveGameState({
        ...gameState,
        storyText: gameState.storyText + "\n\n" + response.story,
        choices: response.choices,
        fearLevel: newFearLevel
      });
    } catch (error) {
      console.error("Failed to make choice:", error);
      setGameState(prevState => ({
        ...prevState,
        loading: false
      }));
    }
  };

  const saveGameState = (state) => {
    localStorage.setItem('horrorStoryGame', JSON.stringify(state));
    saveGame(state);
  };

  const resetGame = () => {
    localStorage.removeItem('horrorStoryGame');
    setGameState({
      started: false,
      loading: false,
      storyText: '',
      choices: [],
      sessionId: null,
      scenario: '',
      fearLevel: 0,
      character: {
        name: '',
        gender: ''
      }
    });
    audio.pause();
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles fearLevel={gameState.fearLevel} />
      {gameState.loading ? (
        <LoadingScreen />
      ) : !gameState.started ? (
        <StartScreen onStart={startGame} />
      ) : (
        <StoryScreen 
          storyText={gameState.storyText}
          choices={gameState.choices}
          onChoiceSelected={handleChoice}
          fearLevel={gameState.fearLevel}
          onReset={resetGame}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
