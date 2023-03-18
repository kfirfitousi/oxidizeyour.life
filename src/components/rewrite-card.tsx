import Link from "next/link";
import { Github, ExternalLink, Box, Gitlab } from "lucide-react";

import type { Rewrite, Software } from "@prisma/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  formatCratesUrl,
  formatGithubUrl,
  formatGitlabUrl,
  formatUrl,
} from "@/utils/format-url";

type RewriteCardProps = {
  rewrite: Rewrite & { of: Software[] };
};

export function RewriteCard({ rewrite }: RewriteCardProps) {
  const re = new RegExp(`(${rewrite.of.map((s) => s.name).join(")|(")})`, "gi");

  return (
    <div className="w-full p-2 max-xs:min-h-fit sm:aspect-square">
      <div className="flex h-full flex-col gap-1 rounded bg-slate-200 p-4 text-slate-700">
        <Link
          href={`/${rewrite.name}`}
          className="text-xl font-semibold hover:underline"
        >
          {rewrite.name}
        </Link>
        <div className="font-light">
          {rewrite.description
            .split(re)
            .filter(Boolean)
            .map((word, i) => {
              const software = rewrite.of.find(
                (s) => s.name === word.toLowerCase()
              );

              if (!software) return word;

              return (
                <HoverCard key={i}>
                  <HoverCardTrigger className="font-normal hover:underline">
                    {word}
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex flex-col text-slate-600">
                      <div className="text-lg font-semibold">
                        {software.name}
                      </div>
                      <div className="pb-2">{software.description}</div>
                      {software.url && (
                        <a
                          href={software.url}
                          className="flex gap-1 text-slate-500 hover:underline"
                        >
                          <ExternalLink className="h-5 w-5" aria-label="URL" />
                          <span>{software.url}</span>
                        </a>
                      )}
                      {software.github && (
                        <a
                          href={software.github}
                          className="flex gap-1 text-slate-500 hover:underline"
                        >
                          <Github className="h-5 w-5" aria-label="GitHub" />
                          <span>{software.github}</span>
                        </a>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
        </div>
        <div className="mt-auto flex flex-col pt-2 text-sm text-slate-600">
          {rewrite.url && (
            <a
              href={rewrite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              <span>{formatUrl(rewrite.url)}</span>
            </a>
          )}
          {rewrite.github && (
            <a
              href={rewrite.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <Github className="h-4 w-4" aria-hidden />
              <span>{formatGithubUrl(rewrite.github)}</span>
            </a>
          )}
          {rewrite.gitlab && (
            <a
              href={rewrite.gitlab}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <Gitlab className="h-4 w-4" aria-hidden />
              <span>{formatGitlabUrl(rewrite.gitlab)}</span>
            </a>
          )}
          {rewrite.crates && (
            <a
              href={rewrite.crates}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <Box className="h-4 w-4" aria-hidden />
              <span>{formatCratesUrl(rewrite.crates)}</span>
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
