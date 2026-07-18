#!/bin/bash

# Color definitions
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

echo -e "${CYAN}===============================================${RESET}"
echo -e "${CYAN}       TARS Chatbot Auto-Setup & Launch        ${RESET}"
echo -e "${CYAN}===============================================${RESET}"

# 1. Check for Node.js
if ! command -v node &> /dev/null; then
    # Try common Mac Homebrew path just in case
    if [ -f "/opt/homebrew/bin/node" ]; then
        export PATH="/opt/homebrew/bin:$PATH"
        echo -e "${GREEN}✓ Node.js found in Homebrew path ($(node -v))${RESET}"
    else
        echo -e "${RED}✗ Node.js is not installed!${RESET}"
        echo -e "${YELLOW}Please install Node.js using Homebrew (brew install node) or from https://nodejs.org${RESET}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Node.js is installed ($(node -v))${RESET}"
fi

# 2. Check for Ollama
if ! command -v ollama &> /dev/null; then
    # Check in Applications or Homebrew paths specifically for Mac users
    if [ -f "/opt/homebrew/bin/ollama" ]; then
        export PATH="/opt/homebrew/bin:$PATH"
        echo -e "${GREEN}✓ Ollama found in Homebrew path${RESET}"
    elif [ -d "/Applications/Ollama.app" ]; then
        export PATH="/Applications/Ollama.app/Contents/Resources:$PATH"
        echo -e "${GREEN}✓ Ollama app found${RESET}"
    else
        echo -e "${RED}✗ Ollama is not installed!${RESET}"
        echo -e "${YELLOW}Please install Ollama using Homebrew (brew install ollama) or download from https://ollama.com${RESET}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Ollama CLI is accessible${RESET}"
fi

# 3. Ensure Ollama Server is running
echo -e "${CYAN}Checking Ollama service...${RESET}"
if ! curl -s http://localhost:11434/ > /dev/null; then
    echo -e "${YELLOW}⚠ Ollama service is not running. Starting it now...${RESET}"
    # Start Ollama server in the background
    ollama serve > /dev/null 2>&1 &
    sleep 3
    if ! curl -s http://localhost:11434/ > /dev/null; then
        echo -e "${RED}✗ Failed to start Ollama automatically. Please open the Ollama application manually.${RESET}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Ollama service is active${RESET}"

# 4. Pull and Tag the model
echo -e "${CYAN}Verifying model installation...${RESET}"
if ! ollama list | grep -q "llama3.1:8b-instruct"; then
    echo -e "${YELLOW}⚠ Model 'llama3.1:8b-instruct' not found. Setting it up...${RESET}"
    echo -e "${CYAN}1. Pulling lightweight qwen2.5:0.5b (approx. 397MB)...${RESET}"
    ollama pull qwen2.5:0.5b
    
    echo -e "${CYAN}2. Tagging model as llama3.1:8b-instruct...${RESET}"
    ollama cp qwen2.5:0.5b llama3.1:8b-instruct
    echo -e "${GREEN}✓ Model setup complete!${RESET}"
else
    echo -e "${GREEN}✓ Model 'llama3.1:8b-instruct' is already set up${RESET}"
fi

# 5. Install Node Dependencies
echo -e "${CYAN}Installing frontend dependencies...${RESET}"
npm install

# 6. Start the development server
echo -e "${GREEN}===============================================${RESET}"
echo -e "${GREEN}  Starting TARS Dev Server...                  ${RESET}"
echo -e "${GREEN}  Once running, visit: http://localhost:5173/  ${RESET}"
echo -e "${GREEN}===============================================${RESET}"

npm run dev
