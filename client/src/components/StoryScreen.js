// src/components/StoryScreen.js
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import Typewriter from 'typewriter-effect';

const StoryScreen = ({ storyText, choices, onChoiceSelected, fearLevel, onReset }) => {
  const [typing, setTyping] = useState(true);
  const storyContainerRef = useRef(null);
  
  // Split the story text into sections (for typewriter effect)
  const sections = storyText.split("\n\n");
  const latestSection = sections[sections.length - 1];
  const previousSections = sections.slice(0, -1).join("\n\n");

  useEffect(() => {
    setTyping(true);
    
    // Auto-scroll to bottom when new text arrives
    if (storyContainerRef.current) {
      storyContainerRef.current.scrollTop = storyContainerRef.current.scrollHeight;
    }
  }, [storyText]);

  return (
    <Container fearLevel={fearLevel}>
      <StoryContainer ref={storyContainerRef} fearLevel={fearLevel}>
        {previousSections && <PreviousText fearLevel={fearLevel}>{previousSections}</PreviousText>}
        
        {latestSection && (
          <TypewriterContainer>
            {typing ? (
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .changeDelay(30)
                    .typeString(latestSection)
                    .callFunction(() => setTyping(false))
                    .start();
                }}
                options={{
                  cursor: '_'
                }}
              />
            ) : (
              <span>{latestSection}</span>
            )}
          </TypewriterContainer>
        )}
      </StoryContainer>
      
      <FearMeter fearLevel={fearLevel}>
        <FearLabel fearLevel={fearLevel}>Nỗi sợ: {fearLevel}%</FearLabel>
        <FearBar>
          <FearProgress fearLevel={fearLevel} />
        </FearBar>
      </FearMeter>

      <ChoicesContainer>
        {!typing && choices.map((choice, index) => (
          <ChoiceButton 
            key={index} 
            onClick={() => onChoiceSelected(index)}
            fearLevel={fearLevel}
            delay={index * 0.3}
          >
            {choice}
          </ChoiceButton>
        ))}
        
        {!typing && choices.length === 0 && (
          <EndGameMessage>
            <p>Câu chuyện đã kết thúc.</p>
            <ChoiceButton onClick={onReset}>Bắt đầu lại</ChoiceButton>
          </EndGameMessage>
        )}
      </ChoicesContainer>
      
      <ResetButton onClick={onReset}>Trò chơi mới</ResetButton>
    </Container>
  );
};

// Animation keyframes
const flicker = keyframes`
  0% { opacity: 1; }
  3% { opacity: 0.8; }
  6% { opacity: 1; }
  9% { opacity: 0.8; }
  12% { opacity: 1; }
  70% { opacity: 1; }
  72% { opacity: 0.4; }
  74% { opacity: 1; }
  100% { opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
`;

const heartbeat = keyframes`
  0% { transform: scale(1); }
  2% { transform: scale(1.05); }
  4% { transform: scale(1); }
  6% { transform: scale(1.05); }
  8% { transform: scale(1); }
  100% { transform: scale(1); }
`;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => {
      if (props.fearLevel >= 70) return 'radial-gradient(circle at center, #600 0%, #200 70%)';
      if (props.fearLevel >= 30) return 'radial-gradient(circle at center, #400 0%, #100 70%)';
      return 'radial-gradient(circle at center, #300 0%, #000 70%)';
    }};
    z-index: -1;
    animation: ${flicker} ${props => Math.max(20 - props.fearLevel/5, 5)}s infinite;
  }
  
  ${props => props.fearLevel >= 80 && css`
    animation: ${heartbeat} 3s infinite;
  `}
`;

const StoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  margin-bottom: 20px;
  border: 1px solid ${props => {
    if (props.fearLevel >= 70) return 'rgba(200, 0, 0, 0.5)';
    if (props.fearLevel >= 30) return 'rgba(120, 0, 0, 0.3)';
    return 'rgba(70, 0, 0, 0.2)';
  }};
  box-shadow: 0 0 ${props => Math.min(props.fearLevel/10, 10)}px rgba(255, 0, 0, 0.2);
  position: relative;
  scroll-behavior: smooth;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background: linear-gradient(to bottom, 
      rgba(255,0,0,0.03) 0%, 
      rgba(0,0,0,0) 20%, 
      rgba(0,0,0,0) 80%, 
      rgba(255,0,0,0.03) 100%
    );
  }
`;

const PreviousText = styled.div`
  margin-bottom: 20px;
  line-height: 1.6;
  color: ${props => props.fearLevel >= 50 ? '#ccc' : '#aaa'};
  font-size: 1.05rem;
  text-shadow: ${props => props.fearLevel >= 70 ? '0 0 5px rgba(255,0,0,0.3)' : 'none'};
  letter-spacing: ${props => props.fearLevel >= 70 ? '0.3px' : 'normal'};
`;

const TypewriterContainer = styled.div`
  line-height: 1.6;
  color: #fff;
  font-size: 1.1rem;
  letter-spacing: 0.3px;
  
  .Typewriter__cursor {
    color: #ff3333;
  }
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChoiceButton = styled.button`
  padding: 15px;
  background: ${props => {
    if (props.fearLevel >= 70) return 'rgba(50, 0, 0, 0.8)';
    if (props.fearLevel >= 30) return 'rgba(40, 0, 0, 0.7)';
    return 'rgba(30, 0, 0, 0.6)';
  }};
  border: 1px solid ${props => {
    if (props.fearLevel >= 70) return 'rgba(200, 0, 0, 0.6)';
    if (props.fearLevel >= 30) return 'rgba(150, 0, 0, 0.4)';
    return 'rgba(100, 0, 0, 0.3)';
  }};
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: ${props => props.delay || 0}s;
  opacity: 0;
  
  &:hover {
    background: ${props => {
      if (props.fearLevel >= 70) return 'rgba(80, 0, 0, 0.9)';
      if (props.fearLevel >= 30) return 'rgba(60, 0, 0, 0.8)';
      return 'rgba(50, 0, 0, 0.7)';
    }};
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
  }
  
  ${props => props.fearLevel >= 50 && css`
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.1), transparent);
      transition: 0.5s;
    }
    
    &:hover:before {
      left: 100%;
    }
  `}
`;

const FearMeter = styled.div`
  margin-bottom: 20px;
`;

const FearLabel = styled.div`
  margin-bottom: 5px;
  color: ${props => {
    if (props.fearLevel >= 70) return '#ff6666';
    if (props.fearLevel >= 50) return '#ff9999';
    return '#fff';
  }};
  font-weight: ${props => props.fearLevel >= 70 ? 'bold' : 'normal'};
  text-shadow: ${props => props.fearLevel >= 70 ? '0 0 5px #ff0000' : 'none'};
  
  ${props => props.fearLevel >= 90 && css`
    animation: ${pulse} 1.5s infinite;
  `}
`;

const FearBar = styled.div`
  height: 10px;
  background: #222;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #444;
`;

const FearProgress = styled.div`
  height: 100%;
  width: ${props => `${props.fearLevel}%`};
  background: ${props => {
    if (props.fearLevel >= 70) return 'linear-gradient(90deg, #ff0 0%, #f50 40%, #f00 100%)';
    if (props.fearLevel >= 30) return 'linear-gradient(90deg, #ff0 0%, #f70 70%, #f50 100%)';
    return 'linear-gradient(90deg, #0f0 0%, #ff0 100%)';
  }};
  transition: width 0.5s ease-out;
  
  ${props => props.fearLevel >= 50 && css`
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  `}
`;

const ResetButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 15px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid #500;
  color: #ccc;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  z-index: 10;
  
  &:hover {
    background: rgba(50, 0, 0, 0.7);
    color: white;
  }
`;

const EndGameMessage = styled.div`
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  border: 1px solid #500;
  animation: ${fadeIn} 1s ease;
  
  p {
    margin-bottom: 20px;
    font-size: 1.2rem;
  }
`;