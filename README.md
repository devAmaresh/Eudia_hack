# Lexicase - AI-Powered Legal Assistant

**Team Nirvana** | Legal Domain (Eudia Bonus) + Productivity Agents

![Lexicase](https://img.shields.io/badge/Status-Active-green)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688)

## 🎯 Overview

Lexicase is an AI-powered legal assistant that helps legal teams streamline court hearings, extract actionable insights, and maintain comprehensive case records. Built with cutting-edge AI technology, it provides real-time transcription analysis, automated meeting minutes, and an intelligent chatbot for instant case insights.

![Landing Page](./assets/landing.png)
*Professional landing page with modern design*

## ✨ Key Features

### 1. **🤖 Advanced LangChain Agent with Intelligent Tool Calling**
- **Smart Citation Search**: AI agent autonomously decides when to search for legal precedents and case law
- **Web Search Integration**: Real-time legal research using DuckDuckGo with intelligent query formulation
- **Context-Aware Reasoning**: Agent analyzes case context before formulating search queries
- **Multi-Tool Orchestration**: Combines web search + vector database + case context for comprehensive answers
- **Source Attribution**: Every response includes clickable sources and citations
- **Autonomous Decision Making**: Agent determines whether to use web search, semantic search, or both

### 2. **📅 Enterprise Calendar & Task Management (Jira-Like)**
- **4-Stage Task Workflow**: To Do → In Progress → Review → Done with drag-and-drop status changes
- **Priority Levels**: Critical, High, Medium, Low with color-coded badges and icons
- **Advanced Filtering**: Filter by status, priority, due date, "due today", assigned to
- **Calendar Integration**: Month view and list view with quick date actions
- **Event Auto-Creation**: Automatically create calendar events from meeting uploads
- **Task Linking**: Tasks automatically linked to calendar events and meetings
- **Status Tracking**: Real-time status updates with professional dropdown selectors
- **Deadline Management**: Visual deadline tracking with upcoming alerts
- **Cascade Deletion**: Delete events and all linked tasks automatically
- **Professional UI**: Clean, modern interface rivaling Jira and Asana

### 3. **Intelligent Meeting Analysis**
- Upload court hearing recordings (MP3) or transcripts (TXT)
- AI-powered transcription analysis using Google Gemini
- Automatic extraction of critical points, decisions, and deadlines
- Risk area identification and severity classification
- Meeting minutes generation with legal precision

### 4. **Automated Insights & Action Items**
- Extract actionable tasks from meetings automatically
- Priority classification (Critical, High, Medium, Low)
- Deadline tracking and assignment to team members
- Critical insight highlighting with severity levels
- Auto-convert insights to calendar tasks

### 5. **Case-Centric Organization**
- Organize multiple meetings under cases
- Track case history and progression timeline
- Visual dashboard with key metrics and statistics
- Status tracking (Active, Closed, Pending, Archived)
- Document management with semantic search

### 6. **AI Chatbot Assistant with Web Search**
- Context-aware conversations using LangChain + Gemini AI
- Semantic search with Pinecone vector database (1536-dimension embeddings)
- Legal citation search with intelligent web agent
- Session-based conversation history with context retention
- Case-specific queries with automatic context loading
- Web search toggle for real-time legal research

### 7. **Modern Dashboard**
- Clean, professional dark theme with glassmorphism
- Real-time statistics and KPIs (cases, meetings, insights, actions)
- Harvey-inspired legal interface design
- Responsive design with Shadcn UI components
- Quick access to critical insights and upcoming deadlines

## 🏗️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework with 40+ REST API endpoints
- **SQLite** - Lightweight database with 10+ tables and relationships
- **SQLAlchemy** - ORM for database operations with cascade deletion
- **Google Gemini API** - AI-powered analysis (gemini-2.5-flash)
- **LangChain** - Advanced LLM orchestration with intelligent tool calling
- **Pinecone** - Serverless vector database for semantic search (1536-dimension embeddings)
- **DuckDuckGo Search** - Real-time legal citation and web search retrieval
- **Mailtrap** - Professional email service integration

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

## 🚀 Quick Start - End-to-End Automation Flow

### 1. **Create a Case:**
   - Click "New Case" on the Cases page
   - Fill in case number, title, description, and parties involved
   - Set case status (Active, Pending, Closed)

### 2. **Upload Meeting & Get AI Analysis:**
   - Navigate to a case
   - Click "Upload Meeting"
   - Upload an MP3 audio file or TXT transcript
   - **AI automatically:**
     - Analyzes transcript using Gemini AI
     - Extracts meeting minutes
     - Identifies critical points, decisions, and risks
     - Creates action items with priorities
     - Generates calendar events
     - Embeds content in Pinecone vector database

### 3. **Manage Tasks (Jira-Like Workflow):**
   - Go to Calendar & Tasks page
   - View tasks in **4-stage workflow**: To Do → In Progress → Review → Done
   - Filter by priority (Critical, High, Medium, Low)
   - Click date for quick event/task creation
   - Drag-and-drop to change status
   - Track deadlines with "due today" filter
   - All tasks auto-linked to calendar events

### 4. **AI Agent with Citation Search:**
   - Go to AI Assistant page (standalone or in-case sidebar)
   - **Enable Web Search** toggle for citation research
   - Select a case for context-aware responses
   - Ask questions like:
     - "Find similar cases about force majeure"
     - "What precedents exist for contract disputes?"
     - "Search for recent judgments on property delays"
   - **Agent autonomously:**
     - Analyzes your case context
     - Formulates intelligent legal search queries
     - Searches web for citations and precedents
     - Combines results with vector database
     - Provides sourced answers with clickable URLs

### 5. **Share via Email:**
   - From any meeting, click "Share via Email"
   - Professional email sent with:
     - Meeting summary
     - AI insights
     - Action items
     - Link to full transcript
   - Track sent emails in Email History

### 6. **Monitor Dashboard:**
   - View real-time statistics (cases, meetings, insights, tasks)
   - Check critical insights requiring attention
   - Review upcoming deadlines
   - Access recent cases quickly

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
![Dashboard](./assets/case-dash.png)
*Comprehensive dashboard with live statistics and case overview*

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


![AI Actions](./assets/action-items.png)
### LangChain AI Agent with Web Search
![AI Assistant](./assets/ai-assistant.png)
*Intelligent LangChain agent with autonomous tool calling, web search, and citation retrieval*

- **Autonomous Tool Calling**: AI agent intelligently decides when to use web search vs. semantic search
- **Legal Citation Search**: Real-time search for case law, precedents, and legal citations using DuckDuckGo
- **Intelligent Query Formulation**: Agent analyzes case context and formulates precise legal search queries
- **Hybrid Search Strategy**: Combines web search + Pinecone vector database + case context for comprehensive answers
- **Source Attribution**: Every answer includes clickable sources with URLs (Hindustan Times, 99Realty, Moneycontrol, etc.)
- **Web Search Toggle**: Enable/disable web search with visual toggle button
- **Context-Aware Reasoning**: Agent understands case details (parties, legal issues, jurisdiction) before searching
- **Session Management**: Multiple chat sessions with persistent history per case
- **Natural Language Interface**: Ask questions like "find similar cases" or "what precedents exist for force majeure?"
- **Multi-Turn Conversations**: Maintains context across conversation turns
- **Case-Specific Queries**: Automatically loads case context for targeted answers
- **Professional UI**: Clean chat interface with user/bot message distinction and source cards

### Calendar & Task Management (Jira-Like Features)
![Calendar](./assets/calendar.png)
*Enterprise-grade calendar with Jira-like task tracking and workflow management*

- **Professional Task Workflow**: 4-stage pipeline (To Do → In Progress → Review → Done)
- **Priority Management**: Critical, High, Medium, Low with color-coded visual indicators
- **Advanced Filtering**: Filter by status, priority, due date, and "due today" smart filters
- **Month & List Views**: Switch between calendar month view and detailed list view
- **Quick Date Actions**: Click any date for instant event/task creation popover
- **Event Auto-Creation**: Meetings automatically generate calendar events with linked tasks
- **Drag-and-Drop Status**: Professional dropdown selectors for status changes
- **Task Linking**: Tasks automatically linked to calendar events for full traceability
- **Cascade Operations**: Delete events and all linked tasks are removed automatically
- **Real-Time Updates**: Instant UI updates with smooth animations
- **Deadline Tracking**: Visual deadline indicators and upcoming alerts
- **Team Collaboration**: Assign tasks, track progress, and manage deadlines
- **End-to-End Automation**: From meeting upload → insights extraction → task creation → calendar event → completion tracking

### Email Integration
![Email Sharing](./assets/mail.png)
*Professional email sharing with meeting summaries and insights*

- **One-Click Meeting Sharing**
- **Formatted Email Templates**
- **Email History Tracking**
- **Client Communication**

## 🔐 Security & Compliance

- End-to-end encryption ready
- Role-based access control structure
- GDPR-compliant data handling
- Secure API key management
- Audit logs for all operations

## 🛠️ API Endpoints (40+ REST APIs)

### Cases
- `GET /api/cases/` - List all cases with filters
- `POST /api/cases/` - Create a case
- `GET /api/cases/{id}` - Get case details with full context
- `PUT /api/cases/{id}` - Update case
- `DELETE /api/cases/{id}` - Delete case

### Meetings
- `POST /api/meetings/` - Upload meeting (MP3/TXT with AI analysis)
- `GET /api/meetings/{id}` - Get meeting details
- `GET /api/meetings/{id}/insights` - Get AI-extracted insights
- `GET /api/meetings/{id}/transcript` - Get raw transcript

### Chat (LangChain Agent)
- `POST /api/chat/` - Send chat message (with web_search_enabled flag)
- `GET /api/chat/history/{session_id}` - Get chat history
- `DELETE /api/chat/history/{session_id}` - Clear session history
- `GET /api/chat/sessions` - List all chat sessions

### Calendar & Tasks (Jira-Like)
- `GET /api/calendar/events` - List events (with filters: date range, case_id, type)
- `POST /api/calendar/events` - Create calendar event
- `PUT /api/calendar/events/{id}` - Update event
- `DELETE /api/calendar/events/{id}` - Delete event (cascade deletes linked tasks)
- `GET /api/calendar/upcoming` - Get upcoming events (next N days)
- `GET /api/calendar/tasks` - List tasks (filters: status, priority, case, event, assigned_to)
- `POST /api/calendar/tasks` - Create task
- `PUT /api/calendar/tasks/{id}` - Update task (status, priority, completion)
- `DELETE /api/calendar/tasks/{id}` - Delete task
- `GET /api/calendar/events/{id}/tasks` - Get all tasks for an event
- `POST /api/calendar/tasks/{id}/comment` - Add comment to task

### Action Items
- `GET /api/action-items/` - List action items
- `POST /api/action-items/` - Create action item
- `PUT /api/action-items/{id}` - Update action item
- `DELETE /api/action-items/{id}` - Delete action item

### Documents
- `POST /api/documents/` - Upload case document (with Pinecone embedding)
- `GET /api/documents/{id}` - Get document
- `DELETE /api/documents/{id}` - Delete document

### Email
- `POST /api/email/send-meeting-summary` - Send meeting summary via email
- `GET /api/email/history` - Get email history

### Dashboard
- `GET /api/dashboard/` - Get dashboard statistics and insights

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
