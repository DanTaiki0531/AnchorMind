import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Note } from '../types';

interface PDFViewerProps {
  pdfDocument: pdfjsLib.PDFDocumentProxy | null;
  notes: Note[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onPDFClick: (pageNum: number, xPercent: number, yPercent: number) => void;
}

const PDFViewer = forwardRef((props: PDFViewerProps, ref) => {
  const { pdfDocument, notes, currentPage, onPageChange, onPDFClick } = props;
  const [renderedPages, setRenderedPages] = useState<Map<number, string>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());

  useImperativeHandle(ref, () => ({
    scrollToNote: (note: Note) => {
      onPageChange(note.page_num);
      // Scroll to approximate position
      setTimeout(() => {
        const canvas = canvasRefs.current.get(note.page_num);
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const y = (note.y_percent / 100) * rect.height;
          canvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    },
  }));

  useEffect(() => {
    if (pdfDocument) {
      renderPage(currentPage);
    }
  }, [pdfDocument, currentPage]);

  const renderPage = async (pageNum: number) => {
    if (!pdfDocument || renderedPages.has(pageNum)) return;

    try {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const imageUrl = canvas.toDataURL();
      setRenderedPages(new Map(renderedPages.set(pageNum, imageUrl)));
      canvasRefs.current.set(pageNum, canvas);
    } catch (error) {
      console.error('Failed to render page:', error);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>, pageNum: number) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    onPDFClick(pageNum, xPercent, yPercent);
  };

  const getNotesForPage = (pageNum: number) => {
    return notes.filter(note => note.page_num === pageNum);
  };

  if (!pdfDocument) {
    return <div className="flex items-center justify-center h-full text-white">PDF読み込み中...</div>;
  }

  return (
    <div ref={containerRef} className="h-full overflow-auto bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {Array.from({ length: pdfDocument.numPages }, (_, i) => i + 1).map((pageNum) => (
          <div
            key={pageNum}
            className="relative bg-white shadow-2xl"
            onClick={(e) => handleCanvasClick(e, pageNum)}
          >
            {renderedPages.has(pageNum) ? (
              <>
                <img
                  src={renderedPages.get(pageNum)}
                  alt={`Page ${pageNum}`}
                  className="w-full"
                />
                {/* Render note markers */}
                {getNotesForPage(pageNum).map((note) => (
                  <div
                    key={note.id}
                    className="absolute w-6 h-6 bg-red-500 rounded-full opacity-70 hover:opacity-100 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${note.x_percent}%`,
                      top: `${note.y_percent}%`,
                    }}
                    title={note.content.substring(0, 50)}
                  />
                ))}
              </>
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                <button
                  onClick={() => renderPage(pageNum)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ページ {pageNum} を読み込む
                </button>
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {pageNum}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PDFViewer.displayName = 'PDFViewer';

export default PDFViewer;
