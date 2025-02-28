// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/horror-story-game';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define MongoDB schemas
const gameSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  scenario: { type: String, required: true },
  storyText: { type: String, required: true },
  choices: [String],
  character: {
    name: String,
    gender: String
  },
  fearLevel: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const GameSession = mongoose.model('GameSession', gameSessionSchema);

// Utility function to call OpenAI API
const generateStoryWithOpenAI = async (prompt) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',  // Using the model specified by the user
      messages: [
        { role: 'system', content: 'You are a horror story narrator who creates immersive, suspenseful and frightening interactive narratives. Your stories should be atmospheric, tense, and psychologically disturbing while avoiding excessive gore. End each segment with 3 distinct choices for the player that create branching narratives with meaningful consequences.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.8,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    
    // Parse response to extract story and choices
    const parts = parseAIResponse(content);
    return parts;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate story');
  }
};

// Parse AI response to extract story and choices
const parseAIResponse = (content) => {
  let story = content;
  let choices = [];

  // Check if content contains numbered choices (common format)
  if (content.includes('1.') && content.includes('2.') && content.includes('3.')) {
    // Split at the first numbered choice
    const choiceIndex = Math.min(
      content.lastIndexOf('1.'),
      content.lastIndexOf('Lựa chọn 1:') !== -1 ? content.lastIndexOf('Lựa chọn 1:') : Infinity,
      content.lastIndexOf('Choice 1:') !== -1 ? content.lastIndexOf('Choice 1:') : Infinity
    );
    
    if (choiceIndex !== Infinity) {
      story = content.substring(0, choiceIndex).trim();
      const choicesText = content.substring(choiceIndex).trim();
      
      // Extract choices using regex
      const choiceRegex = /(?:\d\.|Choice \d:|Lựa chọn \d:)\s*(.*?)(?=(?:\d\.|Choice \d:|Lựa chọn \d:|$))/gs;
      let match;
      while ((match = choiceRegex.exec(choicesText)) !== null) {
        choices.push(match[1].trim());
      }
    }
  }

  // If no choices found or fewer than 3, handle it
  if (choices.length < 3) {
    // Use a simpler approach: look for the last paragraph breaks and assume those are choices
    const paragraphs = content.split('\n\n');
    if (paragraphs.length >= 4) {
      // Assume the last 3 paragraphs are choices
      story = paragraphs.slice(0, -3).join('\n\n').trim();
      choices = paragraphs.slice(-3).map(p => p.trim());
    } else {
      // Fallback: generate generic choices
      choices = [
        'Tiếp tục đi về phía trước.',
        'Quay lại và tìm một con đường khác.',
        'Dừng lại và quan sát kỹ hơn.'
      ];
    }
  }

  return { story, choices };
};

// API Routes

// Start a new story
app.post('/api/story/start', async (req, res) => {
  try {
    const { scenario, character } = req.body;
    
    // Generate initial story based on scenario
    const prompt = `Hãy bắt đầu một câu chuyện kinh dị ngắn (khoảng 300-400 từ) dựa trên bối cảnh sau: "${getScenarioDescription(scenario)}". 
    Nhân vật chính tên là ${character.name}, giới tính ${character.gender}. 
    Hãy kết thúc phần này với 3 lựa chọn khác nhau cho người chơi, mỗi lựa chọn sẽ dẫn câu chuyện theo hướng khác nhau.`;
    
    const { story, choices } = await generateStoryWithOpenAI(prompt);
    
    // Create a new session
    const sessionId = uuidv4();
    const newSession = new GameSession({
      sessionId,
      scenario,
      storyText: story,
      choices,
      character,
      fearLevel: 10
    });
    
    await newSession.save();
    
    res.json({
      sessionId,
      story,
      choices,
      fearLevel: 10
    });
    
  } catch (error) {
    console.error('Error starting story:', error);
    res.status(500).json({ error: 'Failed to start story' });
  }
});

// Make a choice and continue the story
app.post('/api/story/choice', async (req, res) => {
  try {
    const { sessionId, choice, previousStory, scenario } = req.body;
    
    // Find the session
    const session = await GameSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Generate next part of story based on choice
    const prompt = `Tiếp tục câu chuyện kinh dị sau đây. Bối cảnh: "${getScenarioDescription(scenario)}".
    
    Câu chuyện cho đến hiện tại:
    ${previousStory}
    
    Người chơi đã chọn: "${choice}"
    
    Hãy viết đoạn tiếp theo (khoảng 300-400 từ), giữ được không khí kinh dị và căng thẳng. Hãy kết thúc phần này với 3 lựa chọn khác nhau cho người chơi, mỗi lựa chọn sẽ dẫn câu chuyện theo hướng khác nhau. Nếu câu chuyện đã đến hồi kết, có thể không cần đưa ra lựa chọn.`;
    
    const { story, choices } = await generateStoryWithOpenAI(prompt);
    
    // Calculate fear increase based on the content of the story
    const fearIncrease = calculateFearIncrease(story);
    
    // Update session
    session.storyText += `\n\n${story}`;
    session.choices = choices;
    session.fearLevel = Math.min(100, session.fearLevel + fearIncrease);
    session.updatedAt = Date.now();
    await session.save();
    
    res.json({
      story,
      choices,
      fearIncrease
    });
    
  } catch (error) {
    console.error('Error processing choice:', error);
    res.status(500).json({ error: 'Failed to process choice' });
  }
});

// Save game state
app.post('/api/game/save', async (req, res) => {
  try {
    const { sessionId, gameState } = req.body;
    
    // Find the session
    const session = await GameSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Update session with new game state
    session.storyText = gameState.storyText;
    session.choices = gameState.choices;
    session.fearLevel = gameState.fearLevel;
    session.updatedAt = Date.now();
    await session.save();
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// Load game state
app.get('/api/game/load/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Find the session
    const session = await GameSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({
      sessionId: session.sessionId,
      scenario: session.scenario,
      storyText: session.storyText,
      choices: session.choices,
      character: session.character,
      fearLevel: session.fearLevel
    });
    
  } catch (error) {
    console.error('Error loading game:', error);
    res.status(500).json({ error: 'Failed to load game' });
  }
});

// Helper functions
function getScenarioDescription(scenarioId) {
  const scenarios = {
    'forest': 'Tỉnh dậy một mình giữa rừng sâu vào lúc nửa đêm, không nhớ mình đã đến đây bằng cách nào.',
    'abandoned-building': 'Thám hiểm một tòa nhà văn phòng bỏ hoang nhiều năm, nổi tiếng với những tin đồn về các hiện tượng siêu nhiên.',
    'asylum': 'Mắc kẹt trong một bệnh viện tâm thần bỏ hoang, nơi từng diễn ra những thí nghiệm khủng khiếp.',
    'strange-house': 'Một ngôi nhà bí ẩn bỗng xuất hiện trong khu phố, và bạn quyết định khám phá nó.',
    'night-bus': 'Đang trên một chuyến xe buýt đêm, và dần nhận ra rằng nó không đi đến điểm đến thông thường.'
  };
  
  return scenarios[scenarioId] || 'Tình huống kinh dị bí ẩn';
}

function calculateFearIncrease(story) {
  // List of scary keywords to check
  const scaryKeywords = [
    'máu', 'chết', 'ma', 'quỷ', 'ác mộng', 'kinh hoàng', 'thét', 'sợ hãi',
    'bóng tối', 'thây ma', 'biến dạng', 'thảm khốc', 'biến mất', 'quái vật',
    'rùng mình', 'rùng rợn', 'ám ảnh', 'đau đớn', 'thét gào', 'la hét',
    'blood', 'death', 'ghost', 'demon', 'nightmare', 'horror', 'scream', 'fear',
    'darkness', 'corpse', 'mutilate', 'terrible', 'vanish', 'monster',
    'shiver', 'dreadful', 'haunt', 'pain', 'shriek', 'cry'
  ];
  
  // Count occurrences of scary words
  let count = 0;
  scaryKeywords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    const matches = story.match(regex);
    if (matches) {
      count += matches.length;
    }
  });
  
  // Calculate fear increase based on keyword count
  if (count >= 10) return 15; // High fear
  if (count >= 5) return 10;  // Medium fear
  return 5;                   // Low fear
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
