# AnchorMind

PDFファイルを読みながら、クリックした位置にメモを紐付けて記録できるアプリケーションです。メモから元の位置に即座にジャンプでき、ヒートマップで関心領域を可視化できます。

## 特徴

- 📄 **PDFビューア**: ブラウザ上でPDFを表示・閲覧
- 📌 **アンカー機能**: PDF上の任意の位置にメモを紐付け
- 🔖 **メモ管理**: Markdown形式でメモを作成・編集
- 🗺️ **ヒートマップ**: ページごとのメモ密度を視覚化
- ↩️ **ジャンプ機能**: メモから該当箇所へ瞬時に移動
- 📐 **数式サポート**: KaTeXによる数式レンダリング

## 技術スタック

### バックエンド
- FastAPI (Python)
- SQLAlchemy
- SQLite

### フロントエンド
- React 18
- TypeScript
- Vite
- Tailwind CSS
- pdf.js
- React Markdown

### インフラ
- Docker / Docker Compose

## セットアップ

### 前提条件

- Docker Desktop がインストールされていること
- Git がインストールされていること

### インストール手順

1. リポジトリをクローン

```bash
git clone https://github.com/DanTaiki0531/AnchorMind.git
cd AnchorMind
```

2. Dockerコンテナをビルド・起動

```bash
docker-compose up --build
```

初回起動時は依存関係のインストールに時間がかかります。

3. ブラウザでアクセス

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:8000
- API ドキュメント: http://localhost:8000/docs

## 使い方

### 1. PDFのアップロード

1. ダッシュボードの「+ 新規PDF」ボタンをクリック
2. PDFファイルを選択してアップロード
3. 自動的にエディタ画面に遷移

### 2. メモの作成

1. PDF上の任意の箇所をクリック
2. 右サイドバーにメモエディタが表示される
3. Markdown形式でメモを入力
4. カテゴリを設定（任意）

### 3. メモの参照

- 右サイドバーのメモ一覧から選択
- クリックすると該当箇所にスクロール
- プレビューモードで整形された内容を確認

### 4. ヒートマップの確認

- 左サイドバーのサムネイル上に色で表示
  - 青: メモが少ない（1-3件）
  - 黄: メモが中程度（4-10件）
  - 赤: メモが多い（11件以上）

## 開発

### ディレクトリ構造

```
AnchorMind/
├── backend/              # FastAPI バックエンド
│   ├── main.py          # APIエンドポイント
│   ├── models.py        # データベースモデル
│   ├── schemas.py       # Pydanticスキーマ
│   ├── database.py      # DB接続設定
│   └── requirements.txt # Python依存関係
├── frontend/            # React フロントエンド
│   ├── src/
│   │   ├── pages/      # ページコンポーネント
│   │   ├── components/ # 再利用可能コンポーネント
│   │   ├── api.ts      # API通信
│   │   └── types.ts    # TypeScript型定義
│   └── package.json    # Node.js依存関係
├── docker-compose.yml   # Docker設定
└── README.md           # このファイル
```

### ローカル開発（Docker外）

#### バックエンド

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

### データベース

SQLiteファイルは `data/anchormind.db` に保存されます。
アップロードされたPDFは `uploads/` ディレクトリに保存されます。

## API エンドポイント

### Documents

- `GET /api/docs` - ドキュメント一覧取得
- `GET /api/docs/{doc_id}` - 特定ドキュメント取得
- `POST /api/docs/upload` - PDFアップロード
- `GET /api/docs/{doc_id}/file` - PDFファイルダウンロード
- `DELETE /api/docs/{doc_id}` - ドキュメント削除

### Notes

- `GET /api/docs/{doc_id}/notes` - メモ一覧取得
- `POST /api/notes` - メモ作成
- `PUT /api/notes/{note_id}` - メモ更新
- `DELETE /api/notes/{note_id}` - メモ削除

## トラブルシューティング

### ポートが既に使用されている

```bash
# ポートを変更する場合は docker-compose.yml を編集
# backend: 8000 → 8001
# frontend: 5173 → 5174
```

### コンテナの再ビルド

```bash
docker-compose down
docker-compose up --build
```

### データのリセット

```bash
# データベースとアップロードファイルを削除
rm -rf data/ uploads/
```

## 今後の拡張予定

- [ ] AI要約機能（Gemini API連携）
- [ ] 全文検索機能
- [ ] タグ付け・フィルタリング
- [ ] エクスポート機能（Markdown, JSON）
- [ ] マルチユーザー対応


## 作成者

DanTaiki0531
