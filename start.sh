#!/bin/bash

# Create logs directory first
mkdir -p logs

# Prepend Node@22 path if it exists (for Mac compatibility)
if [ -d "/opt/homebrew/opt/node@22/bin" ]; then
    export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
fi

# MindMatters - Unified Startup Script for Linux/macOS
# This script starts all services required for the MindMatters platform

echo "========================================"
echo "   MindMatters Platform Startup"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo -e "${YELLOW}[1/6] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js v18+ from https://nodejs.org/${NC}"
    exit 1
fi

# Check if Python is installed
echo -e "${YELLOW}[2/6] Checking Python...${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ Python found: $PYTHON_VERSION${NC}"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo -e "${GREEN}✓ Python found: $PYTHON_VERSION${NC}"
    PYTHON_CMD="python"
else
    echo -e "${RED}✗ Python not found. Please install Python 3.8+${NC}"
    exit 1
fi

# Check if ffmpeg is installed
echo -e "${YELLOW}[3/6] Checking ffmpeg...${NC}"
if command -v ffmpeg &> /dev/null; then
    echo -e "${GREEN}✓ ffmpeg found${NC}"
else
    echo -e "${YELLOW}⚠ ffmpeg not found. Voice analysis features may not work.${NC}"
    echo -e "${YELLOW}  Install: sudo apt-get install ffmpeg (Ubuntu/Debian) or brew install ffmpeg (macOS)${NC}"
fi

# Check if Ollama is running (for TARS)
echo -e "${YELLOW}[4/6] Checking Ollama...${NC}"
if command -v ollama &> /dev/null; then
    if ollama list &> /dev/null; then
        echo -e "${GREEN}✓ Ollama is running${NC}"
        if ! ollama list | grep -q "llama3.1:8b"; then
            echo -e "${YELLOW}⚠ llama3.1:8b model not found. Pulling...${NC}"
            ollama pull llama3.1:8b
        fi
    else
        echo -e "${YELLOW}⚠ Ollama not running. TARS will work in offline mode only.${NC}"
        echo -e "${YELLOW}  Install from https://ollama.ai/download${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Ollama not found. TARS will work in offline mode only.${NC}"
    echo -e "${YELLOW}  Install from https://ollama.ai/download${NC}"
fi

# Install Node.js dependencies
echo -e "${YELLOW}[5/6] Installing Node.js dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "  Installing main dependencies..."
    npm install
else
    echo -e "${GREEN}✓ Main dependencies already installed${NC}"
fi

if [ ! -d "TARS/node_modules" ]; then
    echo "  Installing TARS dependencies..."
    cd TARS && npm install && cd ..
else
    echo -e "${GREEN}✓ TARS dependencies already installed${NC}"
fi

# Install Python dependencies
echo -e "${YELLOW}[6/6] Installing Python dependencies...${NC}"
if [ ! -d "moodtracker/__pycache__" ]; then
    echo "  Installing moodtracker dependencies..."
    ./venv/bin/pip install -r moodtracker/requirements.txt
else
    echo -e "${GREEN}✓ MoodTracker dependencies already installed${NC}"
fi

if [ ! -d "Voice/__pycache__" ]; then
    echo "  Installing Voice dependencies..."
    ./venv/bin/pip install -r Voice/requirements.txt
else
    echo -e "${GREEN}✓ Voice dependencies already installed${NC}"
fi

echo ""
echo "========================================"
echo -e "${CYAN}   Starting All Services...${NC}"
echo "========================================"
echo ""
echo -e "${YELLOW}Services will start on:${NC}"
echo -e "${CYAN}  • Main Frontend:    http://localhost:8080${NC}"
echo -e "${CYAN}  • Backend API:       http://localhost:4000${NC}"
echo -e "${CYAN}  • TARS (AI Chat):    http://localhost:5173${NC}"
echo -e "${CYAN}  • Mood Tracker:     http://localhost:5002${NC}"
echo -e "${CYAN}  • Voice Analysis:   http://localhost:5000${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Kill any existing processes on these ports
echo "Cleaning up existing processes..."
for port in 8080 4000 5173 5002 5000; do
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
done
sleep 2

# Start all services in background
echo "Starting services..."

# Start MindMatters Frontend + Backend
npm run dev:full > logs/main.log 2>&1 &
MAIN_PID=$!

# Start TARS
(cd TARS && npm run dev > ../logs/tars.log 2>&1) &
TARS_PID=$!

# Start MoodTracker
(cd moodtracker && ../venv/bin/python main.py > ../logs/moodtracker.log 2>&1) &
MOODTRACKER_PID=$!

# Start Voice Assistant
(cd Voice && ../venv/bin/python voice_assistant.py > ../logs/voice.log 2>&1) &
VOICE_PID=$!

# Create logs directory if it doesn't exist
mkdir -p logs

# Save PIDs to file for cleanup
echo $MAIN_PID > logs/pids.txt
echo $TARS_PID >> logs/pids.txt
echo $MOODTRACKER_PID >> logs/pids.txt
echo $VOICE_PID >> logs/pids.txt

echo ""
echo -e "${GREEN}✓ All services started!${NC}"
echo ""
echo -e "${YELLOW}Waiting 10 seconds for services to initialize...${NC}"
sleep 10

echo ""
echo "========================================"
echo -e "${CYAN}   Services Status${NC}"
echo "========================================"

# Check service status
check_service() {
    local name=$1
    local port=$2
    local url=$3
    
    if nc -z localhost $port 2>/dev/null; then
        echo -e "${GREEN}✓ $name is running on $url${NC}"
    else
        echo -e "${RED}✗ $name is not responding${NC}"
    fi
}

check_service "Main Frontend" 8080 "http://localhost:8080"
check_service "Backend API" 4000 "http://localhost:4000"
check_service "TARS" 5173 "http://localhost:5173"
check_service "Mood Tracker" 5002 "http://localhost:5002"
check_service "Voice Analysis" 5000 "http://localhost:5000"

echo ""
echo "========================================"
echo -e "${GREEN}   Ready! Open http://localhost:8080${NC}"
echo "========================================"
echo ""
echo -e "${YELLOW}Logs are available in the logs/ directory${NC}"
echo -e "${YELLOW}To stop all services, run: ./stop.sh${NC}"
echo ""

# Keep script running
wait

