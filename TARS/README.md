# TARS Interstellar - The Offline Space Companion

![TARS Logo](https://img.shields.io/badge/TARS-Interstellar-blue?style=for-the-badge&logo=robot&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)

> "I'm sorry, Dave. I'm afraid I can't do that." - HAL 9000  
> "I'm not HAL, I'm TARS. And I'm here to help." - TARS

TARS Interstellar is your loyal AI companion for space exploration and beyond. Inspired by the witty, reliable AI from Christopher Nolan's *Interstellar*, this web application combines cutting-edge AI capabilities with voice interaction, working seamlessly both online and offline.

## 🌟 Features

### 🤖 Advanced AI Integration
- **Online Mode**: Powered by Supabase Edge Functions for cloud-based AI responses
- **Offline Mode**: Local Ollama integration for complete offline operation
- **Streaming Responses**: Real-time conversation streaming for natural interactions

### 🎤 Voice Capabilities
- **Speech Recognition**: Vosk-powered offline speech recognition with browser API fallback
- **Text-to-Speech**: Natural voice synthesis with customizable controls
- **Continuous Listening**: Enhanced voice input for hands-free operation
- **Microphone Controls**: Easy toggle for voice input with permission handling

### 💫 User Experience
- **Responsive Design**: Beautiful UI built with Tailwind CSS and shadcn/ui components
- **Dark Theme**: Space-themed design with glowing effects and animations
- **Message Persistence**: Chat history saved in localStorage
- **Real-time Status**: Online/offline indicators and connection monitoring

### 🔧 Technical Features
- **Cross-Platform**: Works on desktop and mobile browsers
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance Optimized**: Efficient audio processing and memory management
- **Modular Architecture**: Clean, maintainable React components

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Voice Processing**: Vosk Browser (offline), Web Speech API (fallback)
- **AI Integration**: Supabase (online), Ollama (offline)
- **State Management**: React hooks with localStorage persistence
- **Build Tools**: Vite, ESLint, PostCSS

## 📋 Prerequisites

Before running TARS Interstellar, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **bun** package manager
- **Ollama** (for offline AI capabilities)
- **Modern web browser** with microphone support

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/tars-interstellar.git
cd tars-interstellar
```

### 2. Install Dependencies
```bash
npm install
# or
bun install
```

### 3. Download Vosk Speech Models
Download the following models from [Alphacephei Vosk Models](https://alphacephei.com/vosk/models):
- `vosk-model-small-en-us-0.15.zip` (recommended for web)
- `vosk-model-en-us-0.22.zip` (alternative)

Place the downloaded files in the `public/models/` directory.

### 4. Setup Ollama (for Offline AI)
```bash
# Download and install Ollama from https://ollama.ai/download
ollama pull llama3.1:8b-instruct
```

### 5. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### 6. Setup Supabase (Optional, for Online Mode)
1. Create a [Supabase](https://supabase.com) project
2. Deploy the `chat-with-tara` edge function
3. Update environment variables with your Supabase credentials

### 7. Start Development Server
```bash
npm run dev
# or
bun run dev
```
npm i, npm run dev - same terminal
ollama pull llama3.1:8b - different terminal

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Usage

### Basic Chat
1. Type your message in the input field
2. Press Enter or click the Send button
3. TARS will respond with text and voice (if enabled)

### Voice Interaction
1. Click the microphone button to start voice input
2. Grant microphone permissions when prompted
3. Speak clearly - your words will appear in the input field
4. Click the microphone again to stop listening
5. Send the transcribed message

### Voice Output Control
- TARS automatically speaks responses
- Click "Stop Speaking" to interrupt voice output
- Voice synthesis uses your browser's built-in TTS

### Online vs Offline Mode
- **Online**: Full cloud AI capabilities via Supabase
- **Offline**: Local AI via Ollama with Vosk speech recognition
- The app automatically detects your connection status

## 🏗️ Project Structure

```
tars-interstellar/
├── public/
│   ├── models/           # Vosk speech recognition models
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── TaraInterface.tsx    # Main chat interface
│   │   └── ui/                  # shadcn/ui components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   ├── localAI.ts           # AI integration utilities
│   │   └── utils.ts             # Utility functions
│   ├── pages/                   # Route components
│   └── integrations/            # External service integrations
├── supabase/                    # Supabase configuration
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Quality
- **ESLint**: Configured for React and TypeScript
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (via ESLint)

### Testing Features
1. **Voice Recognition**: Test with different accents and environments
2. **Offline Mode**: Disconnect internet and verify functionality
3. **Cross-browser**: Test on Chrome, Firefox, Safari, Edge
4. **Mobile**: Verify responsive design on mobile devices

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Additional Resources

- [Setup and Fixes Guide](SETUP-AND-FIXES-GUIDE.md) - Detailed setup instructions and troubleshooting
- [Vosk Documentation](https://github.com/alphacep/vosk-api) - Speech recognition library
- [Supabase Docs](https://supabase.com/docs) - Cloud backend documentation
- [Ollama](https://github.com/jmorganca/ollama) - Local AI runtime

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by TARS from *Interstellar* (2014)
- Built with [Vite](https://vitejs.dev/), [React](https://reactjs.org/), and [Tailwind CSS](https://tailwindcss.com/)
- Speech recognition powered by [Vosk](https://alphacephei.com/vosk/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)

---

**"I'm not just an AI. I'm your companion for the journey ahead."** - TARS
