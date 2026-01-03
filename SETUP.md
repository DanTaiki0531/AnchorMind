# AnchorMind セットアップガイド

## 🚀 クイックスタート

### 前提条件

- Docker Desktop がインストールされていること
- Git がインストールされていること

### 起動手順

1. **リポジトリのクローン（既にクローン済みの場合はスキップ）**

```bash
git clone https://github.com/DanTaiki0531/AnchorMind.git
cd AnchorMind
```

2. **Dockerコンテナのビルドと起動**

```bash
# Dockerイメージをビルド
docker compose build

# コンテナを起動
docker compose up
```

または、ビルドと起動を一度に実行:

```bash
docker compose up --build
```

バックグラウンドで起動する場合:

```bash
docker compose up -d
```

3. **アプリケーションへアクセス**

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:8000
- API ドキュメント: http://localhost:8000/docs

## 🔧 管理コマンド

### コンテナの停止

```bash
docker compose down
```

### コンテナの再起動

```bash
docker compose restart
```

### ログの確認

```bash
# 全てのログ
docker compose logs

# バックエンドのログのみ
docker compose logs backend

# フロントエンドのログのみ
docker compose logs frontend

# リアルタイムでログを表示
docker compose logs -f
```

### コンテナの状態確認

```bash
docker compose ps
```

### データのクリーンアップ

```bash
# コンテナとネットワークを削除
docker compose down

# ボリュームも含めて削除（データベースとアップロードファイルが削除されます）
docker compose down -v

# イメージも削除して完全にクリーンアップ
docker compose down --rmi all -v
```

## 🛠️ ローカル開発（Docker外）

### バックエンド

```bash
cd backend

# 仮想環境の作成
python -m venv venv

# 仮想環境の有効化
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 依存関係のインストール
pip install -r requirements.txt

# データベースとアップロードディレクトリの作成
mkdir -p data uploads

# サーバーの起動
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### フロントエンド

```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 環境変数の設定

バックエンド（`backend/.env`）:

```env
DATABASE_URL=sqlite:///./data/anchormind.db
```

フロントエンド（`frontend/.env`）:

```env
VITE_API_URL=http://localhost:8000
```

## 🐛 トラブルシューティング

### ポートが既に使用されている

別のアプリケーションがポートを使用している場合、`docker-compose.yml` を編集してポート番号を変更してください:

```yaml
services:
  backend:
    ports:
      - "8001:8000"  # 8000 → 8001に変更
  frontend:
    ports:
      - "5174:5173"  # 5173 → 5174に変更
```

### コンテナが起動しない

```bash
# ログを確認
docker compose logs

# イメージを再ビルド
docker compose build --no-cache

# 完全にクリーンアップしてから再起動
docker compose down -v
docker compose up --build
```

### フロントエンドがバックエンドに接続できない

1. バックエンドが起動しているか確認:
   ```bash
   curl http://localhost:8000/
   ```

2. CORS設定を確認（`backend/main.py`）

3. ブラウザの開発者ツールでネットワークエラーを確認

### データベースエラー

```bash
# データベースファイルを削除して再作成
rm -rf data/
docker compose restart backend
```

## 📦 本番デプロイ

### Vercel (フロントエンド)

1. Vercelアカウントを作成
2. GitHubリポジトリを接続
3. ビルド設定:
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
4. 環境変数を設定: `VITE_API_URL`

### Render.com (バックエンド)

1. Render.comアカウントを作成
2. 新しいWeb Serviceを作成
3. GitHubリポジトリを接続
4. 設定:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. 環境変数を設定: `DATABASE_URL`

## 🔍 ヘルスチェック

サービスが正常に動作しているか確認:

```bash
# バックエンド
curl http://localhost:8000/

# フロントエンド（ブラウザで開く）
open http://localhost:5173
```

## 📚 追加リソース

- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

問題が解決しない場合は、GitHubのIssuesで報告してください。
