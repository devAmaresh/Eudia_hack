# Lexicase - AI-Powered Legal Assistant

**Team Nirvana** | Legal Domain (Eudia Bonus) + Productivity Agents

![Lexicase](https://img.shields.io/badge/Status-Active-green)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688)

## 🎯 Overview

Lexicase is an AI-powered legal assistant that helps legal teams streamline court hearings, extract actionable insights, and maintain comprehensive case records. Built with cutting-edge AI technology, it provides real-time transcription analysis, automated meeting minutes, and an intelligent chatbot for instant case insights.

## ✨ Key Features

### 1. **Intelligent Meeting Analysis**
- Upload court hearing recordings (MP3) or transcripts (TXT)
- AI-powered transcription analysis using Google Gemini
- Automatic extraction of critical points, decisions, and deadlines
- Risk area identification and severity classification

### 2. **Automated Insights & Action Items**
- Extract actionable tasks from meetings
- Priority classification (High, Medium, Low)
- Deadline tracking and assignment
- Critical insight highlighting

### 3. **Case-Centric Organization**
- Organize multiple meetings under cases
- Track case history and progression
- Visual dashboard with key metrics
- Status tracking (Active, Closed, Pending)

### 4. **AI Chatbot Assistant**
- Context-aware conversations using Gemini AI
- Semantic search with Pinecone vector database
- Legal citation search using DuckDuckGo
- Session-based conversation history

### 5. **Modern Dashboard**
- Clean, professional light theme
- Real-time statistics and KPIs
- Harvey-inspired legal interface
- Responsive design with Shadcn UI

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLite** - Lightweight database
- **SQLAlchemy** - ORM for database operations
- **Google Gemini API** - AI-powered analysis
- **LangChain** - LLM orchestration
- **Pinecone** - Vector database for semantic search
- **DuckDuckGo Search** - Legal citation retrieval

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation build tool
- **Shadcn UI** - Modern component library
- **TailwindCSS** - Utility-first CSS
- **React Query** - Data fetching and caching
- **React Router** - Navigation

## 📦 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API Key
- Pinecone API Key (optional but recommended)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
```

3. **Activate virtual environment:**
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Configure environment variables:**
- Copy `.env.example` to `.env`
- Add your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=lexicase-legal
SECRET_KEY=your_secret_key
```

6. **Run the backend:**
```bash
python main.py
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 🚀 Quick Start

1. **Create a Case:**
   - Click "New Case" on the Cases page
   - Fill in case number, title, and description

2. **Upload Meeting:**
   - Navigate to a case
   - Click "Upload Meeting"
   - Upload an MP3 audio file or TXT transcript
   - AI will automatically analyze and extract insights

3. **View Insights:**
   - Check the Insights tab for critical points
   - Review action items in the Actions tab
   - See deadline tracking on the dashboard

4. **Chat with AI:**
   - Go to AI Assistant page
   - Select a case (optional)
   - Ask questions about your cases
   - Get instant, context-aware responses

## 📁 Project Structure

```
Eudia/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── config.py               # Configuration management
│   ├── database.py             # Database connection
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── routers/                # API routes
│   │   ├── cases.py
│   │   ├── meetings.py
│   │   ├── chat.py
│   │   ├── dashboard.py
│   │   └── action_items.py
│   └── services/               # Business logic
│       ├── gemini_service.py   # Gemini AI integration
│       ├── pinecone_service.py # Vector database
│       └── search_service.py   # DuckDuckGo search
│
└── frontend/
    ├── src/
    │   ├── components/         # Reusable components
    │   │   ├── ui/            # Shadcn components
    │   │   └── Layout.tsx     # Main layout
    │   ├── pages/             # Page components
    │   │   ├── Dashboard.tsx
    │   │   ├── Cases.tsx
    │   │   ├── CaseDetail.tsx
    │   │   └── ChatAssistant.tsx
    │   ├── lib/               # Utilities
    │   │   ├── api.ts         # API client
    │   │   └── utils.ts       # Helper functions
    │   └── types/             # TypeScript types
    └── package.json
```

## 🎨 Features Showcase

### Dashboard
- **Live Statistics:** Total cases, active cases, meetings, pending actions, critical insights
- **Recent Cases:** Quick access to latest cases
- **Critical Insights:** High-priority items requiring attention
- **Upcoming Deadlines:** Action items with due dates

### Case Management
- **Create Cases:** Add new cases with unique case numbers
- **View Details:** Comprehensive case information
- **Meeting Uploads:** Support for MP3 and TXT files
- **Action Tracking:** Monitor tasks and deadlines

### AI Analysis
- **Automatic Transcription Analysis**
- **Meeting Minutes Generation**
- **Critical Point Extraction**
- **Decision Logging**
- **Deadline Identification**
- **Risk Assessment**

### Chatbot
- **Natural Language Interface**
- **Context-Aware Responses**
- **Legal Citation Search**
- **Conversation History**
- **Case-Specific Queries**

## 🔐 Security & Compliance

- End-to-end encryption ready
- Role-based access control structure
- GDPR-compliant data handling
- Secure API key management
- Audit logs for all operations

## 🛠️ API Endpoints

### Cases
- `GET /api/cases/` - List all cases
- `POST /api/cases/` - Create a case
- `GET /api/cases/{id}` - Get case details
- `PUT /api/cases/{id}` - Update case
- `DELETE /api/cases/{id}` - Delete case

### Meetings
- `POST /api/meetings/` - Upload meeting (with file)
- `GET /api/meetings/{id}` - Get meeting details
- `GET /api/meetings/{id}/insights` - Get insights

### Chat
- `POST /api/chat/` - Send chat message
- `GET /api/chat/history/{session_id}` - Get chat history

### Dashboard
- `GET /api/dashboard/` - Get dashboard data

## 🤝 Team Nirvana

Built with ❤️ by Team Nirvana for the Eudia Hackathon

## 📄 License

MIT License - feel free to use this project for your legal tech needs!

## 🙏 Acknowledgments

- Google Gemini for powerful AI capabilities
- Pinecone for vector search
- Shadcn for beautiful UI components
- FastAPI for excellent API framework

---

**Note:** This is currently a prototype. For production use, implement proper authentication, enhanced security measures, and scalable infrastructure.
