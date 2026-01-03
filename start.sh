#!/bin/bash

# AnchorMind 起動スクリプト

echo "🚀 AnchorMind を起動しています..."

# カレントディレクトリを取得
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# データディレクトリの確認
mkdir -p data uploads

# バックエンドを起動（バックグラウンド）
echo "🔧 バックエンドを起動しています..."
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "バックエンド起動完了 (PID: $BACKEND_PID)"
cd ..

# 少し待機
sleep 3

# フロントエンドを起動（バックグラウンド）
echo "🎨 フロントエンドを起動しています..."
cd frontend
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "フロントエンド起動完了 (PID: $FRONTEND_PID)"
cd ..

# PIDを保存
mkdir -p logs
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo ""
echo "✅ AnchorMind が起動しました！"
echo ""
echo "📍 アクセス:"
echo "  フロントエンド: http://localhost:5173"
echo "  バックエンドAPI: http://localhost:8000"
echo "  APIドキュメント: http://localhost:8000/docs"
echo ""
echo "📝 ログファイル:"
echo "  バックエンド: logs/backend.log"
echo "  フロントエンド: logs/frontend.log"
echo ""
echo "🛑 停止する場合: ./stop.sh"
echo ""
