import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import PDFViewer from '../components/PDFViewer';
import NoteEditor from '../components/NoteEditor';
import NoteList from '../components/NoteList';
import PageThumbnails from '../components/PageThumbnails';
import { Note, NoteCreate } from '../types';
import { getDocument, getNotes, createNote, updateNote, deleteNote, getDocumentFileUrl } from '../api';

// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function Editor() {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  
  const [documentTitle, setDocumentTitle] = useState('');
  const [pdfDocument, setPdfDocument] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const pdfViewerRef = useRef<any>(null);

  useEffect(() => {
    if (docId) {
      loadDocument();
      loadNotes();
    }
  }, [docId]);

  const loadDocument = async () => {
    try {
      const doc = await getDocument(docId!);
      setDocumentTitle(doc.title);
      
      const pdfUrl = getDocumentFileUrl(docId!);
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      
      setPdfDocument(pdf);
      setNumPages(pdf.numPages);
    } catch (error) {
      console.error('Failed to load document:', error);
      alert('ドキュメントの読み込みに失敗しました');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    try {
      const fetchedNotes = await getNotes(docId!);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const handlePDFClick = (pageNum: number, xPercent: number, yPercent: number) => {
    const newNote: NoteCreate = {
      doc_id: docId!,
      content: '',
      page_num: pageNum,
      x_percent: xPercent,
      y_percent: yPercent,
      category: '',
    };
    
    createNote(newNote).then((note) => {
      setNotes([...notes, note]);
      setSelectedNote(note);
    }).catch((error) => {
      console.error('Failed to create note:', error);
      alert('メモの作成に失敗しました');
    });
  };

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    if (pdfViewerRef.current) {
      pdfViewerRef.current.scrollToNote(note);
    }
  };

  const handleNoteUpdate = async (noteId: number, content: string, category: string) => {
    try {
      const updatedNote = await updateNote(noteId, { content, category });
      setNotes(notes.map(n => n.id === noteId ? updatedNote : n));
      setSelectedNote(updatedNote);
    } catch (error) {
      console.error('Failed to update note:', error);
      alert('メモの更新に失敗しました');
    }
  };

  const handleNoteDelete = async (noteId: number) => {
    if (!confirm('このメモを削除しますか?')) return;
    
    try {
      await deleteNote(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('メモの削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 mr-4"
          >
            ← 戻る
          </button>
          <h1 className="text-xl font-semibold text-white">{documentTitle}</h1>
        </div>
        <div className="text-gray-400 text-sm">
          Page {currentPage} / {numPages}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Thumbnails */}
        <div className="w-48 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <PageThumbnails
            pdfDocument={pdfDocument}
            notes={notes}
            currentPage={currentPage}
            onPageSelect={setCurrentPage}
          />
        </div>

        {/* Center - PDF Viewer */}
        <div className="flex-1 overflow-auto">
          <PDFViewer
            ref={pdfViewerRef}
            pdfDocument={pdfDocument}
            notes={notes}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onPDFClick={handlePDFClick}
          />
        </div>

        {/* Right Sidebar - Notes */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-lg font-semibold text-white mb-4">メモ一覧</h2>
            <NoteList
              notes={notes}
              selectedNote={selectedNote}
              onNoteSelect={handleNoteSelect}
              onNoteDelete={handleNoteDelete}
            />
          </div>
          
          {selectedNote && (
            <div className="border-t border-gray-700">
              <NoteEditor
                note={selectedNote}
                onUpdate={handleNoteUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;
