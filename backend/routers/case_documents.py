from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models import CaseDocument, Case
from services.pinecone_service import pinecone_service
from services.document_service import document_service
import os
import time
from typing import Optional

router = APIRouter(prefix="/api/case-documents", tags=["case-documents"])


@router.post("/")
async def upload_case_document(
    case_id: int = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a case document (PDF, DOCX, TXT) and store in vector DB"""
    
    # Verify case exists
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Validate file type
    allowed_extensions = ['pdf', 'docx', 'doc', 'txt']
    file_extension = file.filename.split('.')[-1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Save file
        os.makedirs("uploads/documents", exist_ok=True)
        timestamp = str(time.time()).replace('.', '_')
        safe_filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join("uploads/documents", safe_filename)
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        file_size = len(content)
        
        # Create document record
        document = CaseDocument(
            case_id=case_id,
            title=title,
            description=description,
            file_path=file_path,
            file_type=file_extension,
            file_size=file_size
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        
        # Extract text from document
        extracted_text = document_service.extract_text(file_path, file_extension)
        
        if extracted_text:
            # Store in Pinecone
            await pinecone_service.store_case_document(
                document_id=document.id,
                case_id=case_id,
                content=extracted_text,
                metadata={
                    "title": title,
                    "case_number": case.case_number,
                    "case_title": case.title,
                    "client_side": case.client_side,
                    "file_type": file_extension
                }
            )
        
        return {
            "id": document.id,
            "case_id": document.case_id,
            "title": document.title,
            "file_type": document.file_type,
            "file_size": document.file_size,
            "uploaded_at": document.uploaded_at,
            "text_extracted": len(extracted_text) > 0,
            "text_length": len(extracted_text)
        }
        
    except Exception as e:
        db.rollback()
        # Clean up file if it exists
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error processing document: {str(e)}")


@router.get("/case/{case_id}")
async def get_case_documents(case_id: int, db: Session = Depends(get_db)):
    """Get all documents for a case"""
    documents = db.query(CaseDocument).filter(CaseDocument.case_id == case_id).all()
    
    return [
        {
            "id": doc.id,
            "title": doc.title,
            "description": doc.description,
            "file_type": doc.file_type,
            "file_size": doc.file_size,
            "uploaded_at": doc.uploaded_at
        }
        for doc in documents
    ]


@router.delete("/{document_id}")
async def delete_case_document(document_id: int, db: Session = Depends(get_db)):
    """Delete a case document"""
    document = db.query(CaseDocument).filter(CaseDocument.id == document_id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    try:
        # Delete from Pinecone
        await pinecone_service.delete_case_document(document_id)
        
        # Delete file
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
        
        # Delete from database
        db.delete(document)
        db.commit()
        
        return {"message": "Document deleted successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")
