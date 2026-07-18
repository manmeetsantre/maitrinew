---
title: MindMatters Mental Health Assistant
emoji: 🧠
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
---

# MindMatters Mental Health Assistant

MindMatters is a comprehensive digital mental health platform designed for astronaut support, mental wellness coaching, and chat assistance.

## Hugging Face Spaces Deployment

This repository is configured to be deployed as a **Docker SDK Space** on Hugging Face.

### How to Deploy for Free:
1. Create a free account at [huggingface.co](https://huggingface.co).
2. Go to Spaces -> **New Space**.
3. Set your Space name, select **Docker** as the SDK, and choose the **Blank** template.
4. Set the space to **Public** (required for the free CPU tier).
5. Push this repository's contents to the Hugging Face Space git repository.
6. Make sure to rename `Dockerfile.hf` to `Dockerfile` on the Hugging Face repository, and `huggingface_README.md` to `README.md`.
7. Hugging Face will build the Docker container and start your full-stack system on their free 16GB RAM CPU tier!
