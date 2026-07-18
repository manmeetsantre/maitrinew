# TaraInterface Component Documentation

## Overview

The `TaraInterface` component is a React-based emotional support conversation interface for TARS, a privacy-first offline mental health support system. It provides a conversational UI with support for both text and voice input, utilizing offline speech recognition via Vosk and browser-based speech synthesis for responses.

## Features

- **Offline Speech Recognition**: Uses Vosk browser library for offline speech-to-text
- **Continuous Recognition**: Supports continuous speech input with real-time partial results
- **Text-to-Speech**: Browser-based speech synthesis for AI responses
- **Voice Control**: Start/stop voice recognition and speech synthesis
- **Online/Offline Detection**: Automatically switches between online (Ollama) and offline (Vosk) modes
- **Message Persistence**: Saves conversation history to localStorage
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui components

## Component Structure

### State Variables

- `messages`: Array of chat messages with role ('user' | 'assistant') and content
- `input`: Current text input value
- `isLoading`: Boolean indicating if AI is generating a response
- `isSpeaking`: Boolean indicating if text-to-speech is active
- `isListening`: Boolean indicating if speech recognition is active
- `isOnlineStatus`: Boolean indicating internet connectivity

### Key Functions

#### `speak(text: string)`
Initiates text-to-speech for the given text using browser SpeechSynthesis API.

#### `stopSpeaking()`
Cancels any ongoing speech synthesis.

#### `toggleVoiceInput()`
Toggles speech recognition on/off. Uses Vosk in offline mode, browser SpeechRecognition API as fallback.

#### `handleSend()`
Sends the current input as a user message and triggers AI response generation.

#### `generateAIResponse(messages: Message[])`
Generates AI response using local Ollama instance or fallback logic.

## Usage

```tsx
import TaraInterface from '@/components/TaraInterface';

function App() {
  return <TaraInterface />;
}
```

## Dependencies

- React 18+
- vosk-browser: ^0.0.8
- @/lib/localAI: Custom AI generation utilities
- @/hooks/use-toast: Toast notification hook
- shadcn/ui components: Button, Input, ScrollArea, etc.
- Lucide React icons

## Configuration

### Vosk Model
- Model path: `/models/vosk-model-small-en-us-0.15/`
- Sample rate: 16000 Hz
- Continuous mode enabled with interim results

### Speech Synthesis
- Rate: 0.95
- Pitch: 1.0
- Volume: 1.0

## Error Handling

- Vosk initialization failures fall back to browser SpeechRecognition API
- Network errors are handled gracefully with user notifications
- Microphone access denied shows appropriate error messages

## Performance Considerations

- Audio processing uses optimized settings (16kHz sample rate, noise suppression)
- Speech recognition runs in Web Workers for non-blocking UI
- Message history is limited to prevent memory issues

## Browser Compatibility

- Modern browsers with Web Audio API support
- SpeechRecognition API (Chrome/Edge) or Vosk (all modern browsers)
- SpeechSynthesis API (all modern browsers)

## Research Papers and References

### Speech Recognition and Kaldi

1. **The Kaldi Speech Recognition Toolkit**  
   Povey, D., Ghoshal, A., Boulianne, G., Burget, L., Glembek, O., Goel, N., ... & Silovský, J. (2011).  
   *IEEE Workshop on Automatic Speech Recognition and Understanding (ASRU)*.  
   [Paper](https://www.danielpovey.com/files/2011_asru_kaldi.pdf)

2. **Kaldi: A Toolkit for Speech Recognition**  
   Povey, D., & Peddinti, V. (2015).  
   *Computer Speech & Language, 33*, 1-2.  
   [Paper](https://www.sciencedirect.com/science/article/pii/S0885230815000298)

### Vosk and Browser-Based Speech Recognition

3. **Vosk: Offline Speech Recognition API**  
   Vosk project documentation and implementation based on Kaldi.  
   [GitHub Repository](https://github.com/alphacep/vosk-api)

4. **Deep Speech: Scaling up end-to-end speech recognition**  
   Hannun, A., Case, C., Casper, J., Catanzaro, B., Diamos, G., Elsen, E., ... & Sengupta, S. (2014).  
   *arXiv preprint arXiv:1412.5567*.  
   [Paper](https://arxiv.org/abs/1412.5567)

### Text-to-Speech and Conversational AI

5. **Tacotron: Towards End-to-End Speech Synthesis**  
   Wang, Y., Skerry-Ryan, R., Stanton, D., Wu, Y., Weiss, R., Jaitly, N., ... & Le, Q. V. (2017).  
   *arXiv preprint arXiv:1703.10135*.  
   [Paper](https://arxiv.org/abs/1703.10135)

6. **WaveNet: A Generative Model for Raw Audio**  
   van den Oord, A., Dieleman, S., Zen, H., Simonyan, K., Vinyals, O., Graves, A., ... & Kavukcuoglu, K. (2016).  
   *arXiv preprint arXiv:1609.03499*.  
   [Paper](https://arxiv.org/abs/1609.03499)

### Offline AI and Edge Computing

7. **Edge Intelligence: Paving the Way for 5G-Enabled Edge Computing**  
   Shi, W., Cao, J., Zhang, Q., Li, Y., & Xu, L. (2016).  
   *IEEE Communications Magazine, 54*(8), 25-31.  
   [Paper](https://ieeexplore.ieee.org/document/7550379)

8. **Federated Learning: Collaborative Machine Learning without Centralized Training Data**  
   McMahan, B., Moore, E., Ramage, D., Hampson, S., & y Arcas, B. A. (2017).  
   *Google Research Blog*.  
   [Paper](https://ai.googleblog.com/2017/04/federated-learning-collaborative.html)

## Future Improvements

- Implement wake word detection for hands-free operation
- Add support for multiple languages in speech recognition
- Integrate with more advanced local AI models
- Optimize memory usage for long conversations
- Add voice activity detection to automatically stop listening

## Contributing

When modifying this component, ensure:
- All new features include proper error handling
- Performance impact is measured and optimized
- Browser compatibility is tested across target platforms
- Documentation is updated to reflect changes
