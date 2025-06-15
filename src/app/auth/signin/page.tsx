import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/SignInButton";

/**
 * ログインページコンポーネント
 * 認証済みユーザーはトップページにリダイレクト
 */
export default async function SignIn() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Photo Locator</h1>
        <div className="flex flex-col items-center">
          <p className="mb-8 text-center">
            写真の位置情報を地図上に表示するWebアプリケーション
          </p>
          <SignInButton />
        </div>
      </div>
    </main>
  );
} 