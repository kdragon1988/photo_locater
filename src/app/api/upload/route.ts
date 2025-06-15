import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { s3Client, BUCKET_NAME } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { parse } from "exifr";

/**
 * 写真アップロードAPIエンドポイント
 * 写真をS3にアップロードし、メタデータをデータベースに保存
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "認証が必要です" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "ファイルが選択されていません" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      files.map(async (file) => {
        // EXIFデータの抽出
        const exifData = await parse(file);
        const { latitude, longitude, heading, DateTimeOriginal } = exifData || {};

        // S3にアップロード
        const key = `photos/${session.user.id}/${Date.now()}-${file.name}`;
        const buffer = await file.arrayBuffer();

        await s3Client.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: Buffer.from(buffer),
            ContentType: file.type,
          })
        );

        // データベースに保存
        const photo = await prisma.photo.create({
          data: {
            url: `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`,
            latitude: latitude || null,
            longitude: longitude || null,
            heading: heading || null,
            takenAt: DateTimeOriginal ? new Date(DateTimeOriginal) : null,
            exifData: exifData || {},
            collection: {
              create: {
                title: "新規コレクション",
                userId: session.user.id,
              },
            },
          },
        });

        return photo;
      })
    );

    return NextResponse.json({ photos: results });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "アップロードに失敗しました" },
      { status: 500 }
    );
  }
} 