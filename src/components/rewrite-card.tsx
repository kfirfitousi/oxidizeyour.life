import Link from "next/link";
import { Github, ExternalLink, Box } from "lucide-react";

import type { Rewrite, Software } from "@prisma/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type RewriteCardProps = {
  rewrite: Rewrite & { of: Software[] };
};

export function RewriteCard({ rewrite }: RewriteCardProps) {
  return (
    <div className="aspect-video w-full p-2 sm:aspect-square">
      <div className="block flex h-full flex-col rounded bg-slate-200 p-4 text-slate-700">
        <Link
          href={`/${rewrite.name}`}
          className="text-lg font-semibold hover:underline"
        >
          {rewrite.name}
        </Link>
        <p className="text-sm">
          {rewrite.description.split(" ").map((word, i) => {
            const software = rewrite.of.find((s) =>
              new RegExp(`['"’\`]?${s.name}['"’\`,\.\(1\)]*$`, "i").test(word)
            );

            if (!software) return `${word} `;

            return (
              <HoverCard key={i}>
                <HoverCardTrigger className="font-semibold hover:underline">
                  {word}
                </HoverCardTrigger>{" "}
                <HoverCardContent>
                  <div className="flex flex-col text-slate-600">
                    <p className="text-lg font-semibold">{software.name}</p>
                    <p className="pb-2">{software.description}</p>
                    {software.url && (
                      <a
                        href={software.url}
                        className="flex gap-1 text-slate-500 hover:underline"
                      >
                        <ExternalLink className="h-5 w-5" />
                        <span>{software.url}</span>
                      </a>
                    )}
                    {software.github && (
                      <a
                        href={software.github}
                        className="flex gap-1 text-slate-500 hover:underline"
                      >
                        <Github className="h-5 w-5" />
                        <span>{software.github}</span>
                      </a>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </p>
        <div className="mt-auto flex flex-col">
          {rewrite.url && (
            <a
              href={rewrite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-slate-500 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              <span>{rewrite.url.replace(/(https?:\/\/)?(www)?/, "")}</span>
            </a>
          )}
          {rewrite.github && (
            <a
              href={rewrite.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-slate-500 hover:underline"
            >
              <Github className="h-4 w-4" />
              <span>
                {rewrite.github.replace(
                  /(https?:\/\/)?(www)?\.?github\.com\//,
                  ""
                )}
              </span>
            </a>
          )}
          {rewrite.crates && (
            <a
              href={rewrite.crates}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-slate-500 hover:underline"
            >
              <Box className="h-4 w-4" />
              <span>
                {rewrite.crates.replace(
                  /(https?:\/\/)?(www)?\.?crates\.io\/crates\//,
                  ""
                )}
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function RewriteCardSkeleton() {
  return (
    <div className="aspect-video w-full p-2 sm:aspect-square">
      <div className="h-full animate-pulse rounded bg-slate-200" />
    </div>
  );
}
