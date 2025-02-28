// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const darkTheme = {
  background: '#080808',
  text: '#e0e0e0',
  primary: '#8a0303',
  secondary: '#1a1a1a',
  accent: '#600',
  danger: '#ff0000',
  surface: '#101010',
  border: '#333',
  fear: {
    low: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
    medium: 'linear-gradient(135deg, #200 0%, #100 100%)',
    high: 'linear-gradient(135deg, #300 0%, #200 100%)'
  }
};

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Special+Elite&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    height: 100%;
    font-size: 16px;
    overflow-x: hidden;
  }
  
  body {
    font-family: 'Crimson Text', serif;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    line-height: 1.6;
    position: relative;
    transition: background-color 2s ease;
    
    &:before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${props => {
        if (props.fearLevel >= 70) return props.theme.fear.high;
        if (props.fearLevel >= 30) return props.theme.fear.medium;
        return props.theme.fear.low;
      }};
      opacity: 0.7;
      z-index: -1;
      transition: background 1s ease;
    }
    
    &:after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%);
      pointer-events: none;
      z-index: -1;
    }
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Special Elite', cursive;
    letter-spacing: 0.5px;
    margin-bottom: 1rem;
  }
  
  h1 {
    font-size: 3rem;
    
    @media (max-width: 768px) {
      font-size: 2.2rem;
    }
  }
  
  h2 {
    font-size: 2rem;
    
    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  button {
    font-family: 'Crimson Text', serif;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  input {
    font-family: 'Crimson Text', serif;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.secondary};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.accent};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.primary};
  }
  
  // Căn chỉnh responsive
  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }
  
  // Tạo hiệu ứng nhiễu màn hình khi fearLevel cao
  ${props => props.fearLevel > 50 ? `
    @keyframes textDistortion {
      0% { text-shadow: 1px 0 0 rgba(255,0,0,0.5), -1px 0 0 rgba(0,255,255,0.5); }
      25% { text-shadow: -1px 0 0 rgba(255,0,0,0.5), 1px 0 0 rgba(0,255,255,0.5); }
      50% { text-shadow: -1px -1px 0 rgba(255,0,0,0.5), 1px 1px 0 rgba(0,255,255,0.5); }
      75% { text-shadow: 1px -1px 0 rgba(255,0,0,0.5), -1px 1px 0 rgba(0,255,255,0.5); }
      100% { text-shadow: 1px 0 0 rgba(255,0,0,0.5), -1px 0 0 rgba(0,255,255,0.5); }
    }
    
    p {
      animation: textDistortion ${100 - props.fearLevel}s infinite;
    }
  ` : ''}
`;
