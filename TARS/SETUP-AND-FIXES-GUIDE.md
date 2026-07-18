# TARS Interstellar Web App - Setup and Implementation Guide

## Overview
This guide documents the complete setup process for the TARS Interstellar web application, including all steps, dependencies, configurations, and bug fixes implemented to reach the final working state.

## Project Structure
```
TARS_Interstellar/
├── public/
│   ├── models/
│   │   ├── vosk-model-small-en-us-0.15.zip
│   │   ├── vosk-model-small-en-us-0.15/ (extracted)
│   │   └── vosk-model-en-us-0.22.zip
├── src/
│   ├── components/
│   │   ├── TaraInterface.tsx
│   │   └── ui/ (shadcn/ui components)
│   └── lib/
│       └── localAI.ts
└── package.json
```

## Step 1: Initial Project Setup

### 1.1 Create React + TypeScript + Vite Project
```bash
npm create vite@latest tars-interstellar -- --template react-ts
cd tars-interstellar
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Install Additional Dependencies
```bash
npm install lucide-react @radix-ui/react-scroll-area @radix-ui/react-toast
npm install vosk-browser @supabase/supabase-js tailwindcss
npm install @hookform/resolvers react-hook-form zod
```

### 1.4 Setup Tailwind CSS
```bash
npx tailwindcss init -p
```

Configure `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

## Step 2: Vosk Model Setup

### 2.1 Download Vosk Models
Download the following models from https://alphacephei.com/vosk/models:
- `vosk-model-small-en-us-0.15.zip` (recommended for web)
- `vosk-model-en-us-0.22.zip` (alternative)

### 2.2 Place Models in Public Directory
Create `public/models/` directory and place the downloaded zip files there.

### 2.3 Extract Models (Optional)
Extract the zip files to have both compressed and extracted versions:
```
public/models/
├── vosk-model-small-en-us-0.15.zip
├── vosk-model-small-en-us-0.15/ (extracted contents)
├── vosk-model-en-us-0.22.zip
└── vosk-model-en-us-0.22/ (extracted contents)
```

## Step 3: Core Component Implementation

### 3.1 Create TaraInterface Component
Implement the main chat interface with:
- Voice input/output capabilities
- Online/offline mode detection
- Vosk integration for offline speech recognition
- Supabase integration for online AI responses
- Local Ollama integration for offline AI responses

### 3.2 Key Features Implemented
- **Speech Recognition**: Vosk for offline, Web Speech API as fallback
- **Text-to-Speech**: Browser Speech Synthesis API
- **AI Integration**: Supabase Edge Functions + Local Ollama
- **Responsive UI**: Tailwind CSS + shadcn/ui components
- **Message Persistence**: LocalStorage for chat history

## Step 4: Bug Fixes and Issues Resolved

### 4.1 Issue 1: Vosk Model Loading Error
**Problem**: "Unrecognized archive format" when trying to load Vosk model.

**Root Cause**: Code was trying to load from local extracted directory path instead of archive file.

**Initial Fix Attempt**:
```typescript
// WRONG - Points to extracted directory
const modelPath = '/models/vosk-model-small-en-us-0.15/';

// CORRECT - Points to archive file
const modelPath = '/models/vosk-model-small-en-us-0.15.zip';
```

### 4.2 Issue 2: CORS Error with Remote Model Download
**Problem**: When trying to download model from remote URL:
```
Access to fetch at 'https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.tar.gz'
from origin 'http://localhost:8080' has been blocked by CORS policy
```

**Solution**: Implement fallback strategy - try local file first, then remote:
```typescript
const initializeVosk = async () => {
  try {
    // Try local zip file first (no CORS issues)
    const modelPath = '/models/vosk-model-small-en-us-0.15.zip';
    const model = await createModel(modelPath);
    voskModelRef.current = model;
    console.log('Vosk model loaded successfully');
  } catch (error) {
    console.error('Failed to load local Vosk model:', error);
    // Fallback to remote URL if local fails
    try {
      const remotePath = 'https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.tar.gz';
      const model = await createModel(remotePath);
      voskModelRef.current = model;
      console.log('Vosk model loaded from remote successfully');
    } catch (remoteError) {
      console.error('Failed to load remote Vosk model:', remoteError);
      // Show user-friendly error message
      toast({
        title: "Vosk Model Load Failed",
        description: "Offline speech recognition may not work. Falling back to browser API.",
        variant: "destructive",
      });
    }
  }
};
```

### 4.3 Issue 3: Speech Recognition Audio Processing
**Problem**: Vosk recognizer not processing audio correctly.

**Solution**: Proper audio context setup with correct sample rate:
```typescript
const audioContext = new AudioContext({ sampleRate: 16000 });
const source = audioContext.createMediaStreamSource(stream);
const processor = audioContext.createScriptProcessor(4096, 1, 1);

processor.onaudioprocess = (event) => {
  if (recognizer) {
    const buffer = event.inputBuffer;
    try {
      recognizer.acceptWaveform(buffer);
    } catch (error) {
      console.error('Error processing audio with Vosk:', error);
    }
  }
};
```

### 4.4 Issue 4: Microphone Permission Handling
**Problem**: Poor error handling for microphone access.

**Solution**: Comprehensive error handling with user feedback:
```typescript
navigator.mediaDevices.getUserMedia({...})
  .then((stream) => {
    // Setup audio processing
  })
  .catch(() => {
    setIsListening(false);
    voskRecognizerRef.current = null;
    toast({
      title: "Microphone Access Denied",
      description: "Cannot access microphone for speech recognition",
      variant: "destructive",
    });
  });
```

## Step 5: Environment Configuration

### 5.1 Create Environment Variables
Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

### 5.2 Supabase Setup
1. Create Supabase project
2. Deploy edge function for chat-with-tara
3. Configure environment variables

## Step 6: Running the Application

### 6.1 Install Ollama (for offline AI)
```bash
# Download from https://ollama.ai/download
# Install and run
ollama pull llama3.1:8b
```

### 6.2 Start Development Server
```bash
npm run dev
```

### 6.3 Access Application
Open `http://localhost:5173` (or your configured port)

## Step 7: Testing Features

### 7.1 Voice Input Testing
1. Click microphone button
2. Grant microphone permissions
3. Speak clearly
4. Verify transcription appears in input field

### 7.2 AI Response Testing
1. Send text message or use voice input
2. Verify AI responds (online via Supabase, offline via Ollama)
3. Test voice output by clicking speaker button

### 7.3 Offline Mode Testing
1. Disconnect internet
2. Test voice recognition (Vosk)
3. Test AI responses (Ollama)

## Step 8: Deployment Considerations

### 8.1 Build for Production
```bash
npm run build
```

### 8.2 Serve Static Files
```bash
npm run preview
```

### 8.3 CORS and Model Loading
- For production deployment, ensure Vosk model files are accessible
- Consider using a CDN for model files to avoid CORS issues
- Implement proper error boundaries for offline functionality

## Final Working State

The application now successfully:
- ✅ Loads Vosk model from local zip file (no CORS issues)
- ✅ Provides offline speech recognition
- ✅ Falls back gracefully to browser APIs
- ✅ Integrates with both online (Supabase) and offline (Ollama) AI
- ✅ Maintains chat history in localStorage
- ✅ Provides responsive UI with voice controls
- ✅ Handles all error cases with user-friendly messages

## Troubleshooting

### Common Issues:
1. **Vosk model not loading**: Ensure zip file exists in `public/models/`
2. **Microphone not working**: Check browser permissions
3. **Ollama not responding**: Ensure Ollama is running on port 11434
4. **Supabase errors**: Check environment variables and network

### Debug Steps:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Test individual components in isolation
4. Check network connectivity for online features