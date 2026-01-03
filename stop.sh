#!/bin/bash

# AnchorMind 停止スクリプト

echo "🛑 AnchorMind を停止しています..."

# カレントディレクトリを取得
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# PIDファイルからプロセスIDを読み込んで停止
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "バックエンドを停止しています (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
    fi
    rm logs/backend.pid
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "フロントエンドを停止しています (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
    fi
    rm logs/frontend.pid
fi

# プロセス名で検索して停止（念のため）
pkill -f "uvicorn main:app"
pkill -f "vite"

echo "✅ AnchorMind を停止しました"
