# 🤖 LangChain Agent with Intelligent Tool Calling

## Overview

The backend now uses **LangChain's ChatGoogleGenerativeAI** with intelligent tool calling. The LLM automatically decides when to use web search and formulates intelligent queries based on case context.

## How It Works

### The Old Way ❌
```python
# User: "Find cases like this"
# System: Searches "Find cases like this" literally
# Result: Irrelevant results
```

### The New Way ✅
```python
# User: "Find cases like this"
# LLM sees case context: "Contract Dispute - Tech Companies - California"
# LLM decides: "I need to search for similar cases"
# LLM formulates: "contract dispute tech companies California precedents"
# Result: Relevant legal precedents!
```

## Architecture

```
User Message
    ↓
LangChain ChatGoogleGenerativeAI
    ↓
Analyze: Do I need external info?
    ↓
    ├─ YES → Use web_search tool
    │         ├─ Formulate intelligent query from context
    │         ├─ Execute search
    │         └─ Generate response with sources
    │
    └─ NO  → Use case context directly
              └─ Generate response immediately
```

## Testing

### Run the test script:
```bash
cd backend
python test_langchain_agent.py
```

### Test Cases:
1. **Context-based question** (no search)
   - "What are pending action items?"
   - Expected: Uses case context

2. **Similar cases request** (intelligent search)
   - "Find cases like this"
   - Expected: Searches "contract dispute [case_type] precedents"

3. **Legal precedent** (targeted search)
   - "What are recent rulings on X?"
   - Expected: Searches with legal terms

## API Usage

### Chat Endpoint: `/api/chat/`

```json
POST /api/chat/
{
  "message": "Find me similar cases",
  "case_id": 1,
  "web_search": true,
  "session_id": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "Based on your contract dispute case, here are similar precedents...",
  "sources": [
    "https://law.com/oracle-google",
    "https://cases.com/apple-samsung"
  ],
  "session_id": "uuid"
}
```

## Key Features

### 1. **Intelligent Tool Decision**
The LLM decides when to use web search:
- ✅ "Find similar cases" → Uses search
- ✅ "Legal precedents on X" → Uses search  
- ❌ "What are action items?" → Uses context

### 2. **Context-Aware Queries**
The LLM formulates smart queries:
```python
Case: "Contract Dispute - Tech - California"
User: "Cases like this"
Query: "contract dispute tech companies California precedents"
```

### 3. **Chat History**
Maintains conversation context:
```python
User: "Tell me about my case"
AI: "Your case is Smith v. Johnson..."
User: "Find similar ones"  # LLM remembers the case
AI: *searches for contract disputes*
```

### 4. **Source Tracking**
Automatically extracts and returns URLs from web search results.

## Configuration

### Environment Variables (.env)
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### Service Configuration (config.py)
```python
class Settings(BaseSettings):
    GEMINI_API_KEY: str
    # ... other settings
```

## Code Structure

### Main Service: `services/langchain_gemini_service.py`
```python
class LangChainGeminiService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(...)
    
    async def chat_with_tools(
        self,
        message: str,
        case_context: str,
        session_id: str,
        web_search_enabled: bool
    ):
        # Bind tools if enabled
        if web_search_enabled:
            llm_with_tools = self.llm.bind_tools([web_search])
        
        # First invocation
        ai_msg = await llm_with_tools.ainvoke(messages)
        
        # Check for tool calls
        if ai_msg.tool_calls:
            # Execute tool
            result = web_search.invoke(ai_msg.tool_calls[0]["args"])
            
            # Send result back to LLM
            tool_message = ToolMessage(...)
            final_response = await llm_with_tools.ainvoke([...])
        
        return {"response": final_response, "sources": sources}
```

### Web Search Tool: `@tool decorator`
```python
@tool
def web_search(query: str) -> str:
    """
    Search the web for legal information...
    """
    search_tool = DuckDuckGoSearchResults(...)
    results = search_tool.invoke(query)
    return formatted_results
```

## Examples

### Example 1: Context-Only Question
```python
# Request
{
  "message": "What are the pending action items?",
  "case_id": 1,
  "web_search": false  # Not needed
}

# LLM thinks: "This is about case data, I have it in context"
# LLM does: Reads case context, lists action items
# Tool calls: NONE

# Response
{
  "response": "Here are the pending action items:\n1. File response...",
  "sources": null
}
```

### Example 2: Similar Cases Request
```python
# Request
{
  "message": "Find me cases similar to this one",
  "case_id": 1,
  "web_search": true
}

# LLM thinks: "User wants similar cases. Let me analyze the case context..."
# Case context: "Contract Dispute - Tech Companies - California"
# LLM formulates: "contract dispute tech companies California precedents"
# Tool call: web_search("contract dispute tech companies California precedents")

# Response
{
  "response": "Based on your contract dispute case, here are relevant precedents:\n\n1. Oracle v. Google...",
  "sources": [
    "https://law.com/oracle-google-contract-dispute",
    "https://cases.com/apple-samsung-agreement"
  ]
}
```

### Example 3: Legal Research
```python
# Request
{
  "message": "What are recent California rulings on statute of limitations?",
  "case_id": 1,
  "web_search": true
}

# LLM thinks: "User needs current legal information"
# Tool call: web_search("California statute of limitations recent rulings 2024")

# Response
{
  "response": "Recent California rulings on statute of limitations include:\n\n1. Smith v. State (2024)...",
  "sources": [
    "https://courts.ca.gov/smith-v-state",
    "https://law.com/california-statute-2024"
  ]
}
```

## Debugging

### Enable Verbose Logging
The service logs all tool calls:
```
[LangChain] Processing: Find cases like this
[LangChain] Tools enabled: ['web_search']
[LangChain] Tool calls detected: [{'name': 'web_search', 'args': {'query': 'contract dispute precedents'}}]
[LangChain] Executing tool: web_search with args: {'query': 'contract dispute precedents'}
[LangChain] Response generated. Sources: 5
```

### Check Tool Calls
```python
# In langchain_gemini_service.py
if ai_msg.tool_calls:
    print(f"Tool calls: {ai_msg.tool_calls}", flush=True)
```

## Benefits

1. **Smarter**: LLM decides when to search
2. **Context-Aware**: Understands "this case" from context
3. **Better Queries**: Formulates targeted searches
4. **Efficient**: Only searches when needed
5. **Standard**: Uses LangChain's tool calling pattern

## Migration Notes

### Old Service (gemini_service.py)
- Direct Google GenAI calls
- Manual search triggering
- No context awareness

### New Service (langchain_gemini_service.py)
- LangChain ChatGoogleGenerativeAI
- Intelligent tool calling
- Full context awareness

### Backward Compatibility
The `analyze_transcript()` method is maintained for meeting analysis.

## Dependencies

Already included in requirements.txt:
```
langchain==0.1.12
langchain-core==0.1.23
langchain-google-genai==0.0.6
langchain-community==0.0.20
duckduckgo-search==4.1.0
```

## Next Steps

1. Test the implementation with real queries
2. Monitor tool call patterns
3. Adjust system prompts if needed
4. Add more specialized tools (case law databases, etc.)

---

**Status: ✅ READY FOR USE**

The intelligent agent is now active and will smartly decide when to use web search!
