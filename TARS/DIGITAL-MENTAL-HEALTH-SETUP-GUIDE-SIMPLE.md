# Digital Mental Health Support Assistant - Easy Installation Guide

## What is the Digital Mental Health Support Assistant?
The Digital Mental Health Support Assistant is an offline AI emotional support system with voice recognition, designed to provide privacy-first mental health assistance. It works completely offline once set up, ensuring your emotional expressions remain private and secure.

## ⚠️ Important Disclaimer
**This system provides emotional support, NOT diagnosis, therapy, or medical treatment.**
- If you are in crisis, contact emergency services (911) or a crisis hotline immediately
- For severe mental health concerns, please seek professional help from licensed mental health professionals
- This system complements, but does not replace, professional mental health care

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
   
   **Privacy Note**: This model enables offline AI responses, ensuring your emotional conversations remain completely private.

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
- Restart your terminal/command prompt after installation

### "Voice recognition not working"
- Check browser permissions for microphone access
- Ensure Vosk models are downloaded to `public/models/` directory
- The system will fall back to browser speech recognition if Vosk fails

### "AI responses not working"
- Ensure Ollama is running: `ollama serve`
- Verify the model is installed: `ollama list`
- Check that you have internet connection for connected support mode (optional)

### "Application won't start"
- Check that Node.js is installed: `node --version`
- Verify dependencies are installed: `npm list`
- Check for port conflicts (default port is 5173)

## Privacy and Security Notes

- **Offline Mode**: When operating offline, all data stays on your device
- **Voice Recognition**: Uses local Vosk models - no cloud processing
- **AI Responses**: Uses local Ollama - no data transmission
- **Conversation History**: Stored locally in browser localStorage

## Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all prerequisites are installed correctly
3. Review the detailed [Setup and Implementation Guide](DIGITAL-MENTAL-HEALTH-SETUP-GUIDE.md)
4. Ensure you're using a modern browser (Chrome, Firefox, Safari, or Edge)

## Crisis Resources

If you or someone you know is in crisis:
- **Emergency Services**: 911 (US) or your local emergency number
- **Crisis Text Line**: Text HOME to 741741 (US)
- **National Suicide Prevention Lifeline**: 988 (US)

**Remember**: This system provides emotional support but does not replace professional mental health care.

---

Enjoy using the Digital Mental Health Support Assistant! 💙

