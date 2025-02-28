// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get initial story based on scenario
export const getStory = async (scenario, character) => {
  try {
    const response = await axios.post(`${API_URL}/story/start`, {
      scenario,
      character
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to get story");
  }
};

// Make a choice and get the next part of the story
export const makeChoice = async (sessionId, choice, previousStory, scenario) => {
  try {
    const response = await axios.post(`${API_URL}/story/choice`, {
      sessionId,
      choice,
      previousStory,
      scenario
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to make choice");
  }
};

// Save game progress
export const saveGame = async (gameState) => {
  try {
    const response = await axios.post(`${API_URL}/game/save`, {
      sessionId: gameState.sessionId,
      gameState
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    // Continue silently - local storage will be our backup
  }
};

// Load saved game progress
export const loadGame = async (sessionId) => {
  try {
    const response = await axios.get(`${API_URL}/game/load/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to load game");
  }
};
