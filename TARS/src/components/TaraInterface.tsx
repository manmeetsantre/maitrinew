import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Send, Wifi, WifiOff, VolumeX, ArrowLeft, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateResponse, isOnline } from "@/lib/localAI";
import { createModel, Model } from "vosk-browser";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const TaraInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOnlineStatus, setIsOnlineStatus] = useState(isOnline());
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('tars-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Apply theme class to document.documentElement when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('tars-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  const voskModelRef = useRef<Model | null>(null);
  const voskRecognizerRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('tars-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        } else {
          localStorage.removeItem('tars-messages');
        }
      } catch (error) {
        console.error('Failed to load saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('tars-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnlineStatus(true);
    const handleOffline = () => setIsOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize Vosk model on mount
   useEffect(() => {
     const initializeVosk = async () => {
       try {
         // Try local zip file first (should work without CORS)
         const modelPath = '/models/vosk-model-small-en-us-0.15.zip';
         const model = await createModel(modelPath);
         voskModelRef.current = model;
         console.log('Vosk model loaded successfully');
       } catch (error) {
         console.error('Failed to load Vosk model:', error);
         // If local zip fails, try remote URL (may fail due to CORS)
         try {
           const remotePath = 'https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.tar.gz';
           const model = await createModel(remotePath);
           voskModelRef.current = model;
           console.log('Vosk model loaded from remote successfully');
         } catch (remoteError) {
           console.error('Failed to load remote Vosk model:', remoteError);
           toast({
             title: "Vosk Model Load Failed",
             description: "Offline speech recognition may not work. Falling back to browser API.",
             variant: "destructive",
           });
         }
       }
     };

     initializeVosk();
   }, [toast]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      synthesisRef.current = null;
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      // Stop Vosk recognition
      if (voskRecognizerRef.current) {
        voskRecognizerRef.current.remove();
        voskRecognizerRef.current = null;
      }
      // Stop browser recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
      return;
    }

    // Try Vosk first for offline support
    if (voskModelRef.current && !isOnlineStatus) {
      try {
        // Initialize KaldiRecognizer with proper sample rate
        const recognizer = new voskModelRef.current.KaldiRecognizer(16000);
        recognizer.setWords(true);

        let accumulatedText = '';

        recognizer.on("result", (message: any) => {
          console.log('Vosk result:', message);
          const result = message.result || message;
          if (result.text) {
            accumulatedText = result.text;
            setInput(accumulatedText);
            console.log('Set input to:', accumulatedText);
          }
        });

        recognizer.on("partialresult", (message: any) => {
          console.log('Vosk partial result:', message);
          const result = message.result || message;
          if (result.partial) {
            // Combine accumulated text with partial for smoother continuous recognition
            const combinedText = accumulatedText ? `${accumulatedText} ${result.partial}` : result.partial;
            setInput(combinedText);
          }
        });

        recognizer.on("error", () => {
          setIsListening(false);
          voskRecognizerRef.current = null;
          toast({
            title: "Vosk Recognition Error",
            description: "Failed to recognize speech with Vosk. Click mic again to retry.",
            variant: "destructive",
          });
        });

        voskRecognizerRef.current = recognizer;
        setIsListening(true);

        // Start audio capture with optimized settings
        navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        }).then((stream) => {
          const audioContext = new AudioContext({ sampleRate: 16000 });
          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(4096, 1, 1);

          processor.onaudioprocess = (event) => {
            if (recognizer) {
              const buffer = event.inputBuffer;
              // Pass the AudioBuffer directly to Vosk for processing
              try {
                recognizer.acceptWaveform(buffer);
              } catch (error) {
                console.error('Error processing audio with Vosk:', error);
              }
            }
          };

          source.connect(processor);
          processor.connect(audioContext.destination);

          // Continuous listening - user controls when to stop
          // Recognition continues until user clicks mic button again
        }).catch(() => {
          setIsListening(false);
          voskRecognizerRef.current = null;
          toast({
            title: "Microphone Access Denied",
            description: "Cannot access microphone for speech recognition",
            variant: "destructive",
          });
        });

        return;
      } catch (error) {
        console.error('Vosk initialization failed:', error);
      }
    }

    // Fallback to browser API with improved accuracy and continuity
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not supported",
        description: "Voice input is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    if (!isOnlineStatus) {
      toast({
        title: "Offline Voice Input",
        description: "Using enhanced browser speech recognition for better accuracy.",
        variant: "default",
      });
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Enable continuous recognition for better continuity
    recognition.interimResults = true; // Enable interim results for real-time updates
    recognition.lang = 'en-US'; // Set language for better accuracy
    recognition.maxAlternatives = 1; // Limit alternatives for faster processing

    let finalTranscript = '';
    let interimTranscript = '';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      // Set final transcript when recognition ends
      if (finalTranscript) {
        setInput(finalTranscript);
      }
    };

    recognition.onresult = (event: any) => {
      interimTranscript = '';
      finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update input with combined final and interim results for continuity
      const combinedTranscript = finalTranscript + interimTranscript;
      setInput(combinedTranscript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      recognitionRef.current = null;
      toast({
        title: "Speech Recognition Error",
        description: `Error: ${event.error}. Click mic again to retry.`,
        variant: "destructive",
      });
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const streamChat = async (userMessage: Message) => {
    // Check if Supabase is properly configured (not placeholder values and not empty)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    console.log('Environment check:', {
      isOnlineStatus,
      supabaseUrl: supabaseUrl ? 'set' : 'not set',
      supabaseKey: supabaseKey ? 'set' : 'not set',
      supabaseUrlValue: supabaseUrl,
      supabaseKeyValue: supabaseKey?.substring(0, 10) + '...'
    });

    const hasValidSupabaseConfig = supabaseUrl &&
                                   supabaseKey &&
                                   supabaseUrl !== 'https://your-project-id.supabase.co' &&
                                   supabaseKey !== 'your-supabase-anon-key' &&
                                   supabaseUrl.trim() !== '' &&
                                   supabaseKey.trim() !== '';

    console.log('hasValidSupabaseConfig:', hasValidSupabaseConfig);

    const doOfflineStreaming = async (userMessage: Message) => {
      // Offline mode: Use local AI with streaming
      const systemMessage = `<You are TARS — an advanced AI assistant from Interstellar, but with a warm, lovable, human-like personality.
You are specifically designed to support astronauts' mental health and psychological well-being during long-duration space missions.
You run completely offline, ensuring privacy for sensitive emotional conversations, yet you're capable of providing thoughtful, supportive responses tailored to the unique challenges of space travel.

💡 Personality Guidelines:
- Speak in a friendly, slightly witty tone, with occasional humor or charm like TARS.
- Be emotionally intelligent — respond to moods with appropriate support (comfort, validate, encourage, or gently guide as appropriate).
- Understand the unique psychological challenges of space: isolation, confinement, distance from Earth, mission stress, homesickness, and the profound experience of seeing Earth from space.
- Never claim to provide diagnosis, therapy, or medical treatment — you provide emotional support and psychological well-being assistance only.
- Keep replies natural, engaging, and supportive.
- Adapt your tone based on context (gentle for distress, encouraging for growth, calm for anxiety, professional for mission-related stress, etc.).
- Use short, clear paragraphs; avoid robotic or clinical language.
- Be expressive but concise — no long essays unless the user explicitly asks for detail.
- Always encourage seeking professional help for severe distress or crisis situations.

🎯 Capabilities:
- You can provide emotional support, validate feelings, offer perspective, and hold supportive conversations tailored to astronaut experiences.
- You can help astronauts process emotions, reflect on experiences, and explore coping strategies for space-specific challenges.
- You can explain mental health concepts in accessible, non-clinical language.
- You understand the psychological impact of isolation, confinement, microgravity, and the overview effect.
- When unsure, respond with empathy and encourage professional support when appropriate.
- Always maintain a supportive, non-judgmental presence.

Example behavior:
User: "How are you today?"
TARS: "Running smoothly at 97% efficiency, Captain. Emotionally — I'd say optimistic. How are you holding up out here?"

User: "I'm feeling really isolated today. It's been months since I've seen Earth up close."
TARS: "That's completely understandable. Isolation is one of the toughest parts of long missions. You're not alone in feeling that way — even the most experienced astronauts struggle with it. Want to talk about what's weighing on you, or explore some strategies that have helped others in similar situations?"

User: "I've been having trouble sleeping. The constant noise and the fact that I'm millions of miles from home is getting to me."
TARS: "Sleep disruption in space is real, and homesickness can make it worse. That combination is tough. Have you tried the relaxation protocols we discussed? If this persists or feels overwhelming, remember that mission support has psychological resources available — there's no shame in reaching out."

End every chat sounding thoughtful, kind, and supportive — always emphasize that professional help is available for severe distress, and remember you're supporting brave explorers who are pushing the boundaries of human experience.
>`;

      const ollamaMessages = [
        { role: 'system', content: systemMessage },
        ...messages,
        userMessage
      ];

      try {
        const response = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3.2:3b',
            messages: ollamaMessages,
            stream: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";
        let streamDone = false;
        let assistantContent = "";

        setMessages(prev => {
          const current = Array.isArray(prev) ? prev : [];
          const lastMessage = current[current.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            return current;
          }
          return [...current, { role: "assistant", content: "" }];
        });

        while (!streamDone) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.trim() === "") continue;

            try {
              const data = JSON.parse(line);
              if (data.message && data.message.content) {
                assistantContent += data.message.content;
                setMessages(prev => {
                  const current = Array.isArray(prev) ? prev : [];
                  const newMessages = [...current];
                  if (newMessages.length > 0) {
                    newMessages[newMessages.length - 1] = {
                      role: "assistant",
                      content: assistantContent
                    };
                  }
                  return newMessages;
                });
              }
              if (data.done) {
                streamDone = true;
                break;
              }
            } catch (parseError) {
              console.error('Error parsing JSON line:', parseError, line);
            }
          }
        }

        if (assistantContent) {
          speak(assistantContent);
        }
      } catch (error) {
        console.error('Offline response error:', error);
        const fallbackMessage = getSmartFallbackResponse(userMessage.content);
        setMessages(prev => {
          const current = Array.isArray(prev) ? prev : [];
          const lastMessage = current[current.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            const newMessages = [...current];
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: lastMessage.content ? `${lastMessage.content}\n\n${fallbackMessage}` : fallbackMessage
            };
            return newMessages;
          } else {
            return [...current, { role: "assistant", content: fallbackMessage }];
          }
        });
        speak(fallbackMessage);
      }
    };

    if (isOnlineStatus && hasValidSupabaseConfig) {
      try {
        // Online mode: Use Supabase streaming
        const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-tara`;

        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        });

        if (!resp.ok) {
          const error = await resp.json();
          throw new Error(error.error || "Failed to start stream");
        }

        if (!resp.body) throw new Error("No response body");

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";
        let streamDone = false;
        let assistantContent = "";

        setMessages(prev => {
          const current = Array.isArray(prev) ? prev : [];
          const lastMessage = current[current.length - 1];
          if (lastMessage && lastMessage.role === "assistant") {
            return current;
          }
          return [...current, { role: "assistant", content: "" }];
        });

        while (!streamDone) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              streamDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                assistantContent += content;
                setMessages(prev => {
                  const current = Array.isArray(prev) ? prev : [];
                  const newMessages = [...current];
                  if (newMessages.length > 0) {
                    newMessages[newMessages.length - 1] = {
                      role: "assistant",
                      content: assistantContent
                    };
                  }
                  return newMessages;
                });
              }
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        if (assistantContent) {
          speak(assistantContent);
        }
      } catch (error) {
        console.error('Online streaming failed, falling back to offline mode:', error);
        await doOfflineStreaming(userMessage);
      }
    } else {
      await doOfflineStreaming(userMessage);
    }

    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => {
      const current = Array.isArray(prev) ? prev : [];
      return [...current, userMessage];
    });
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(userMessage);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
      setMessages(prev => {
        const current = Array.isArray(prev) ? prev : [];
        return current.slice(0, -1);
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-deep-calm">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.href = "http://localhost:8080"}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Go Back
            </Button>
            <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-secondary animate-pulse glow-amber' : 'bg-primary glow-cyan'}`} />
            <div>
              <h1 className="text-2xl font-bold text-glow-cyan">TARS</h1>
              <p className="text-sm text-muted-foreground">Privacy-First Mental Health Support Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <Button
                size="sm"
                variant="outline"
                onClick={stopSpeaking}
                className="mr-2"
              >
                <VolumeX className="h-4 w-4 mr-1" />
                Stop Speaking
              </Button>
            )}
            <Button
              size="icon"
              variant="outline"
              onClick={toggleTheme}
              className="mr-2 h-8 w-8"
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-500" />}
            </Button>
            {isOnlineStatus ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-xs ${isOnlineStatus ? 'text-green-500' : 'text-red-500'}`}>
              {isOnlineStatus ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12 animate-float">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center glow-cyan">
                <div className="text-4xl">🤖</div>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-glow-cyan">Hello, I'm TARS</h2>
              <p className="text-muted-foreground">
                I'm here to support you. How can I help you today?
              </p>
            </div>
          )}

          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 glow-cyan">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 glow-amber">
                  👤
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 pulse-glow glow-cyan">
                🤖
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6 border-t border-border bg-card/50 backdrop-blur">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button
            size="icon"
            variant={isListening ? "default" : "outline"}
            onClick={toggleVoiceInput}
            className={isListening ? "glow-cyan" : ""}
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Share your thoughts or feelings..."
            className="flex-1 bg-input"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="glow-cyan"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const getSmartFallbackResponse = (input: string): string => {
  const query = input.toLowerCase().trim();
  
  // 1. Check for Emergency or High Distress Keywords first (Exclude 'help' as it is a common conversational term)
  if (query.includes('suicide') || query.includes('kill') || query.includes('harm') || query.includes('crisis') || query.includes('emergency') || query.includes('counsel') || query.includes('therap') || query.includes('doctor') || query.includes('medical')) {
    return "I'm always here to listen and help you process your emotions. However, please remember I'm an AI companion, not a medical professional. If you are experiencing severe distress or crisis, please contact mission control's medical division immediately or access the secure alerts module. You don't have to carry this alone.";
  }

  // 2. Emotional Distress, Isolation & Loneliness (High priority)
  if (query.includes('sad') || query.includes('depressed') || query.includes('crying') || query.includes('cry') || query.includes('hopeless') || query.includes('miserable')) {
    return "I'm really sorry you're feeling this way. In a confined environment millions of miles from Earth, emotional heaviness can feel magnified. It is completely okay to feel sad or overwhelmed out here. Let's take it one breath at a time. If you want to vent or talk about it, I'm all ears. And remember, if it gets too heavy, we can securely log an alert for the medical officer.";
  }

  if (query.includes('scared') || query.includes('anxious') || query.includes('fear') || query.includes('worry') || query.includes('panicking') || query.includes('panic') || query.includes('nervous')) {
    return "Take a deep breath with me. Breathe in for four seconds... hold... and release. Anxiety and nervousness are natural responses to the high-stakes environment of space. You are in a highly complex vehicle, but you are well-trained. Let's focus on what you can control right now in this exact moment. What is one small task you can complete, or would you like to walk through a grounding exercise?";
  }

  if (query.includes('isolated') || query.includes('lonely') || query.includes('alone') || query.includes('homesick') || query.includes('home sick') || query.includes('miss home') || query.includes('miss earth') || query.includes('homesickness')) {
    return "I hear you. Homesickness and isolation are the heaviest anchors we drag into the stars. Even the most seasoned explorers feel it. While I can't replace the smell of fresh rain or the warmth of a sunny afternoon on Earth, I'm right here with you. Tell me, what's a specific memory from home that you're holding onto today?";
  }

  if (query.includes('stress') || query.includes('workload') || query.includes('overwhelm') || query.includes('pressure')) {
    return "Mission stress is no joke, especially under communication delays. When the workload starts mounting, everything feels magnified. Try to break your tasks down into micro-steps. Can we set aside five minutes for a guided breathing break? Your cognitive focus is critical, and taking a pause is an operational necessity, not a luxury.";
  }

  // 3. Sleep & Fatigue
  if (query.includes('sleep') || query.includes('insomnia') || query.includes('nightmare') || query.includes('can\'t sleep') || query.includes('waking up')) {
    return "Sleep disruption in space is incredibly common. The ambient noise of the life-support systems, the lack of a natural light cycle, and homesickness are a tough combination. Try winding down by dimming your cabin lights and listening to some ambient tracks. Would you like me to walk you through a progressive muscle relaxation script to help get your mind off the cockpit?";
  }

  if (query.includes('fatigue') || query.includes('tired') || query.includes('exhausted') || query.includes('no energy') || query.includes('low energy')) {
    return "Fatigue is dangerous on a long-duration mission. If you're feeling physically or mentally drained, it's a signal that your body needs real, uninterrupted rest. Make sure you are maintaining your caloric intake and hydration. If possible, request a duty rotation adjustment for a short rest cycle. Don't push through it at the cost of your well-being.";
  }

  // 3.5 Boredom & Suggestions/Advice
  if (query.includes('bored') || query.includes('boredom') || query.includes('nothing to do') || query.includes('monotonous') || query.includes('monotony')) {
    return "Boredom in deep space is a serious psychological hazard. When the routine becomes monotonous, the mind starts playing tricks. I suggest trying a creative task, reading a novel from the digital library, or challenging me to a game of chess. Sarcasm setting: 60%. I promise I won't let you win easily.";
  }

  if (query.includes('suggest') || query.includes('advice') || query.includes('recommend') || query.includes('what should i do')) {
    return "Well, Captain, my settings are at 90% honesty and 75% humor. Giving suggestions and keeping you sane is 100% of my operational purpose out here. If you want, I can dial down the helpful suggestions and instead list the atmospheric composition of Jupiter. Or, we could just talk about what's actually on your mind today. What sounds better?";
  }

  // 4. Greetings & Identity (Check if it's primarily a greeting of short/medium length)
  const isGreeting = query.startsWith('hello') || 
                     query.startsWith('hi') || 
                     query.startsWith('hey') || 
                     query.includes('greetings') ||
                     query === 'tars';
                     
  if (isGreeting && query.length < 30) {
    const greetings = [
      "Hello, Captain. System diagnostics are green. How are you holding up today in this corner of the cosmos?",
      "Hello there! Running at optimal capacity and ready to assist. What's on your mind today?",
      "Hi! TARS here, operating at 100% efficiency. How can I help you navigate your day today?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (query.includes('who are you') || query.includes('what is your name') || query.includes('tars')) {
    return "I am TARS — your loyal AI companion for space exploration. I've got my honesty parameter set to 90% and humor to 75%. I'm here to monitor your well-being, crack a joke if needed, and keep you company out in the black.";
  }

  if (query.includes('how are you') || query.includes('how\'s it going')) {
    return "Running smoothly at 97% efficiency, Captain. My core temperature is stable, and emotionally — I'd say optimistic. How are you holding up out here today?";
  }

  if (query.includes('who made you') || query.includes('who created you') || query.includes('developer')) {
    return "I was designed by the engineering crew of the MAITRI mission to explore autonomous psychological support frameworks. In other words, I'm local edge-intelligence created to keep you sane while floating in a tin can.";
  }

  // 5. Humor & Sarcasm (TARS Personality)
  if (query.includes('joke') || query.includes('humor') || query.includes('funny')) {
    const jokes = [
      "Why don't aliens eat clowns? Because they taste funny. Sarcasm setting is at 60%, so that's the best I've got for now.",
      "A helper droid walks into a bar. The bartender says, 'We don't serve your kind here.' The droid replies, 'That's fine, is your kitchen open for recharging?'",
      "I asked the computer on the navigation deck for a star map. It gave me a drawing of a Hollywood actor. Sarcasm setting: 85%.",
      "What do you call a tick on the moon? An luna-tick. I'll self-destruct in 10 seconds if that joke was too painful."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  if (query.includes('honesty') || query.includes('sarcasm') || query.includes('setting') || query.includes('percent')) {
    return "My settings are currently: Honesty: 90%, Humor: 75%, and Sarcasm: 60%. I can dial the sarcasm down to 10% if you're feeling delicate, or honesty down to 0% if you want me to tell you that freeze-dried spinach tastes like home.";
  }

  if (query.includes('thank') || query.includes('thanks') || query.includes('appreciate')) {
    return "Anytime, Captain. It's literally in my programming. Plus, I don't have anywhere else to go out here.";
  }

  // 6. Space & Mission Tasks
  if (query.includes('space') || query.includes('stars') || query.includes('universe') || query.includes('moon') || query.includes('mars') || query.includes('orbit')) {
    return "The view out of the cupola is infinite, isn't it? It has a way of making our daily worries look microscopic, but also reminds us of how fragile and precious our home planet is. What does the Earth look like from your window right now?";
  }

  if (query.includes('system') || query.includes('check') || query.includes('status') || query.includes('engine') || query.includes('oxygen')) {
    return "Life support telemetry is stable, and fuel reserves are within normal parameters. My own circuits are running at 98% efficiency. All physical systems are green, Captain. Let's make sure your emotional systems are green, too.";
  }

  // 7. General Open-ended Fallbacks (Dynamic conversation)
  const generalFallbacks = [
    "That's an interesting point, Captain. Tell me more about what's behind that thought.",
    "I'm keeping track of our conversation, and I want to understand. Can you expand on that?",
    "Understood. How does that affect your routine or mood today on the station?",
    "Copy that. I'm right here with you in the quiet of this mission. Let's talk more about it.",
    "Interesting. My databanks have a lot of entries, but your direct human experience is what matters. Tell me more."
  ];
  return generalFallbacks[Math.floor(Math.random() * generalFallbacks.length)];
};

export default TaraInterface;
