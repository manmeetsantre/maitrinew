FROM python:3.12-slim
WORKDIR /app

# Install ffmpeg and ffprobe required for audio conversion
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download and cache the Whisper 'small' model inside the image
RUN python -c "import whisper; whisper.load_model('small')"

COPY . .

EXPOSE 5000
CMD ["python", "voice_assistant.py"]
