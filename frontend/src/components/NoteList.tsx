import { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (noteId: number) => void;
}

function NoteList({ notes, selectedNote, onNoteSelect, onNoteDelete }: NoteListProps) {
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.page_num !== b.page_num) {
      return a.page_num - b.page_num;
    }
    return a.y_percent - b.y_percent;
  });

  if (notes.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>まだメモがありません</p>
        <p className="text-sm mt-2">PDFをクリックしてメモを作成</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sortedNotes.map((note) => (
        <div
          key={note.id}
          onClick={() => onNoteSelect(note)}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedNote?.id === note.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">
                p.{note.page_num}
              </span>
              {note.category && (
                <span className="text-xs px-2 py-0.5 rounded bg-gray-600">
                  {note.category}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNoteDelete(note.id);
              }}
              className="text-red-400 hover:text-red-300 text-xs"
            >
              削除
            </button>
          </div>
          <p className="text-sm line-clamp-3">
            {note.content || '(空のメモ)'}
          </p>
        </div>
      ))}
    </div>
  );
}

export default NoteList;
