import { signIn, signOut, useSession } from "next-auth/react";
import { Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  children?: React.ReactNode;
};

export function Header({ children }: HeaderProps) {
  const { data: sessionData } = useSession();

  return (
    <header className="bg-slate-700 py-4 px-6 text-slate-300 sm:px-12">
      <nav className="mx-auto flex max-w-5xl items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold hover:text-slate-100 sm:text-2xl"
        >
          rewriteit
        </Link>
        <div className="w-full px-4">{children}</div>
        <button
          className="hover:text-slate-100"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          <div className="flex items-center gap-2 whitespace-nowrap">
            {sessionData ? (
              <>
                <Image
                  src={
                    sessionData.user.image ||
                    "https://avatars.githubusercontent.com/u/0"
                  }
                  alt={sessionData.user.name || ""}
                  className="rounded-full"
                  width={24}
                  height={24}
                />
                <p>Sign out</p>
              </>
            ) : (
              <>
                <Github className="h-5 w-5" />
                <p>Sign in</p>
              </>
            )}
          </div>
        </button>
      </nav>
    </header>
  );
}
