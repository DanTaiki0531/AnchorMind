import axios from 'axios';
import { Document, Note, NoteCreate, NoteUpdate } from './types';

// In development, use proxy (relative path), in production use full URL
const API_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8000')
  : '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Document APIs
export const getDocuments = async (): Promise<Document[]> => {
  const response = await api.get('/api/docs');
  return response.data;
};

export const getDocument = async (docId: string): Promise<Document> => {
  const response = await api.get(`/api/docs/${docId}`);
  return response.data;
};

export const uploadDocument = async (file: File): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/docs/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDocument = async (docId: string): Promise<void> => {
  await api.delete(`/api/docs/${docId}`);
};

export const getDocumentFileUrl = (docId: string): string => {
  const baseUrl = import.meta.env.PROD 
    ? (import.meta.env.VITE_API_URL || 'http://localhost:8000')
    : 'http://localhost:8000'; // Direct access for PDF files
  return `${baseUrl}/api/docs/${docId}/file`;
};

// Note APIs
export const getNotes = async (docId: string): Promise<Note[]> => {
  const response = await api.get(`/api/docs/${docId}/notes`);
  return response.data;
};

export const createNote = async (note: NoteCreate): Promise<Note> => {
  const response = await api.post('/api/notes', note);
  return response.data;
};

export const updateNote = async (noteId: number, note: NoteUpdate): Promise<Note> => {
  const response = await api.put(`/api/notes/${noteId}`, note);
  return response.data;
};

export const deleteNote = async (noteId: number): Promise<void> => {
  await api.delete(`/api/notes/${noteId}`);
};

export default api;
