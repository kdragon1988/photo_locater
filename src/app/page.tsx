import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

/**
 * トップページコンポーネント
 * 未認証ユーザーはログインページにリダイレクト
 */
export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Photo Locator</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/collections"
            className="p-6 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">コレクション一覧</h2>
            <p>写真コレクションの一覧を表示します</p>
          </Link>
          <Link
            href="/upload"
            className="p-6 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">写真アップロード</h2>
            <p>新しい写真をアップロードします</p>
          </Link>
        </div>
      </div>
    </main>
  );
} 