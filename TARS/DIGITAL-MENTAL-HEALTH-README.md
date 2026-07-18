# Digital Mental Health Support Assistant - Privacy-First Emotional Support System

![Mental Health Support](https://img.shields.io/badge/Digital-Mental_Health_Support-blue?style=for-the-badge&logo=heart&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)

> "Your emotional well-being matters. I'm here to listen and support you." - Digital Mental Health Support Assistant

The Digital Mental Health Support Assistant is an empathetic, privacy-first emotional support system designed to provide accessible mental health assistance. This web application combines advanced AI capabilities with voice interaction, working seamlessly both online and offline, ensuring users can express their emotions and receive support in a safe, private environment.

## ⚠️ Important Mental Health Disclaimer

**This system provides emotional support and psychological well-being assistance, NOT diagnosis, therapy, or medical treatment.**

- **Not a Replacement for Professional Care**: This system does not replace licensed mental health professionals, therapists, or medical practitioners.
- **Crisis Situations**: If you are experiencing a mental health crisis, thoughts of self-harm, or immediate danger, please contact emergency services (911, crisis hotlines, or your local emergency number) immediately.
- **Severe Distress**: When experiencing severe emotional distress, persistent symptoms, or mental health concerns, please seek support from licensed mental health professionals.
- **Privacy in Offline Mode**: In offline mode, all data remains on your device. No information leaves your local environment.

## 🌟 Features

### 🤝 Empathetic AI Support
- **Connected Support Mode**: Optional cloud-based support via Supabase Edge Functions for enhanced capabilities
- **Private Mental Health Mode**: Complete offline operation using local Ollama integration for maximum privacy
- **Streaming Responses**: Real-time conversation streaming for natural, supportive interactions

### 🎤 Voice-Enabled Emotional Expression
- **Speech Recognition**: Vosk-powered offline speech recognition with browser API fallback for accessibility
- **Text-to-Speech**: Natural voice synthesis with customizable controls for accessible responses
- **Continuous Listening**: Enhanced voice input for hands-free emotional expression
- **Microphone Controls**: Easy toggle for voice input with clear permission handling

### 💙 User Experience
- **Responsive Design**: Accessible UI built with Tailwind CSS and shadcn/ui components
- **Calm Theme**: Soothing design with gentle effects and animations designed to reduce anxiety
- **Mood Journal / Reflection Log**: Conversation history saved in localStorage for personal reflection
- **Real-time Status**: Online/offline indicators and connection monitoring for privacy awareness

### 🔧 Technical Features
- **Cross-Platform**: Works on desktop and mobile browsers
- **Error Handling**: Comprehensive error handling with supportive, user-friendly messages
- **Performance Optimized**: Efficient audio processing and memory management
- **Modular Architecture**: Clean, maintainable React components
- **Privacy-First**: Complete offline functionality with no data transmission in private mode

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Voice Processing**: Vosk Browser (offline), Web Speech API (fallback)
- **AI Integration**: Supabase (connected mode, optional), Ollama (private mode)
- **State Management**: React hooks with localStorage persistence
- **Build Tools**: Vite, ESLint, PostCSS

## 📋 Prerequisites

Before running the Digital Mental Health Support Assistant, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **bun** package manager
- **Ollama** (for private mental health mode - offline AI capabilities)
- **Modern web browser** with microphone support

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/digital-mental-health-support.git
cd digital-mental-health-support
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

**Privacy Note**: These models enable offline voice recognition, ensuring your emotional expressions remain private and are not processed by cloud services.

### 4. Setup Ollama (for Private Mental Health Mode)
```bash
# Download and install Ollama from https://ollama.ai/download
ollama pull llama3.1:8b-instruct
```

**Privacy Note**: Local AI processing ensures complete privacy for sensitive emotional conversations. No data leaves your device in private mode.

### 5. Configure Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

**Note**: These are optional for connected support mode. The system works fully offline without these variables, ensuring complete privacy.

### 6. Setup Supabase (Optional, for Connected Support Mode)
1. Create a [Supabase](https://supabase.com) project
2. Deploy the emotional support edge function
3. Update environment variables with your Supabase credentials

**Privacy Note**: Users can operate entirely in private mode without Supabase configuration, ensuring all data remains local.

### 7. Start Development Server
```bash
npm run dev
# or
bun run dev
```

**Quick Setup Commands**:
```bash
# Terminal 1: Install and run
npm i && npm run dev

# Terminal 2: Pull AI model for private mode
ollama pull llama3.1:8b
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Usage

### Basic Emotional Support Conversation
1. Type your message in the input field
2. Press Enter or click the Send button
3. The assistant will respond with text and voice (if enabled)
4. Responses are designed to be empathetic, supportive, and validating

### Voice Interaction (Emotional Expression via Speech)
1. Click the microphone button to start voice input
2. Grant microphone permissions when prompted
3. Speak clearly - your words will appear in the input field
4. Click the microphone again to stop listening
5. Send the transcribed message

**Note**: The system recognizes varied speech patterns, including emotional speech (soft, rapid, or through tears), ensuring all users can express themselves.

### Voice Output Control
- The assistant automatically speaks responses for accessibility
- Click "Stop Speaking" to interrupt voice output
- Voice synthesis uses your browser's built-in TTS

### Connected Support Mode vs Private Mental Health Mode
- **Connected Support Mode**: Optional cloud AI capabilities via Supabase (requires internet)
- **Private Mental Health Mode**: Complete local AI via Ollama with Vosk speech recognition (works offline, maximum privacy)
- The app automatically detects your connection status and operates accordingly

## 🏗️ Project Structure

```
digital-mental-health-support/
├── public/
│   ├── models/           # Vosk speech recognition models (offline privacy)
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── SupportInterface.tsx    # Main emotional support conversation interface
│   │   └── ui/                  # shadcn/ui components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   ├── localAI.ts           # AI integration utilities
│   │   └── utils.ts             # Utility functions
│   ├── pages/                   # Route components
│   └── integrations/            # External service integrations
├── supabase/                    # Supabase configuration (optional)
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
1. **Voice Recognition**: Test with different accents, emotional states, and speaking patterns
2. **Private Mode**: Disconnect internet and verify complete offline functionality
3. **Cross-browser**: Test on Chrome, Firefox, Safari, Edge
4. **Mobile**: Verify responsive design on mobile devices
5. **Accessibility**: Test with screen readers, keyboard navigation, and reduced motion preferences
6. **Emotional Response Accuracy**: Verify responses are empathetic, appropriate, and supportive

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Guidelines for Contributors**:
- Maintain privacy-first principles
- Ensure all features are accessible
- Test with varied emotional expressions and speech patterns
- Keep error messages supportive and non-alarming
- Respect user privacy and data security

## 📚 Additional Resources

- [Setup and Implementation Guide](DIGITAL-MENTAL-HEALTH-SETUP-GUIDE.md) - Detailed setup instructions and troubleshooting
- [Vosk Documentation](https://github.com/alphacep/vosk-api) - Speech recognition library
- [Supabase Docs](https://supabase.com/docs) - Cloud backend documentation (optional)
- [Ollama](https://github.com/jmorganca/ollama) - Local AI runtime for private mode

## 🆘 Crisis Resources

If you or someone you know is in crisis, please reach out to:

- **Emergency Services**: 911 (US) or your local emergency number
- **Crisis Text Line**: Text HOME to 741741 (US)
- **National Suicide Prevention Lifeline**: 988 (US)
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

**Remember**: This system provides emotional support but does not replace professional mental health care.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/), [React](https://reactjs.org/), and [Tailwind CSS](https://tailwindcss.com/)
- Speech recognition powered by [Vosk](https://alphacephei.com/vosk/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Privacy-first architecture inspired by the need for accessible, confidential mental health support

---

**"Your emotional well-being matters. This system is here to support you on your journey toward better mental health."** - Digital Mental Health Support Assistant

