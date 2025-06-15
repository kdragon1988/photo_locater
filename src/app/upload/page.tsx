import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PhotoUploader } from "@/components/PhotoUploader";

/**
 * 写真アップロードページコンポーネント
 * 未認証ユーザーはログインページにリダイレクト
 */
export default async function UploadPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full">
        <h1 className="text-4xl font-bold mb-8">写真アップロード</h1>
        <PhotoUploader />
      </div>
    </main>
  );
} 