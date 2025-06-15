"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * NextAuthのセッションを提供するプロバイダーコンポーネント
 * クライアントサイドでの認証状態の管理を担当
 */
export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
} 