#!/bin/bash

# MindMatters - Stop All Services Script for Linux/macOS

echo "Stopping all MindMatters services..."

if [ -f "logs/pids.txt" ]; then
    while read pid; do
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            echo "Stopped process $pid"
        fi
    done < logs/pids.txt
    rm logs/pids.txt
fi

# Also kill by port
for port in 8080 4000 5173 5002 5000; do
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
done

echo "All services stopped."

