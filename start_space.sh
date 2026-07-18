#!/bin/bash

# Start Ollama service in the background
echo "Starting Ollama..."
ollama serve &

# Wait for Ollama to spin up
sleep 5

# Download and copy models in the background
echo "Downloading Llama model..."
ollama pull qwen2.5:0.5b
ollama cp qwen2.5:0.5b llama3.1:8b-instruct

# Start Mood Tracker in the background
echo "Starting Mood Tracker..."
cd /app/moodtracker
python main.py &

# Start Voice Analysis in the background
echo "Starting Voice Analysis..."
cd /app/Voice
python voice_assistant.py &

# Start Main Fullstack Web App on port 7860 (Hugging Face App Port)
echo "Starting Main App..."
cd /app
export PORT=7860
ts-node server/src/index.ts
