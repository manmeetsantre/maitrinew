# 🚀 MindMatters - Hackathon Quick Start Guide

**Get the entire platform running in ONE command!**

## ⚡ Quick Start (One Command)

### Windows
```powershell
npm start
# or
.\start.ps1
```

### Linux/macOS
```bash
npm start
# or
chmod +x start.sh && ./start.sh
```

That's it! The script will:
- ✅ Check all dependencies (Node.js, Python, ffmpeg, Ollama)
- ✅ Install missing dependencies automatically
- ✅ Install all npm and pip packages
- ✅ Start all 5 services
- ✅ Verify all services are running
- ✅ Open the main application

## 📋 What Gets Started

After running the startup script, these services will be available:

| Service | URL | Description |
|---------|-----|-------------|
| **Main Frontend** | http://localhost:8080 | MindMatters web application |
| **Backend API** | http://localhost:4000 | REST API server |
| **TARS (AI Chat)** | http://localhost:5173 | AI mental health assistant |
| **Mood Tracker** | http://localhost:5002 | Facial emotion detection |
| **Voice Analysis** | http://localhost:5000 | Vocal emotion analysis |

## 🔧 Prerequisites

The startup script will check and guide you through installing:

1. **Node.js** (v18+) - [Download](https://nodejs.org/)
2. **Python** (3.8+) - [Download](https://www.python.org/)
3. **ffmpeg** - Will auto-install on Windows, or install manually:
   - Windows: `winget install Gyan.FFmpeg`
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt-get install ffmpeg`
4. **Ollama** (Optional, for TARS offline mode) - [Download](https://ollama.ai/download)
   - After installing, run: `ollama pull llama3.1:8b

## 📦 Manual Setup (If Needed)

If the automated script doesn't work, follow these steps:

### 1. Install Dependencies

```bash
# Node.js dependencies
npm install
cd TARS && npm install && cd ..

# Python dependencies
pip install -r moodtracker/requirements.txt
pip install -r Voice/requirements.txt
```

### 2. Environment Variables (Optional)

Create a `.env` file in the root directory:
```env
VITE_MINDCARE_BASE_URL=http://localhost:4000
JWT_SECRET=your_jwt_secret_here
```

### 3. Start Services Manually

**Option A: Use the startup script**
```bash
npm start
```

**Option B: Start individually**
```bash
# Terminal 1: Main Frontend + Backend
npm run dev:full

# Terminal 2: TARS
cd TARS && npm run dev

# Terminal 3: Mood Tracker
cd moodtracker && python main.py

# Terminal 4: Voice Analysis
cd Voice && python voice_assistant.py
```

## 🛑 Stopping Services

### Windows
```powershell
.\stop.ps1
# or
npm run stop
```

### Linux/macOS
```bash
./stop.sh
# or
npm run stop
```

## 🐛 Troubleshooting

### Port Already in Use
The startup script automatically kills processes on required ports. If issues persist:
- Windows: `netstat -ano | findstr :8080` then `taskkill /PID <pid> /F`
- Linux/macOS: `lsof -ti:8080 | xargs kill -9`

### Python Dependencies Not Installing
```bash
# Try with pip3
pip3 install -r moodtracker/requirements.txt
pip3 install -r Voice/requirements.txt

# Or use virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate  # Windows
pip install -r moodtracker/requirements.txt
```

### ffmpeg Not Found
- Windows: The script will auto-install via winget
- Linux: `sudo apt-get update && sudo apt-get install ffmpeg`
- macOS: `brew install ffmpeg`

### Ollama Model Not Found
```bash
ollama pull llama3.1:8b
```

### Services Not Starting
1. Check logs in the `logs/` directory (Linux/macOS)
2. Check PowerShell/terminal windows (Windows - services run in separate windows)
3. Verify all dependencies are installed
4. Ensure ports 8080, 4000, 5173, 5002, 5000 are available

## 📝 Project Structure

```
MindMatters_final/
├── start.ps1          # Windows startup script
├── start.sh           # Linux/macOS startup script
├── stop.ps1           # Windows stop script
├── stop.sh            # Linux/macOS stop script
├── package.json       # Main npm dependencies
├── server/            # Backend API (Node.js/Express)
├── src/               # Frontend (React/TypeScript)
├── TARS/              # AI Chat Assistant
│   └── package.json   # TARS dependencies
├── moodtracker/       # Facial emotion detection
│   └── requirements.txt
└── Voice/             # Voice emotion analysis
    └── requirements.txt
```

## 🎯 Hackathon Demo Flow

1. **Start the platform**: `npm start`
2. **Open**: http://localhost:8080
3. **Navigate to features**:
   - Click "AI Support" → Opens TARS (http://localhost:5173)
   - Click "Mood Tracker" → Opens mood tracking (http://localhost:8080/mood)
   - Click "Facial/Vocal mood detection" → Opens emotion detection (http://localhost:5002)
   - Click "Vocal mood detection" → Opens voice analysis (http://localhost:5000)

## 💡 Tips for Hackathon

- **One Command Setup**: Use `npm start` - it handles everything
- **Quick Restart**: Use `npm run stop` then `npm start` to restart
- **Check Status**: The startup script shows service status
- **Logs**: Check `logs/` directory for service logs (Linux/macOS)
- **Offline Mode**: TARS works offline with Ollama (no internet needed)
- **No Database Setup**: Uses SQLite (no configuration needed)

## 🆘 Need Help?

1. Check the main [README.md](README.md) for detailed documentation
2. Review service-specific READMEs in each directory
3. Check logs for error messages
4. Verify all prerequisites are installed

---


