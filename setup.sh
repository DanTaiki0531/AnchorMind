#!/bin/bash

# AnchorMind セットアップスクリプト（Docker Compose不使用）

echo "🚀 AnchorMind のセットアップを開始します..."

# カレントディレクトリを取得
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# データディレクトリの作成
echo "📁 データディレクトリを作成しています..."
mkdir -p data uploads

# バックエンドのセットアップ
echo ""
echo "🔧 バックエンドのセットアップ..."
cd backend

# 仮想環境の作成
if [ ! -d "venv" ]; then
    echo "Python仮想環境を作成しています..."
    python3 -m venv venv
fi

# 仮想環境の有効化
echo "仮想環境を有効化しています..."
source venv/bin/activate

# 依存関係のインストール
echo "依存関係をインストールしています..."
pip install -r requirements.txt

cd ..

# フロントエンドのセットアップ
echo ""
echo "🎨 フロントエンドのセットアップ..."
cd frontend

# Node.jsパッケージのインストール
if [ ! -d "node_modules" ]; then
    echo "Node.jsパッケージをインストールしています..."
    npm install
else
    echo "Node.jsパッケージは既にインストールされています。"
fi

cd ..

echo ""
echo "✅ セットアップが完了しました！"
echo ""
echo "📌 次のコマンドでアプリケーションを起動できます:"
echo ""
echo "  ./start.sh"
echo ""
echo "または、個別に起動する場合:"
echo ""
echo "  # バックエンド（ターミナル1）:"
echo "  cd backend && source venv/bin/activate && uvicorn main:app --reload"
echo ""
echo "  # フロントエンド（ターミナル2）:"
echo "  cd frontend && npm run dev"
echo ""
