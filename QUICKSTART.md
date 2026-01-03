# AnchorMind クイックスタートガイド

## 🚀 現在の状態

✅ **開発環境が正常に構築されました！**

### アクセスURL

- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:8000
- **APIドキュメント**: http://localhost:8000/docs

## 📋 セットアップ完了内容

### バックエンド
- ✅ FastAPI サーバー (Python 3.9)
- ✅ SQLite データベース
- ✅ PDF アップロード機能
- ✅ メモ管理API
- ✅ CORS設定

### フロントエンド
- ✅ React + TypeScript + Vite
- ✅ Tailwind CSS
- ✅ PDF.js統合
- ✅ Markdown エディタ
- ✅ ヒートマップ機能

## 🎯 使い方

### 1. アプリケーションを開く

ブラウザで http://localhost:5173 にアクセス

### 2. PDFをアップロード

1. ダッシュボードの「+ 新規PDF」ボタンをクリック
2. PDFファイルを選択
3. 自動的にエディタ画面に遷移

### 3. メモを作成

1. PDF上の任意の場所をクリック
2. 右サイドバーにエディタが表示される
3. Markdown形式でメモを入力
4. カテゴリを設定（任意）

### 4. メモから該当箇所にジャンプ

1. 右サイドバーのメモ一覧からメモを選択
2. PDFが自動的に該当箇所にスクロール

### 5. ヒートマップを確認

- 左サイドバーのページサムネイルに色が表示される
- 青: 少ない（1-3件）
- 黄: 中程度（4-10件）
- 赤: 多い（11件以上）

## 🛠️ 管理コマンド

### ステータス確認
```bash
./status.sh
```

### 起動
```bash
# 自動起動スクリプト
./start.sh

# または個別に起動
# ターミナル1（バックエンド）
cd backend && source venv/bin/activate && uvicorn main:app --reload

# ターミナル2（フロントエンド）
cd frontend && npm run dev
```

### 停止
```bash
./stop.sh

# または手動で停止
pkill -f "uvicorn main:app"
pkill -f "vite"
```

### ログ確認
```bash
# バックエンド
tail -f logs/backend.log

# フロントエンド
tail -f logs/frontend.log
```

## 📁 プロジェクト構造

```
AnchorMind/
├── backend/              # FastAPI バックエンド
│   ├── main.py          # APIエンドポイント
│   ├── models.py        # データベースモデル
│   ├── schemas.py       # Pydanticスキーマ
│   ├── database.py      # DB接続設定
│   └── venv/           # Python仮想環境
├── frontend/            # React フロントエンド
│   ├── src/
│   │   ├── pages/      # ページコンポーネント
│   │   ├── components/ # 再利用可能コンポーネント
│   │   ├── api.ts      # API通信
│   │   └── types.ts    # TypeScript型定義
│   └── node_modules/   # Node.js依存関係
├── data/               # SQLiteデータベース
├── uploads/            # アップロードされたPDF
├── logs/              # アプリケーションログ
├── setup.sh           # セットアップスクリプト
├── start.sh           # 起動スクリプト
├── stop.sh            # 停止スクリプト
└── status.sh          # ステータス確認スクリプト
```

## 🐛 トラブルシューティング

### ポートが既に使用されている

```bash
# ポート8000を使用しているプロセスを確認
lsof -i :8000

# ポート5173を使用しているプロセスを確認
lsof -i :5173

# プロセスを停止
kill -9 <PID>
```

### データベースをリセット

```bash
rm -rf data/
mkdir data
# アプリケーションを再起動すると自動的に再作成されます
```

### 依存関係を再インストール

```bash
# バックエンド
cd backend
source venv/bin/activate
pip install -r requirements.txt

# フロントエンド
cd frontend
rm -rf node_modules
npm install
```

### CORS エラー

バックエンドの `main.py` でCORS設定を確認:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切に設定
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 開発のヒント

### ホットリロード

- バックエンド: `--reload` オプションで自動リロード有効
- フロントエンド: Viteの開発サーバーが自動でホットリロード

### APIドキュメント

http://localhost:8000/docs で自動生成されたAPIドキュメントを確認できます

### デバッグ

```bash
# Pythonデバッグ
# main.pyにブレークポイントを設定してpdbを使用

# Reactデバッグ
# ブラウザの開発者ツールを使用
```

## 🎨 カスタマイズ

### テーマ変更

`frontend/src/index.css` でTailwindのカラースキームを変更

### 新機能の追加

1. バックエンド: `backend/main.py` にエンドポイントを追加
2. フロントエンド: `frontend/src/api.ts` にAPI関数を追加
3. UIコンポーネント: `frontend/src/components/` に追加

## 🚀 次のステップ

1. **AI連携**: Gemini APIを使ったメモの要約機能
2. **全文検索**: メモ内容の高度な検索機能
3. **エクスポート**: Markdown、JSON形式でのエクスポート
4. **マルチユーザー**: 認証とユーザー管理
5. **デプロイ**: Vercel（フロント）+ Render.com（バック）

## 📚 参考リンク

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**開発環境構築完了！** 🎉

質問や問題がある場合は、GitHubのIssuesで報告してください。
