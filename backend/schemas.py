from __future__ import annotations
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Note schemas (defined first to avoid forward reference issues)
class NoteBase(BaseModel):
    content: str = ""
    page_num: int
    x_percent: float
    y_percent: float
    category: str = ""

class NoteCreate(NoteBase):
    doc_id: str

class NoteUpdate(BaseModel):
    content: Optional[str] = None
    category: Optional[str] = None

class NoteResponse(NoteBase):
    id: int
    doc_id: str
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Document schemas
class DocumentBase(BaseModel):
    title: str

class DocumentCreate(DocumentBase):
    file_hash: str
    file_path: str

class DocumentResponse(DocumentBase):
    id: str
    file_hash: str
    file_path: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class DocumentWithNotes(DocumentResponse):
    notes: List[NoteResponse] = []
    
    class Config:
        from_attributes = True
