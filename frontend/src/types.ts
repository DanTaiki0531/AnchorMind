export interface Document {
  id: string;
  title: string;
  file_hash: string;
  file_path: string;
  created_at: string;
}

export interface Note {
  id: number;
  doc_id: string;
  content: string;
  page_num: number;
  x_percent: number;
  y_percent: number;
  category: string;
  updated_at: string;
}

export interface NoteCreate {
  doc_id: string;
  content: string;
  page_num: number;
  x_percent: number;
  y_percent: number;
  category?: string;
}

export interface NoteUpdate {
  content?: string;
  category?: string;
}
