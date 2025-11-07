# Lexicase Demo Guide

## 🎬 Getting Started

This guide will help you demo Lexicase's powerful features.

## 📋 Prerequisites

Before starting, make sure you have:
1. ✅ Backend running on `http://localhost:8000`
2. ✅ Frontend running on `http://localhost:5173`
3. ✅ Gemini API key configured in backend/.env
4. ✅ (Optional) Pinecone API key for enhanced search

## 🎯 Demo Walkthrough

### 1. Dashboard Overview (1 min)

1. Open `http://localhost:5173` in your browser
2. You'll see the **Dashboard** with key metrics:
   - Total Cases
   - Active Cases
   - Total Meetings
   - Pending Actions
   - Critical Insights

**Talking Points:**
- "Clean, professional interface inspired by Harvey AI"
- "Real-time statistics at a glance"
- "Light theme optimized for legal professionals"

### 2. Create a Case (2 min)

1. Click **"Cases"** in the sidebar
2. Click **"New Case"** button
3. Fill in:
   - **Case Number:** `CV-2024-001`
   - **Title:** `State v. Johnson - Injunction Violation`
   - **Description:** `Preliminary hearing regarding alleged violations of court-issued preliminary injunction`
4. Click **"Create Case"**

**Talking Points:**
- "Simple case creation process"
- "Each case gets a unique identifier"
- "Organized case management"

### 3. Upload Meeting Recording (3 min)

1. Click on the newly created case to view details
2. Click **"Upload Meeting"** button
3. Fill in:
   - **Meeting Title:** `Preliminary Hearing - Nov 5, 2025`
   - **File:** Upload the sample transcript from `backend/uploads/sample_transcript.txt`
4. Click **"Upload & Process"**

**Wait for processing (10-30 seconds)**

**Talking Points:**
- "Supports both MP3 audio and TXT transcripts"
- "AI automatically analyzes the content"
- "Extracts insights in real-time"

### 4. View AI-Generated Insights (2 min)

After processing, you'll see:

**Summary Tab:**
- Concise summary of the hearing
- Key points highlighted

**Insights Tab:**
- Critical Points (e.g., signature verification issue)
- Decisions (e.g., handwriting analysis ordered)
- Deadlines (e.g., Nov 20, Dec 15, Dec 18, Dec 20)
- Risk Areas (e.g., improper service could compromise case)

**Action Items Tab:**
- Submit handwriting samples (Due: Nov 20)
- Complete forensic analysis (Due: Dec 15)
- File responses (Due: Dec 18)
- Status conference (Date: Dec 20)

**Talking Points:**
- "AI automatically identifies critical legal points"
- "Deadlines are extracted and tracked"
- "Risk areas highlighted for attorney attention"
- "Action items assigned and prioritized"

### 5. Chat with AI Assistant (3 min)

1. Click **"AI Assistant"** in the sidebar
2. Select the case from the dropdown
3. Try these questions:

**Question 1:**
```
What are the critical issues in this case?
```

**Expected Response:**
The AI will discuss the signature verification issue, proper service concerns, and the pending handwriting analysis.

**Question 2:**
```
What are the upcoming deadlines?
```

**Expected Response:**
List of deadlines with dates (Nov 20, Dec 15, Dec 18, Dec 20).

**Question 3:**
```
What is the risk if the signature analysis shows improper service?
```

**Expected Response:**
Discussion about how improper service could invalidate the injunction and compromise the State's case.

**Question 4:** (Tests citation search)
```
What are the legal precedents for improper service of injunctions?
```

**Expected Response:**
The AI will search for relevant legal information and provide citations.

**Talking Points:**
- "Context-aware AI understands the case"
- "Natural language queries"
- "Searches for legal citations automatically"
- "Maintains conversation history"

### 6. Dashboard Insights (1 min)

1. Return to **Dashboard**
2. Navigate through tabs:
   - **Recent Cases:** Shows your new case
   - **Critical Insights:** Displays high-priority items
   - **Upcoming Deadlines:** Lists action items with dates

**Talking Points:**
- "Everything in one central dashboard"
- "Easy access to critical information"
- "Visual organization of priorities"

## 🎨 Design Highlights

### Visual Elements to Showcase:
- ✨ **Modern UI:** Clean, professional design
- 🎨 **Color Coding:** 
  - Red/Orange for critical/high priority
  - Yellow for medium priority
  - Blue/Green for low priority/completed
- 📊 **Status Badges:** Visual status indicators
- 🔍 **Search & Filter:** Easy navigation
- 📱 **Responsive:** Works on all devices

## 💡 Key Differentiators

1. **AI-Powered Analysis**
   - Automatic insight extraction
   - Legal context understanding
   - Citation search integration

2. **Comprehensive Tracking**
   - Cases, meetings, insights, actions all in one place
   - Deadline management
   - Risk identification

3. **Intelligent Chatbot**
   - Context-aware responses
   - Semantic search with Pinecone
   - External legal research via DuckDuckGo

4. **Professional Design**
   - Harvey AI-inspired interface
   - Optimized for legal professionals
   - Clean, distraction-free environment

## 🚀 Advanced Features

### Vector Search (If Pinecone is configured)
The chatbot uses semantic search to find relevant information across all meetings and cases, not just keyword matching.

### Session Persistence
Chat conversations are saved and can be referenced later.

### Audit Trail
All activities are logged for compliance and review.

## 🎬 Quick Demo Script (5 minutes)

1. **"Welcome to Lexicase"** (30s)
   - Show dashboard overview
   - Explain the purpose

2. **"Create and Track Cases"** (1min)
   - Create a case
   - Show organization

3. **"AI-Powered Analysis"** (2min)
   - Upload meeting
   - Show auto-generated insights
   - Highlight action items

4. **"Intelligent Assistant"** (1.5min)
   - Ask 2-3 questions
   - Show context awareness

5. **"Everything in One Place"** (30s)
   - Return to dashboard
   - Show unified view

## 📝 Sample Questions for Q&A

**Q: Does it work with real audio?**
A: Currently uses transcripts, but can be integrated with Google Speech-to-Text or Whisper API for real audio transcription.

**Q: How accurate is the AI?**
A: Uses Google Gemini, one of the most advanced LLMs. Always recommend human review for legal matters.

**Q: Can it handle multiple cases?**
A: Yes! Designed for unlimited cases and meetings.

**Q: Is it secure?**
A: Built with security in mind - ready for encryption, access control, and compliance features.

**Q: What about citations?**
A: Integrates DuckDuckGo search for legal research and citations.

## 🎉 Closing Points

- **Time Saving:** Automates meeting analysis and note-taking
- **Accuracy:** AI extracts key points humans might miss
- **Organized:** Everything tracked in one place
- **Accessible:** Chat interface for instant answers
- **Scalable:** Handles growing caseload efficiently

---

**Good luck with your demo! 🚀**

*Team Nirvana*
