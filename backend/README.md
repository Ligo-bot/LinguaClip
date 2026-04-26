# LinguaClip Backend

YouTube video parsing and subtitle extraction API.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env and add your OPENAI_API_KEY

# Run the server
uvicorn main:app --reload --port 8000
```

## Docker

```bash
# Build image
docker build -t linguaclip-backend .

# Run container
docker run -p 8000:8000 --env-file .env linguaclip-backend
```
