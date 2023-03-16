import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { cn } from "@/utils/classnames";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className={cn("contents font-sans", fontSans.variable)}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
