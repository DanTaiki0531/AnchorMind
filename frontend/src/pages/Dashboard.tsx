import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '../types';
import { getDocuments, uploadDocument, deleteDocument } from '../api';

function Dashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const doc = await uploadDocument(file);
      setDocuments([...documents, doc]);
      navigate(`/editor/${doc.id}`);
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert('アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!confirm('このドキュメントを削除しますか?')) return;

    try {
      await deleteDocument(docId);
      setDocuments(documents.filter(doc => doc.id !== docId));
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('削除に失敗しました');
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
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">AnchorMind</h1>
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              {uploading ? 'アップロード中...' : '+ 新規PDF'}
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">
              まだドキュメントがありません
            </p>
            <p className="text-gray-500">
              右上の「新規PDF」ボタンからPDFをアップロードしてください
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/editor/${doc.id}`)}
                className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-700 hover:border-blue-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white truncate flex-1">
                    {doc.title}
                  </h3>
                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    className="text-red-400 hover:text-red-300 ml-2"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  作成日: {new Date(doc.created_at).toLocaleDateString('ja-JP')}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
