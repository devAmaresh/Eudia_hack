from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import tool
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, SystemMessage
from langchain_community.tools import DuckDuckGoSearchResults
from config import get_settings
from typing import Dict, List, Any, Optional
import json

settings = get_settings()


# Define web search tool
@tool
def web_search(query: str) -> str:
    """
    Search the web for legal information, case law, precedents, or current legal topics.
    Use this when you need external legal references, case precedents, or information 
    not available in the provided case context.
    
    Args:
        query: A well-formulated search query. Include relevant legal terms, 
               case types, jurisdictions, or specific legal concepts.
    
    Returns:
        Formatted search results with titles, snippets, and URLs.
    """
    try:
        search_tool = DuckDuckGoSearchResults(output_format="list", max_results=5)
        results = search_tool.invoke(query)
        
        if not results:
            return "No search results found."
        
        # Format results
        formatted = "Web Search Results:\n\n"
        for idx, result in enumerate(results, 1):
            formatted += f"{idx}. {result.get('title', 'No title')}\n"
            formatted += f"   {result.get('snippet', 'No snippet')}\n"
            formatted += f"   Source: {result.get('link', 'No URL')}\n\n"
        
        return formatted
    except Exception as e:
        return f"Error performing web search: {str(e)}"


@tool
def get_case_context(question: str) -> str:
    """
    Access information about the current legal case being discussed.
    Use this to answer questions about case details, meetings, insights, 
    action items, and documents.
    
    Args:
        question: A specific question about the case (e.g., "what are pending action items?")
    
    Returns:
        Relevant case information
    """
    # This will be dynamically set per request
    return "Use case context provided in the conversation."


class LangChainGeminiService:
    def __init__(self):
        # Initialize LangChain's ChatGoogleGenerativeAI
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.7,
            convert_system_message_to_human=True
        )
        
        # Store chat histories per session
        self.chat_histories: Dict[str, List] = {}
    
    async def chat_with_tools(
        self,
        message: str,
        case_context: str = "",
        session_id: str = "default",
        web_search_enabled: bool = False
    ) -> Dict[str, Any]:
        """
        Chat with Gemini using LangChain tool calling
        
        Args:
            message: User's message
            case_context: Full context about the case (meetings, insights, action items, etc.)
            session_id: Chat session ID
            web_search_enabled: Whether to enable web search tool
        
        Returns:
            Dict with response and sources
        """
        try:
            # Prepare tools
            tools = []
            if web_search_enabled:
                tools.append(web_search)
            
            # Bind tools to LLM
            if tools:
                llm_with_tools = self.llm.bind_tools(tools)
            else:
                llm_with_tools = self.llm
            
            # Get or initialize chat history
            if session_id not in self.chat_histories:
                self.chat_histories[session_id] = []
            
            chat_history = self.chat_histories[session_id]
            
            # Build system message with case context
            system_prompt = """You are Lexicase AI, an expert legal assistant specialized in court proceedings and case management.

Your capabilities:
- Analyze legal cases and provide insights
- Answer questions about case details, meetings, and action items
- Search the web for legal precedents and case law when needed
- Provide professional legal assistance

Important Guidelines:
1. Use the case context provided below to answer questions about the current case
2. ONLY use web_search tool when:
   - User asks about legal precedents, case law, or citations
   - User asks "cases like this" or "similar cases" - formulate a search query based on case context
   - User needs current legal information not in the case context
   - User explicitly requests external information
3. When formulating web search queries:
   - Include case type, legal area, jurisdiction if relevant from context
   - Use proper legal terminology
   - Be specific (e.g., "contract dispute precedents California 2024" instead of just "cases")
4. Always cite sources when using web search results
5. Be concise but thorough"""
            
            if case_context:
                system_prompt += f"\n\nCurrent Case Context:\n{case_context}"
            else:
                system_prompt += "\n\nNo specific case selected. Provide general legal assistance."
            
            # Build messages
            messages = [SystemMessage(content=system_prompt)]
            messages.extend(chat_history)
            messages.append(HumanMessage(content=message))
            
            print(f"[LangChain] Processing: {message}", flush=True)
            print(f"[LangChain] Tools enabled: {[t.name for t in tools]}", flush=True)
            
            # First invocation - let LLM decide to use tools
            ai_msg = await llm_with_tools.ainvoke(messages)
            
            # Track sources
            sources = []
            
            # Check if LLM wants to use tools
            max_iterations = 3  # Prevent infinite loops
            iteration = 0
            
            while ai_msg.tool_calls and iteration < max_iterations:
                iteration += 1
                print(f"[LangChain] Tool calls detected: {ai_msg.tool_calls}", flush=True)
                
                # Execute each tool call
                for tool_call in ai_msg.tool_calls:
                    tool_name = tool_call["name"]
                    tool_args = tool_call["args"]
                    tool_id = tool_call["id"]
                    
                    print(f"[LangChain] Executing tool: {tool_name} with args: {tool_args}", flush=True)
                    
                    # Execute the tool
                    if tool_name == "web_search":
                        result = web_search.invoke(tool_args)
                        
                        # Extract URLs for sources
                        import re
                        urls = re.findall(r'Source: (https?://[^\s]+)', result)
                        sources.extend(urls)
                    else:
                        result = "Tool not found"
                    
                    # Create tool message
                    tool_message = ToolMessage(
                        content=result,
                        tool_call_id=tool_id
                    )
                    
                    # Add to messages
                    messages.append(ai_msg)
                    messages.append(tool_message)
                
                # Invoke again with tool results
                ai_msg = await llm_with_tools.ainvoke(messages)
            
            # Get final response - ensure it's a string
            response_content = ai_msg.content
            
            # Handle different content types
            if isinstance(response_content, list):
                # If content is a list, extract text from each part
                response_text = ""
                for part in response_content:
                    if isinstance(part, dict) and "text" in part:
                        response_text += part["text"]
                    elif isinstance(part, str):
                        response_text += part
                    else:
                        response_text += str(part)
            elif isinstance(response_content, str):
                response_text = response_content
            else:
                response_text = str(response_content)
            
            # Update chat history (keep only last 20 messages)
            chat_history.append(HumanMessage(content=message))
            chat_history.append(AIMessage(content=response_text))
            
            if len(chat_history) > 20:
                self.chat_histories[session_id] = chat_history[-20:]
            else:
                self.chat_histories[session_id] = chat_history
            
            print(f"[LangChain] Response generated. Sources: {len(sources)}", flush=True)
            
            return {
                "response": response_text,
                "sources": sources if sources else None
            }
            
        except Exception as e:
            print(f"[LangChain] Error: {e}", flush=True)
            import traceback
            traceback.print_exc()
            return {
                "response": f"I apologize, but I encountered an error: {str(e)}",
                "sources": None
            }
    
    def clear_chat_history(self, session_id: str = "default"):
        """Clear chat history for a session"""
        if session_id in self.chat_histories:
            del self.chat_histories[session_id]
    
    async def analyze_transcript(self, transcript: str) -> Dict[str, Any]:
        """Analyze transcript using LangChain (for backward compatibility)"""
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
            messages = [HumanMessage(content=prompt)]
            response = await self.llm.ainvoke(messages)
            text = response.content
            
            # Extract JSON from markdown code blocks if present
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            
            result = json.loads(text)
            return result
        except Exception as e:
            print(f"Error analyzing transcript: {e}", flush=True)
            return {
                "summary": "Error processing transcript",
                "minutes": transcript[:500] + "...",
                "critical_points": [],
                "decisions": [],
                "deadlines": [],
                "risk_areas": [],
                "action_items": []
            }


# Singleton instance
langchain_gemini_service = LangChainGeminiService()
