# Lexicase Backend Setup Guide

## Quick Start

### 1. Install Python Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=gcp-starter
PINECONE_INDEX_NAME=lexicase-legal
SECRET_KEY=your_secret_key_change_in_production
```

### 3. Get API Keys

#### Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and paste it in your `.env` file

#### Pinecone API Key (Optional)
1. Sign up at https://www.pinecone.io/
2. Create a new project
3. Get your API key and environment
4. Copy to `.env` file

**Note:** If you don't want to use Pinecone, the chatbot will still work but without semantic search capabilities.

### 4. Run the Backend

```bash
python main.py
```

The API will be available at `http://localhost:8000`

### 5. Test the API

Visit `http://localhost:8000/docs` to see the interactive API documentation.

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Troubleshooting

### ImportError: No module named 'X'
Make sure you activated the virtual environment and installed all dependencies:
```bash
pip install -r requirements.txt
```

### Database Error
Delete the `lexicase.db` file and restart the server. It will create a fresh database.

### API Key Error
Make sure your `.env` file is in the backend directory and contains valid API keys.

## File Upload

The application supports:
- **MP3 files** (currently placeholder transcription)
- **TXT files** (direct transcription)

Maximum file size: 100MB

For production MP3 transcription, integrate with:
- Google Speech-to-Text API
- Assembly AI
- Whisper API
