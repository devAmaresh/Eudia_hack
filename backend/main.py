from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import cases, meetings, chat, dashboard, action_items, email, case_documents
import os

# Create database tables
Base.metadata.create_all(bind=engine)

# Create upload directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("uploads/documents", exist_ok=True)

app = FastAPI(
    title="Lexicase API",
    description="AI-Powered Court Hearing and Client Assistant",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cases.router)
app.include_router(meetings.router)
app.include_router(chat.router)
app.include_router(dashboard.router)
app.include_router(action_items.router)
app.include_router(email.router)
app.include_router(case_documents.router)


@app.get("/")
async def root():
    return {
        "message": "Lexicase API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
