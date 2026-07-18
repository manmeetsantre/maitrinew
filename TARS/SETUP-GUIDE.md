# TARS Setup Guide - Easy Installation for Beginners

## What is TARS?
TARS is an offline AI chatbot with voice recognition, inspired by the robot from Interstellar. It works completely offline once set up.

## Quick System Requirements Check
- **Operating System**: Windows 10/11, macOS, or Linux
- **RAM**: At least 8GB (16GB recommended for smooth performance)
- **Storage**: 10GB free space
- **Internet**: Required only for initial setup, works offline after

## Step-by-Step Installation (Choose Your Method)

### Method 1: One-Click Setup (Recommended for Beginners)

1. **Download and Install Node.js**
   - Go to https://nodejs.org/
   - Download the LTS version (recommended for most users)
   - Run the installer and follow the prompts
   - Restart your computer after installation

2. **Download and Install Ollama**
   - Go to https://ollama.ai/download
   - Download the installer for your operating system
   - Run the installer and follow the prompts

3. **Install the AI Model**
   - Open Command Prompt/Terminal
   - Run: `ollama pull llama3.1:8b`
   - Wait for download to complete (this may take 10-20 minutes)

4. **Install Project Dependencies**
   - Open Command Prompt/Terminal in the project folder
   - Run: `npm install`
   - Wait for installation to complete

5. **Start the Application**
   - In the same terminal, run: `npm run dev`
   - Open your browser to http://localhost:5173 (or the URL shown in terminal)

### Method 2: Using Bun (Faster Alternative)

If you prefer Bun over npm:

1. **Install Bun**
   - Go to https://bun.sh/
   - Follow installation instructions for your OS

2. **Install Dependencies**
   - In project folder: `bun install`

3. **Start Application**
   - `bun run dev`

## Troubleshooting Common Issues

### "npm command not found"
- Reinstall Node.js from https://nodejs.org/
- Make sure to check "Add to PATH" during installation

### "ollama command not found"
- Reinstall Ollama from https://ollama.ai/download
- On Windows, you may need to restart Command Prompt

### Model Download Stuck
- Check your internet connection
- Try: `ollama pull llama3.1:8b` again
- If still stuck, try a smaller model: `ollama pull llama3.2:3b`

### Application Won't Start
- Make sure port 5173 is not blocked by firewall
- Try a different browser (Chrome recommended)
- Check if Ollama is running: `ollama list`

### Voice Recognition Not Working
- Allow microphone permissions in browser
- Try refreshing the page
- Check browser compatibility (Chrome/Edge work best)

## Offline Usage
Once everything is set up:
1. Start Ollama: `ollama serve` (in a separate terminal)
2. Start the app: `npm run dev`
3. Go offline - the app will automatically switch to offline mode
4. Use voice commands or text input

## Performance Tips
- Close other applications to free up RAM
- Use Chrome browser for best performance
- Keep at least 4GB RAM free for the AI model

## Need Help?
- Check the browser console (F12) for error messages
- Make sure all steps above are completed
- Restart your computer if issues persist

## What's Included
- ✅ Offline AI chatbot (Llama 3.1 model)
- ✅ Voice recognition (works offline)
- ✅ Text-to-speech responses
- ✅ Conversation history saving
- ✅ Modern web interface

Enjoy chatting with TARS! 🤖
