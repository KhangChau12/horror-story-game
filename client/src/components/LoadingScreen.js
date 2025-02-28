// src/components/LoadingScreen.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingScreen = () => {
  return (
    <Container>
      <LoadingText>Đang tải...</LoadingText>
      <LoadingSpinner />
      <RandomQuote>
        {getRandomQuote()}
      </RandomQuote>
    </Container>
  );
};

const getRandomQuote = () => {
  const quotes = [
    "Bóng tối luôn ẩn nấp trong góc khuất...",
    "Có những nỗi sợ hãi mà ta không thể trốn chạy...",
    "Những lựa chọn của bạn sẽ định đoạt số phận...",
    "Đôi khi thứ đáng sợ nhất chính là trí tưởng tượng của chúng ta...",
    "Đừng quay đầu lại, nó có thể đang theo sau bạn...",
    "Trong bóng tối, không ai nghe thấy tiếng thét của bạn...",
    "Mỗi quyết định đều có hậu quả không lường trước được..."
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};

// Animations
const pulse = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const flicker = keyframes`
  0% { opacity: 0.7; }
  5% { opacity: 0.5; }
  10% { opacity: 0.7; }
  15% { opacity: 0.5; }
  20% { opacity: 0.7; }
  100% { opacity: 0.7; }
`;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, #300 0%, #000 70%);
    z-index: -1;
    animation: ${flicker} 3s infinite;
  }
`;

const LoadingText = styled.h2`
  font-size: 2rem;
  margin-bottom: 30px;
  animation: ${pulse} 2s infinite;
  color: #f00;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  margin-bottom: 40px;
  position: relative;
  
  &:before, &:after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }
  
  &:before {
    width: 100%;
    height: 100%;
    border: 3px solid rgba(255, 0, 0, 0.1);
    border-top: 3px solid #f00;
    animation: ${spin} 1.5s linear infinite;
  }
  
  &:after {
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    border: 3px solid transparent;
    border-bottom: 3px solid rgba(255, 0, 0, 0.5);
    animation: ${spin} 2s linear infinite reverse;
  }
`;

const RandomQuote = styled.p`
  font-style: italic;
  color: #aaa;
  max-width: 80%;
  text-align: center;
  font-size: 1.2rem;
  animation: ${pulse} 5s infinite;
`;

export default LoadingScreen;
