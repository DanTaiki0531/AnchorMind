import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Note } from '../types';

interface NoteEditorProps {
  note: Note;
  onUpdate: (noteId: number, content: string, category: string) => void;
}

function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [content, setContent] = useState(note.content);
  const [category, setCategory] = useState(note.category);
  const [isPreview, setIsPreview] = useState(false);

  const handleSave = () => {
    onUpdate(note.id, content, category);
  };

  return (
    <div className="p-4 bg-gray-800">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          カテゴリ
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onBlur={handleSave}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: 序論, 手法, 結果"
        />
      </div>

      <div className="mb-2 flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-300">
          メモ内容
        </label>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          {isPreview ? '編集' : 'プレビュー'}
        </button>
      </div>

      {isPreview ? (
        <div className="prose prose-invert max-w-none bg-gray-700 rounded-md p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {content || '*メモが空です*'}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          className="w-full h-64 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
          placeholder="Markdown形式でメモを入力..."
        />
      )}

      <div className="mt-2 text-xs text-gray-400">
        最終更新: {new Date(note.updated_at).toLocaleString('ja-JP')}
      </div>
    </div>
  );
}

export default NoteEditor;
