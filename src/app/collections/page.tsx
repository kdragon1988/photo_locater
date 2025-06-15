import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

/**
 * コレクション一覧ページコンポーネント
 * 未認証ユーザーはログインページにリダイレクト
 */
export default async function CollectionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const collections = await prisma.collection.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        {
          shares: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ],
    },
    include: {
      _count: {
        select: {
          photos: true,
        },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">コレクション一覧</h1>
          <Link
            href="/upload"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            写真をアップロード
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="block p-6 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                {collection.user.image && (
                  <img
                    src={collection.user.image}
                    alt={collection.user.name || ""}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold">{collection.title}</h2>
                  <p className="text-sm text-gray-500">
                    {collection.user.name || "不明なユーザー"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {collection._count.photos}枚の写真
              </p>
              {collection.description && (
                <p className="mt-2 text-sm text-gray-600">
                  {collection.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 