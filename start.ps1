# MindMatters - Unified Startup Script for Windows
# This script starts all services required for the MindMatters platform

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   MindMatters Platform Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "[1/6] Checking Node.js..." -ForegroundColor Yellow
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCheck) {
    $nodeVersion = node --version 2>&1
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Node.js not found. Please install Node.js v18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
Write-Host "[2/6] Checking Python..." -ForegroundColor Yellow
$pythonCheck = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCheck) {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "Python not found. Please install Python 3.8+ from https://www.python.org/" -ForegroundColor Red
    exit 1
}

# Check if ffmpeg is installed
Write-Host "[3/6] Checking ffmpeg..." -ForegroundColor Yellow
$ffmpegCheck = Get-Command ffmpeg -ErrorAction SilentlyContinue
if ($ffmpegCheck) {
    Write-Host "ffmpeg found" -ForegroundColor Green
} else {
    Write-Host "ffmpeg not found. Installing via winget..." -ForegroundColor Yellow
    $wingetCheck = Get-Command winget -ErrorAction SilentlyContinue
    if ($wingetCheck) {
        winget install Gyan.FFmpeg --silent --accept-package-agreements --accept-source-agreements 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "ffmpeg installed. Please restart your terminal and run this script again." -ForegroundColor Green
            exit 0
        } else {
            Write-Host "Failed to install ffmpeg. Please install manually from https://ffmpeg.org/" -ForegroundColor Red
            Write-Host "  Voice analysis features may not work without ffmpeg." -ForegroundColor Yellow
        }
    } else {
        Write-Host "winget not found. Please install ffmpeg manually from https://ffmpeg.org/" -ForegroundColor Red
        Write-Host "  Voice analysis features may not work without ffmpeg." -ForegroundColor Yellow
    }
}

# Check if Ollama is running (for TARS)
Write-Host "[4/6] Checking Ollama..." -ForegroundColor Yellow
$ollamaCheck = Get-Command ollama -ErrorAction SilentlyContinue
if ($ollamaCheck) {
    $ollamaList = ollama list 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Ollama is running" -ForegroundColor Green
        $modelCheck = ollama list | Select-String "llama3.1:8b"
        if (-not $modelCheck) {
            Write-Host "llama3.1:8b model not found. Pulling..." -ForegroundColor Yellow
            ollama pull llama3.1:8b 2>&1 | Out-Null
        }
    } else {
        Write-Host "Ollama not running. TARS will work in offline mode only." -ForegroundColor Yellow
        Write-Host "  Install from https://ollama.ai/download and run: ollama pull llama3.1:8b" -ForegroundColor Yellow
    }
} else {
    Write-Host "Ollama not found. TARS will work in offline mode only." -ForegroundColor Yellow
    Write-Host "  Install from https://ollama.ai/download" -ForegroundColor Yellow
}

# Install Node.js dependencies
Write-Host "[5/6] Installing Node.js dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing main dependencies..." -ForegroundColor Gray
    npm install 2>&1 | Out-Null
} else {
    Write-Host "Main dependencies already installed" -ForegroundColor Green
}

if (-not (Test-Path "TARS\node_modules")) {
    Write-Host "  Installing TARS dependencies..." -ForegroundColor Gray
    Push-Location TARS
    npm install 2>&1 | Out-Null
    Pop-Location
} else {
    Write-Host "TARS dependencies already installed" -ForegroundColor Green
}

# Install Python dependencies
Write-Host "[6/6] Installing Python dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "moodtracker\__pycache__")) {
    Write-Host "  Installing moodtracker dependencies..." -ForegroundColor Gray
    pip install -r moodtracker\requirements.txt 2>&1 | Out-Null
} else {
    Write-Host "MoodTracker dependencies already installed" -ForegroundColor Green
}

if (-not (Test-Path "Voice\__pycache__")) {
    Write-Host "  Installing Voice dependencies..." -ForegroundColor Gray
    pip install -r Voice\requirements.txt 2>&1 | Out-Null
} else {
    Write-Host "Voice dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting All Services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services will start on:" -ForegroundColor Yellow
Write-Host "  Main Frontend:    http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Backend API:       http://localhost:4000" -ForegroundColor Cyan
Write-Host "  TARS (AI Chat):    http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Mood Tracker:     http://localhost:5002" -ForegroundColor Cyan
Write-Host "  Voice Analysis:   http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Kill any existing processes on these ports
Write-Host "Cleaning up existing processes..." -ForegroundColor Gray
$ports = @(8080, 4000, 5173, 5002, 5000)
foreach ($port in $ports) {
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $processes) {
        if ($procId) {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    }
}
Start-Sleep -Seconds 2

# Start all services
Write-Host "Starting services..." -ForegroundColor Green

# Start MindMatters Frontend + Backend
$mainPath = $PWD.Path
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mainPath'; npm run dev:full"

# Start TARS
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mainPath\TARS'; npm run dev"

# Start MoodTracker
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mainPath\moodtracker'; python main.py"

# Start Voice Assistant
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mainPath\Voice'; python voice_assistant.py"

Write-Host ""
Write-Host "All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Waiting 10 seconds for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Services Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check service status
$services = @(
    @{Name="Main Frontend"; Port=8080; URL="http://localhost:8080"},
    @{Name="Backend API"; Port=4000; URL="http://localhost:4000"},
    @{Name="TARS"; Port=5173; URL="http://localhost:5173"},
    @{Name="Mood Tracker"; Port=5002; URL="http://localhost:5002"},
    @{Name="Voice Analysis"; Port=5000; URL="http://localhost:5000"}
)

foreach ($service in $services) {
    $connection = Test-NetConnection -ComputerName localhost -Port $service.Port -WarningAction SilentlyContinue -InformationLevel Quiet -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "$($service.Name) is running on $($service.URL)" -ForegroundColor Green
    } else {
        Write-Host "$($service.Name) is not responding" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Ready! Open http://localhost:8080" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
