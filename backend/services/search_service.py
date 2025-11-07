from duckduckgo_search import DDGS
from typing import List, Dict, Any


class SearchService:
    def __init__(self):
        self.ddg = DDGS()

    async def search_legal_citations(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Search for legal citations and references using DuckDuckGo"""
        try:
            # Add legal context to query
            legal_query = f"{query} legal case law citation"
            
            results = []
            search_results = self.ddg.text(legal_query, max_results=max_results)
            
            for result in search_results:
                results.append({
                    "title": result.get("title", ""),
                    "url": result.get("href", ""),
                    "snippet": result.get("body", ""),
                    "source": "DuckDuckGo"
                })
            
            return results
            
        except Exception as e:
            print(f"Error searching for citations: {e}")
            return []

    async def search_case_law(self, keywords: List[str]) -> List[Dict[str, Any]]:
        """Search for relevant case law"""
        query = " ".join(keywords) + " case law precedent"
        return await self.search_legal_citations(query)


# Singleton instance
search_service = SearchService()
