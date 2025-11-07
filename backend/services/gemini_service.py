import google.generativeai as genai
from config import get_settings
import json
from typing import Dict, List, Any

settings = get_settings()
genai.configure(api_key=settings.GEMINI_API_KEY)


class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        # Store chat sessions
        self.chat_sessions = {}

    async def analyze_transcript(self, transcript: str) -> Dict[str, Any]:
        """Analyze transcript and extract legal insights"""
        
        prompt = f"""
        You are an expert legal assistant analyzing a court hearing transcript. 
        Analyze the following transcript and extract:
        
        1. Summary: A concise summary of the hearing
        2. Meeting Minutes: Detailed, legally relevant meeting minutes
        3. Critical Points: Important motions, decisions, and legal arguments
        4. Decisions: All judicial decisions made
        5. Deadlines: Any mentioned dates or deadlines
        6. Risk Areas: Potential legal risks or concerns
        7. Action Items: Tasks, responsibilities, and follow-ups needed
        
        Transcript:
        {transcript}
        
        Return your analysis as a JSON object with the following structure:
        {{
            "summary": "...",
            "minutes": "...",
            "critical_points": [
                {{"type": "critical_point", "title": "...", "description": "...", "severity": "high/medium/low", "timestamp": "..."}}
            ],
            "decisions": [
                {{"type": "decision", "title": "...", "description": "...", "severity": "medium"}}
            ],
            "deadlines": [
                {{"type": "deadline", "title": "...", "description": "...", "severity": "high", "timestamp": "..."}}
            ],
            "risk_areas": [
                {{"type": "risk_area", "title": "...", "description": "...", "severity": "high/medium/low"}}
            ],
            "action_items": [
                {{"title": "...", "description": "...", "assigned_to": "...", "priority": "high/medium/low", "due_date": "..."}}
            ]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text
            
            # Extract JSON from markdown code blocks if present
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            result = json.loads(text)
            return result
        except Exception as e:
            print(f"Error analyzing transcript: {e}")
            return {
                "summary": "Error processing transcript",
                "minutes": transcript[:500] + "...",
                "critical_points": [],
                "decisions": [],
                "deadlines": [],
                "risk_areas": [],
                "action_items": []
            }

    async def generate_summary(self, transcript: str) -> str:
        """Generate a concise summary of the transcript"""
        
        prompt = f"""
        As a legal assistant, provide a concise but comprehensive summary of this court hearing transcript.
        Focus on key arguments, decisions, and outcomes.
        
        Transcript:
        {transcript}
        
        Summary:
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating summary: {str(e)}"

    async def chat_with_context(self, message: str, context: str = "", history: List[Dict] = None, session_id: str = "default") -> str:
        """Chat with legal context using Gemini's chat feature"""
        
        # Build conversation context
        conversation_context = f"""You are Lexicase AI, an expert legal assistant specialized in court proceedings and case management.
        
Case Context:
{context}

Instructions:
- Provide accurate, professional legal assistance
- Use proper legal terminology
- If citing precedents, mention that additional research may be needed for specific case citations
- Be concise but thorough
"""
        
        # Get or create chat session
        if session_id not in self.chat_sessions:
            self.chat_sessions[session_id] = self.model.start_chat(history=[])
            # Send initial context
            try:
                self.chat_sessions[session_id].send_message(conversation_context)
            except:
                pass  # Context setting might fail, continue anyway
        
        chat = self.chat_sessions[session_id]
        
        try:
            response = chat.send_message(message)
            return response.text
        except Exception as e:
            print(f"Error in chat: {e}")
            return f"I apologize, but I encountered an error: {str(e)}"
    
    def clear_chat_session(self, session_id: str = "default"):
        """Clear a specific chat session"""
        if session_id in self.chat_sessions:
            del self.chat_sessions[session_id]


# Singleton instance
gemini_service = GeminiService()
