"""
Test script for LangChain Gemini Service with Tool Calling
"""
import asyncio
from services.langchain_gemini_service import langchain_gemini_service

async def test_tool_calling():
    print("=" * 80)
    print("Testing LangChain Gemini Service with Tool Calling")
    print("=" * 80)
    
    # Test 1: Question about case context (should NOT use web search)
    print("\n📋 Test 1: Question about case context")
    print("-" * 80)
    
    case_context = """
Case Number: CV-2024-001
Case Title: Smith v. Johnson - Contract Dispute
Status: active
Client Side: Plaintiff

Recent Meetings:
- Initial Hearing (2024-01-15)
  Summary: Plaintiff filed motion for summary judgment for breach of written contract

Critical Insights:
- Statute of limitations concern (high severity)
- Missing key witness testimony (high severity)

Pending Action Items:
- File response to motion (Priority: high, Due: 2024-02-01)
- Depose witness John Doe (Priority: medium, Due: 2024-02-15)
"""
    
    result = await langchain_gemini_service.chat_with_tools(
        message="What are the pending action items in this case?",
        case_context=case_context,
        session_id="test1",
        web_search_enabled=False
    )
    
    print(f"\nUser: What are the pending action items in this case?")
    print(f"\nAI Response: {result['response']}")
    print(f"\nSources: {result['sources']}")
    print(f"\n✅ Expected: Should answer from case context, NO web search")
    
    # Test 2: Request for similar cases (should USE web search with intelligent query)
    print("\n\n🔍 Test 2: Request for similar cases")
    print("-" * 80)
    
    result = await langchain_gemini_service.chat_with_tools(
        message="Find me previous cases like this one",
        case_context=case_context,
        session_id="test2",
        web_search_enabled=True  # Enable web search
    )
    
    print(f"\nUser: Find me previous cases like this one")
    print(f"\nAI Response: {result['response']}")
    print(f"\nSources: {result['sources']}")
    print(f"\n✅ Expected: Should use web_search with intelligent query like 'contract dispute breach precedents'")
    
    # Test 3: Legal precedent question (should USE web search)
    print("\n\n⚖️ Test 3: Legal precedent question")
    print("-" * 80)
    
    result = await langchain_gemini_service.chat_with_tools(
        message="What are the recent California rulings on contract breach statute of limitations?",
        case_context=case_context,
        session_id="test3",
        web_search_enabled=True
    )
    
    print(f"\nUser: What are the recent California rulings on contract breach statute of limitations?")
    print(f"\nAI Response: {result['response'][:500]}...")  # Truncate long response
    print(f"\nSources: {result['sources']}")
    print(f"\n✅ Expected: Should use web_search with query about California statute of limitations")
    
    print("\n" + "=" * 80)
    print("✅ All tests completed!")
    print("=" * 80)

if __name__ == "__main__":
    asyncio.run(test_tool_calling())
