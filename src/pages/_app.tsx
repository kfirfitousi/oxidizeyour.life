import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Roboto_Slab } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { api } from "@/utils/api";
import { cn } from "@/utils/classnames";

import "@/styles/globals.css";
import "@/styles/markdown.css";

const fontSans = Roboto_Slab({
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
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
