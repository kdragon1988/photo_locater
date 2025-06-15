import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Map } from "@/components/Map";

/**
 * コレクション詳細ページコンポーネント
 * 未認証ユーザーはログインページにリダイレクト
 */
export default async function CollectionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const collection = await prisma.collection.findFirst({
    where: {
      id: params.id,
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
      photos: {
        orderBy: {
          takenAt: "asc",
        },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!collection) {
    redirect("/collections");
  }

  const photos = collection.photos.filter(
    (photo) => photo.latitude && photo.longitude
  );

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1 relative">
        <Map photos={photos} />
      </div>
      <div className="p-4 bg-white border-t">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            {collection.user.image && (
              <img
                src={collection.user.image}
                alt={collection.user.name || ""}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{collection.title}</h1>
              <p className="text-sm text-gray-500">
                {collection.user.name || "不明なユーザー"}
              </p>
            </div>
          </div>
          {collection.description && (
            <p className="mt-2 text-gray-600">{collection.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            {photos.length}枚の写真が地図上に表示されています
          </p>
        </div>
      </div>
    </main>
  );
} 