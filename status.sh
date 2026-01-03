#!/bin/bash

echo "🔍 AnchorMind の状態を確認しています..."
echo ""

# バックエンドの確認
echo "📡 バックエンド (http://localhost:8000):"
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ 起動中"
    curl -s http://localhost:8000/ | jq . || curl -s http://localhost:8000/
else
    echo "❌ 停止中または応答なし"
fi

echo ""

# フロントエンドの確認
echo "🎨 フロントエンド (http://localhost:5173):"
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo "✅ 起動中"
else
    echo "❌ 停止中または応答なし"
fi

echo ""

# プロセスの確認
echo "🔧 実行中のプロセス:"
echo ""
echo "Uvicorn (バックエンド):"
pgrep -f "uvicorn main:app" > /dev/null && echo "✅ 実行中 (PID: $(pgrep -f 'uvicorn main:app'))" || echo "❌ 停止中"

echo ""
echo "Vite (フロントエンド):"
pgrep -f "vite" > /dev/null && echo "✅ 実行中 (PID: $(pgrep -f 'vite'))" || echo "❌ 停止中"

echo ""
echo "📂 データディレクトリ:"
[ -d "data" ] && echo "✅ data/ 存在" || echo "❌ data/ 不在"
[ -d "uploads" ] && echo "✅ uploads/ 存在" || echo "❌ uploads/ 不在"
[ -d "logs" ] && echo "✅ logs/ 存在" || echo "❌ logs/ 不在"

echo ""
echo "📚 アクセスURL:"
echo "  フロントエンド: http://localhost:5173"
echo "  バックエンドAPI: http://localhost:8000"
echo "  APIドキュメント: http://localhost:8000/docs"
echo ""
