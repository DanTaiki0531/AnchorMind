from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import hashlib
import os
import shutil

from database import init_db, get_db
from models import Document, Note
from schemas import (
    DocumentResponse, 
    DocumentWithNotes, 
    NoteCreate, 
    NoteUpdate, 
    NoteResponse
)

app = FastAPI(title="AnchorMind API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    os.makedirs("uploads", exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "AnchorMind API is running"}

# Document endpoints
@app.get("/api/docs", response_model=List[DocumentResponse])
def get_documents(db: Session = Depends(get_db)):
    """Get all documents"""
    documents = db.query(Document).all()
    return documents

@app.get("/api/docs/{doc_id}", response_model=DocumentWithNotes)
def get_document(doc_id: str, db: Session = Depends(get_db)):
    """Get a specific document with its notes"""
    document = db.query(Document).filter(Document.id == doc_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@app.post("/api/docs/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a PDF document"""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Read file content
    content = await file.read()
    
    # Calculate file hash
    file_hash = hashlib.sha256(content).hexdigest()
    
    # Check if file already exists
    existing_doc = db.query(Document).filter(Document.file_hash == file_hash).first()
    if existing_doc:
        return existing_doc
    
    # Save file
    file_path = f"uploads/{file_hash}.pdf"
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Create document record
    document = Document(
        title=file.filename,
        file_hash=file_hash,
        file_path=file_path
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return document

@app.get("/api/docs/{doc_id}/file")
def get_document_file(doc_id: str, db: Session = Depends(get_db)):
    """Download a document file"""
    document = db.query(Document).filter(Document.id == doc_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    if not os.path.exists(document.file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(document.file_path, media_type="application/pdf", filename=document.title)

@app.delete("/api/docs/{doc_id}")
def delete_document(doc_id: str, db: Session = Depends(get_db)):
    """Delete a document and its associated notes"""
    document = db.query(Document).filter(Document.id == doc_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete file
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    # Delete database record (notes will be deleted via cascade)
    db.delete(document)
    db.commit()
    
    return {"message": "Document deleted successfully"}

# Note endpoints
@app.get("/api/docs/{doc_id}/notes", response_model=List[NoteResponse])
def get_notes(doc_id: str, db: Session = Depends(get_db)):
    """Get all notes for a document"""
    notes = db.query(Note).filter(Note.doc_id == doc_id).all()
    return notes

@app.post("/api/notes", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    """Create a new note"""
    # Check if document exists
    document = db.query(Document).filter(Document.id == note.doc_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db_note = Note(**note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    
    return db_note

@app.put("/api/notes/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note_update: NoteUpdate, db: Session = Depends(get_db)):
    """Update a note"""
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    update_data = note_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_note, key, value)
    
    db.commit()
    db.refresh(db_note)
    
    return db_note

@app.delete("/api/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    """Delete a note"""
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(db_note)
    db.commit()
    
    return {"message": "Note deleted successfully"}
