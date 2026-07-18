# Digital Mental Health & Psychological Support System – Setup and Implementation Guide

## Overview
This guide documents the complete setup process for the Digital Mental Health Support Assistant web application, including all steps, dependencies, configurations, and bug fixes implemented to reach the final working state. This system provides an empathetic, privacy-first mental health support interface that works seamlessly both online and offline, enabling users to express their emotions through voice and text in a safe, accessible environment.

## Ethical Use & Mental Health Disclaimer

**IMPORTANT: This system is designed for emotional support and psychological well-being assistance, NOT for diagnosis, therapy, or medical treatment.**

### Key Disclaimers:
- **Not a Replacement for Professional Care**: This system provides emotional support and conversation, but does not replace licensed mental health professionals, therapists, or medical practitioners.
- **Crisis Situations**: If you are experiencing a mental health crisis, thoughts of self-harm, or immediate danger, please contact emergency services (911, crisis hotlines, or your local emergency number) immediately.
- **Severe Distress**: When experiencing severe emotional distress, persistent symptoms, or mental health concerns, please seek support from licensed mental health professionals.
- **Privacy in Offline Mode**: In offline mode, all data remains on your device. No information leaves your local environment, ensuring maximum privacy for sensitive emotional expressions.
- **Data Security**: While the system prioritizes privacy, users should be aware of their local storage and browser data management practices.

### Appropriate Use Cases:
- Daily emotional check-ins and mood reflection
- Expressing feelings and thoughts in a safe space
- Practicing emotional vocabulary and self-awareness
- Accessible mental health support when professional services are unavailable
- Privacy-preserving emotional expression for users in sensitive situations

## Project Structure
```
Digital_Mental_Health_Support/
├── public/
│   ├── models/
│   │   ├── vosk-model-small-en-us-0.15.zip
│   │   ├── vosk-model-small-en-us-0.15/ (extracted)
│   │   └── vosk-model-en-us-0.22.zip
├── src/
│   ├── components/
│   │   ├── SupportInterface.tsx
│   │   └── ui/ (shadcn/ui components)
│   └── lib/
│       └── localAI.ts
└── package.json
```

## Step 1: Initial Project Setup

### 1.1 Create React + TypeScript + Vite Project
```bash
npm create vite@latest digital-mental-health-support -- --template react-ts
cd digital-mental-health-support
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

**Note**: These models enable offline voice recognition, which is critical for privacy-preserving emotional expression when users prefer not to use cloud-based speech recognition services.

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

### 3.1 Create Support Interface Component
Implement the main emotional support conversation interface with:
- Voice input/output capabilities for emotional expression
- Online/offline mode detection for privacy control
- Vosk integration for offline speech recognition (privacy-preserving)
- Supabase integration for connected support mode (optional)
- Local Ollama integration for private mental health mode (offline AI responses)

### 3.2 Key Features Implemented
- **Emotional Expression via Speech**: Vosk for offline voice recognition, Web Speech API as fallback for accessibility
- **Text-to-Speech**: Browser Speech Synthesis API for accessible responses
- **AI Integration**: Supabase Edge Functions (connected mode) + Local Ollama (private mode)
- **Responsive UI**: Tailwind CSS + shadcn/ui components with calm, accessible design
- **Mood Journal / Reflection Log**: LocalStorage for conversation history and emotional reflection tracking

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

**Mental Health Context**: Reliable offline voice recognition is essential for users who need privacy when expressing sensitive emotions. This fix ensures the system works consistently in private mode.

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
        title: "Voice Recognition Unavailable",
        description: "Offline speech recognition may not work. Falling back to browser API for accessibility.",
        variant: "destructive",
      });
    }
  }
};
```

**Mental Health Context**: Graceful fallback ensures users can always express themselves through voice, even if offline models fail. This reliability is critical for users in emotional distress who need consistent access to support tools.

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

**Mental Health Context**: Accurate voice recognition is essential for users who may speak softly, with emotional variation, or in different emotional states. Proper audio processing ensures all users' voices are recognized accurately.

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
      description: "Cannot access microphone for voice input. You can still type your thoughts.",
      variant: "destructive",
    });
  });
```

**Mental Health Context**: Clear, non-judgmental error messages are important for users who may already feel vulnerable. The system always provides alternative input methods (typing) to ensure no user is blocked from accessing support.

## Step 5: Environment Configuration

### 5.1 Create Environment Variables
Create `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

**Note**: These are optional for connected support mode. The system works fully offline without these variables.

### 5.2 Supabase Setup (Optional, for Connected Support Mode)
1. Create Supabase project
2. Deploy edge function for emotional support conversations
3. Configure environment variables

**Privacy Note**: Users can operate entirely in private mode without Supabase configuration, ensuring all data remains local.

## Step 6: Running the Application

### 6.1 Install Ollama (for Private Mental Health Mode)
```bash
# Download from https://ollama.ai/download
# Install and run
ollama pull llama3.1:8b
```

**Mental Health Context**: Local AI processing ensures complete privacy for sensitive emotional conversations. No data leaves the user's device in private mode.

### 6.2 Start Development Server
```bash
npm run dev
```

### 6.3 Access Application
Open `http://localhost:5173` (or your configured port)

## Step 7: Testing Features

### 7.1 Voice Input Testing (Emotional Expression via Speech)
1. Click microphone button
2. Grant microphone permissions
3. Speak clearly (test with varied emotional tones)
4. Verify transcription appears in input field
5. Test with soft speech, emotional speech patterns, and different speaking speeds

**Mental Health Context**: Testing with varied speech patterns ensures the system works for users expressing emotions, which may affect speech patterns (e.g., speaking through tears, quiet expression, rapid speech during anxiety).

### 7.2 AI Response Testing (Emotional Support Accuracy)
1. Send text message or use voice input
2. Verify empathetic responses (online via Supabase, offline via Ollama)
3. Test voice output by clicking speaker button
4. Verify responses are appropriate, supportive, and non-clinical

**Mental Health Context**: Responses should be empathetic, validating, and supportive without making clinical claims or diagnoses.

### 7.3 Private Mode Testing (Offline Privacy Validation)
1. Disconnect internet
2. Test voice recognition (Vosk offline mode)
3. Test AI responses (Ollama local processing)
4. Verify no data leaves the device
5. Test that conversation history persists locally

**Mental Health Context**: Privacy validation is critical for users who need to express sensitive emotions without any data transmission.

### 7.4 Accessibility Testing
1. Test keyboard navigation
2. Test screen reader compatibility
3. Verify color contrast for readability
4. Test with reduced motion preferences
5. Verify voice controls work without mouse

**Mental Health Context**: Accessibility ensures users with various needs and abilities can access emotional support tools, which is especially important for users with disabilities who may face additional mental health challenges.

### 7.5 Calm UX Verification
1. Verify UI is calming and non-overwhelming
2. Test error messages are supportive, not alarming
3. Verify loading states are gentle
4. Test that the interface doesn't trigger anxiety

**Mental Health Context**: The user interface should be designed to reduce anxiety, not increase it. Calm, supportive design is essential for users in emotional distress.

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
- Ensure privacy policies are clearly communicated

**Mental Health Context**: Production deployment must maintain the same privacy guarantees and reliability as development, as users may depend on this system during difficult emotional periods.

## Final Working State

The application now successfully:
- ✅ Loads Vosk model from local zip file (no CORS issues) - enabling private voice expression
- ✅ Provides offline speech recognition - ensuring privacy for sensitive emotional expression
- ✅ Falls back gracefully to browser APIs - maintaining accessibility for all users
- ✅ Integrates with both connected support mode (Supabase) and private mental health mode (Ollama) - giving users control over privacy
- ✅ Maintains conversation history in localStorage - enabling mood journaling and reflection
- ✅ Provides responsive UI with voice controls - accessible emotional support interface
- ✅ Handles all error cases with user-friendly, supportive messages - reducing anxiety during technical issues
- ✅ Operates completely offline when configured - ensuring maximum privacy for sensitive conversations
- ✅ Provides empathetic, appropriate responses - supporting emotional well-being without clinical claims

## Troubleshooting

### Common Issues:
1. **Vosk model not loading**: Ensure zip file exists in `public/models/`
2. **Microphone not working**: Check browser permissions and provide clear guidance to users
3. **Ollama not responding**: Ensure Ollama is running on port 11434 for private mode functionality
4. **Supabase errors**: Check environment variables and network (optional - system works without Supabase)

### Debug Steps:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Test individual components in isolation
4. Check network connectivity for connected support mode features
5. Verify Ollama is running for private mode
6. Test voice recognition with different speech patterns and emotional states

### User Support Considerations:
- Provide clear, non-technical error messages
- Always offer alternative input methods (typing if voice fails)
- Ensure users understand privacy settings
- Provide guidance on when to seek professional help

---

**Remember**: This system is designed to support emotional well-being and provide a safe space for expression. It complements, but does not replace, professional mental health care. Users experiencing severe distress should be directed to appropriate professional resources.

