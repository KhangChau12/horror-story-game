// src/components/StartScreen.js
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const scenarioOptions = [
  {
    id: 'forest',
    title: 'Tỉnh dậy trong rừng sâu',
    description: 'Bạn tỉnh dậy một mình giữa rừng sâu vào lúc nửa đêm, không nhớ mình đã đến đây bằng cách nào.',
  },
  {
    id: 'abandoned-building',
    title: 'Tòa nhà công ty bỏ hoang',
    description: 'Bạn đang thám hiểm một tòa nhà văn phòng bỏ hoang nhiều năm, nổi tiếng với những tin đồn về các hiện tượng siêu nhiên.',
  },
  {
    id: 'asylum',
    title: 'Bệnh viện tâm thần cũ',
    description: 'Bạn đang ở trong một bệnh viện tâm thần bỏ hoang, nơi từng diễn ra những thí nghiệm khủng khiếp.',
  },
  {
    id: 'strange-house',
    title: 'Ngôi nhà lạ',
    description: 'Một ngôi nhà bí ẩn bỗng xuất hiện trong khu phố của bạn, và bạn quyết định khám phá nó.',
  },
  {
    id: 'night-bus',
    title: 'Chuyến xe buýt đêm',
    description: 'Bạn đang trên một chuyến xe buýt đêm, và dần nhận ra rằng nó không đi đến điểm đến thông thường...',
  },
];

const StartScreen = ({ onStart }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [characterName, setCharacterName] = useState('');
  const [characterGender, setCharacterGender] = useState('');
  const [showCharacterForm, setShowCharacterForm] = useState(false);

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setShowCharacterForm(true);
  };

  const handleStartGame = () => {
    if (characterName && characterGender && selectedScenario) {
      onStart(selectedScenario.id, {
        name: characterName,
        gender: characterGender
      });
    }
  };

  return (
    <Container>
      <Title>BÓNG TỐI CHỌN LỰA</Title>
      <Subtitle>Chọn số phận của bạn...</Subtitle>
      
      {!showCharacterForm ? (
        <ScenarioContainer>
          {scenarioOptions.map((scenario) => (
            <ScenarioCard 
              key={scenario.id} 
              onClick={() => handleScenarioSelect(scenario)}
              scenarioType={scenario.id}
            >
              <ScenarioIcon className={scenario.id} />
              <ScenarioContent>
                <ScenarioTitle>{scenario.title}</ScenarioTitle>
                <ScenarioDescription>{scenario.description}</ScenarioDescription>
              </ScenarioContent>
            </ScenarioCard>
          ))}
        </ScenarioContainer>
      ) : (
        <CharacterForm>
          <h2>Nhập thông tin nhân vật</h2>
          
          <FormGroup>
            <label htmlFor="characterName">Tên:</label>
            <input 
              id="characterName"
              type="text" 
              value={characterName} 
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Nhập tên của bạn"
            />
          </FormGroup>
          
          <FormGroup>
            <label>Giới tính:</label>
            <GenderOptions>
              <GenderOption 
                selected={characterGender === 'nam'}
                onClick={() => setCharacterGender('nam')}
              >
                Nam
              </GenderOption>
              <GenderOption 
                selected={characterGender === 'nữ'}
                onClick={() => setCharacterGender('nữ')}
              >
                Nữ
              </GenderOption>
              <GenderOption 
                selected={characterGender === 'khác'}
                onClick={() => setCharacterGender('khác')}
              >
                Khác
              </GenderOption>
            </GenderOptions>
          </FormGroup>
          
          <ButtonGroup>
            <BackButton onClick={() => setShowCharacterForm(false)}>
              Quay lại
            </BackButton>
            <StartButton 
              onClick={handleStartGame}
              disabled={!characterName || !characterGender}
            >
              Bắt đầu hành trình
            </StartButton>
          </ButtonGroup>
        </CharacterForm>
      )}
      
      <Footer>
        <p>Trò chơi tương tác kể chuyện kinh dị</p>
        <p>Mỗi lựa chọn đều có hậu quả...</p>
      </Footer>
    </Container>
  );
};

// Animations
const flickering = keyframes`
  0% { text-shadow: 0 0 5px #fff, 0 0 10px #f00, 0 0 15px #f00; }
  50% { text-shadow: 0 0 2px #fff, 0 0 5px #f00, 0 0 7px #f00; }
  100% { text-shadow: 0 0 5px #fff, 0 0 10px #f00, 0 0 15px #f00; }
`;

const pulse = keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.8; transform: scale(1); }
`;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, #300 0%, #000 70%);
    z-index: -1;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  letter-spacing: 2px;
  animation: ${flickering} 3s infinite;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #bbb;
  margin-bottom: 40px;
  text-align: center;
`;

const ScenarioContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ScenarioCard = styled.div`
  background: linear-gradient(to bottom right, 
    ${props => {
      switch(props.scenarioType) {
        case 'forest': return '#001a00, #000';
        case 'abandoned-building': return '#1a1a00, #000';
        case 'asylum': return '#1a0000, #000';
        case 'strange-house': return '#00001a, #000';
        case 'night-bus': return '#0d001a, #000';
        default: return '#0a0a0a, #000';
      }
    }}
  );
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(120, 0, 0, 0.2);
  height: 220px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
    animation: ${pulse} 2s infinite;
    border-color: rgba(120, 0, 0, 0.6);
  }
`;

const ScenarioIcon = styled.div`
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  
  &:before {
    position: absolute;
    font-size: 3rem;
    top: 0;
    left: 0;
  }
  
  &.forest:before {
    content: '🌲';
  }
  
  &.abandoned-building:before {
    content: '🏢';
  }
  
  &.asylum:before {
    content: '🏥';
  }
  
  &.strange-house:before {
    content: '🏚️';
  }
  
  &.night-bus:before {
    content: '🚌';
  }
`;

const ScenarioContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ScenarioTitle = styled.h3`
  color: #fff;
  margin-bottom: 10px;
  font-size: 1.3rem;
`;

const ScenarioDescription = styled.p`
  color: #ddd;
  font-size: 0.95rem;
`;

const CharacterForm = styled.div`
  background: rgba(15, 0, 0, 0.7);
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  border: 1px solid ${props => props.theme.accent};
  box-shadow: 0 0 15px rgba(120, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  
  h2 {
    color: #fff;
    margin-bottom: 20px;
    text-align: center;
    text-shadow: 0 0 5px #f00;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #ddd;
  }
  
  input {
    width: 100%;
    padding: 12px;
    background: rgba(10, 0, 0, 0.7);
    border: 1px solid ${props => props.theme.border};
    border-radius: 4px;
    color: #fff;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.primary};
      box-shadow: 0 0 5px rgba(120, 0, 0, 0.5);
    }
  }
`;

const GenderOptions = styled.div`
  display: flex;
  gap: 10px;
`;

const GenderOption = styled.div`
  flex: 1;
  padding: 10px;
  text-align: center;
  background: ${props => props.selected ? props.theme.accent : 'rgba(10, 0, 0, 0.7)'};
  border: 1px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(50, 0, 0, 0.7);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const StartButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.disabled ? '#333' : props.theme.accent};
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.disabled ? '#333' : props.theme.primary};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 5px 15px rgba(255, 0, 0, 0.2)'};
  }
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background: transparent;
  color: #ddd;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #aaa;
  }
`;

const Footer = styled.footer`
  margin-top: 40px;
  text-align: center;
  color: #777;
  
  p {
    margin: 5px 0;
  }
`;

export default StartScreen;
