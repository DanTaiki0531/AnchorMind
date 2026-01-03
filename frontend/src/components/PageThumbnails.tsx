import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Note } from '../types';

interface PageThumbnailsProps {
  pdfDocument: pdfjsLib.PDFDocumentProxy | null;
  notes: Note[];
  currentPage: number;
  onPageSelect: (page: number) => void;
}

function PageThumbnails({ pdfDocument, notes, currentPage, onPageSelect }: PageThumbnailsProps) {
  const [thumbnails, setThumbnails] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    if (pdfDocument) {
      renderThumbnails();
    }
  }, [pdfDocument]);

  const renderThumbnails = async () => {
    if (!pdfDocument) return;

    const newThumbnails = new Map<number, string>();
    
    for (let i = 1; i <= Math.min(pdfDocument.numPages, 20); i++) {
      try {
        const page = await pdfDocument.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        newThumbnails.set(i, canvas.toDataURL());
      } catch (error) {
        console.error(`Failed to render thumbnail for page ${i}:`, error);
      }
    }
    
    setThumbnails(newThumbnails);
  };

  const getHeatmapColor = (pageNum: number): string => {
    const noteCount = notes.filter(note => note.page_num === pageNum).length;
    
    if (noteCount === 0) return 'rgba(59, 130, 246, 0)';
    if (noteCount <= 3) return 'rgba(59, 130, 246, 0.3)';
    if (noteCount <= 10) return 'rgba(234, 179, 8, 0.5)';
    return 'rgba(239, 68, 68, 0.7)';
  };

  if (!pdfDocument) {
    return <div className="p-4 text-gray-400">読み込み中...</div>;
  }

  return (
    <div className="p-2 space-y-2">
      <h3 className="text-xs font-semibold text-gray-300 px-2 mb-2">ページ一覧</h3>
      {Array.from({ length: pdfDocument.numPages }, (_, i) => i + 1).map((pageNum) => {
        const noteCount = notes.filter(note => note.page_num === pageNum).length;
        const isActive = pageNum === currentPage;
        
        return (
          <div
            key={pageNum}
            onClick={() => onPageSelect(pageNum)}
            className={`relative cursor-pointer rounded overflow-hidden transition-all ${
              isActive ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-500'
            }`}
          >
            {thumbnails.has(pageNum) ? (
              <img
                src={thumbnails.get(pageNum)}
                alt={`Page ${pageNum}`}
                className="w-full"
              />
            ) : (
              <div className="w-full h-32 bg-gray-700 flex items-center justify-center">
                <span className="text-xs text-gray-400">{pageNum}</span>
              </div>
            )}
            
            {/* Heatmap overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: getHeatmapColor(pageNum) }}
            />
            
            {/* Page number and note count */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 flex justify-between items-center">
              <span>p.{pageNum}</span>
              {noteCount > 0 && (
                <span className="bg-red-500 px-1.5 py-0.5 rounded-full text-xs">
                  {noteCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PageThumbnails;
