# Photo Locator

写真の位置情報を地図上に表示するWebアプリケーション

## 機能

- Googleアカウントによるログイン
- 写真のアップロード（最大1000枚/回）
  - JPEG, PNG, HEIC形式に対応
  - EXIFデータからの位置情報自動抽出
  - AWS S3への自動アップロード
- Google Maps上での写真位置表示
  - 写真の位置にマーカーを表示
  - カメラの向きを矢印で表示
  - クリックで写真の詳細情報を表示
- コレクション単位での写真管理
  - コレクションの作成と編集
  - コレクションの共有機能
  - 権限管理（閲覧者、編集者、管理者）
- レスポンシブデザイン
  - モバイル端末にも対応
  - 直感的なUI/UX

## 技術スタック

### フロントエンド
- Next.js 14.1.0
- React 18.2.0
- TypeScript 5.3.0
- Tailwind CSS 3.4.0
- Google Maps JavaScript API

### バックエンド
- Node.js
- Next.js API Routes
- Prisma ORM
- PostgreSQL

### インフラストラクチャ
- AWS S3（写真ストレージ）
- Vercel（デプロイメント）

### 認証・セキュリティ
- NextAuth.js
- Google OAuth 2.0
- JWT認証

## セットアップ

1. リポジトリのクローン
```bash
git clone https://github.com/yourusername/photo-locator.git
cd photo-locator
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
リポジトリ根本に含まれる`.env.example`をコピーし、`.env`ファイルを作成してください：

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/photo_locator"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-northeast-1"
AWS_S3_BUCKET="your-bucket-name"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

4. データベースのセットアップ
```bash
npx prisma migrate dev
```

5. 開発サーバーの起動
```bash
npm run dev
```

## 必要なAPIキーと認証情報

### Google Cloud Platform
1. Google Maps JavaScript API
   - 地図表示機能に必要
   - 有効化が必要なAPI:
     - Maps JavaScript API
     - Places API

2. Google OAuth 2.0
   - ユーザー認証に必要
   - 認証情報の作成手順:
     1. Google Cloud Consoleでプロジェクトを作成
     2. OAuth 2.0クライアントIDを作成
     3. 承認済みのリダイレクトURIを設定

### AWS
1. S3バケット
   - 写真の保存に使用
   - バケットの作成手順:
     1. S3コンソールでバケットを作成
     2. CORS設定を追加
     3. バケットポリシーを設定

2. IAMユーザー
   - S3アクセス用のアクセスキーとシークレットキー
   - 必要な権限:
     - s3:PutObject
     - s3:GetObject
     - s3:DeleteObject

### PostgreSQL
- データベースインスタンス
- 接続情報:
  - ホスト
  - ポート
  - データベース名
  - ユーザー名
  - パスワード

## 開発

### コマンド
- `npm run dev`: 開発サーバーの起動
- `npm run build`: プロダクションビルド
- `npm run start`: プロダクションサーバーの起動
- `npm run lint`: コードのリント

### ディレクトリ構造
```
src/
├── app/                 # Next.js アプリケーション
│   ├── api/            # API ルート
│   ├── auth/           # 認証関連ページ
│   ├── collections/    # コレクション関連ページ
│   └── upload/         # アップロードページ
├── components/         # React コンポーネント
├── lib/               # ユーティリティ関数
└── types/             # TypeScript 型定義
```

### デプロイメント
1. Vercelへのデプロイ
   - GitHubリポジトリと連携
   - 環境変数の設定
   - 自動デプロイの設定

2. 本番環境の設定
   - データベースの移行
   - S3バケットの設定
   - ドメインの設定

## ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

