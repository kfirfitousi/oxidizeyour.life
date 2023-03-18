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
  return (
    <div className="w-full p-2 max-xs:min-h-fit sm:aspect-square">
      <div className="block flex h-full flex-col gap-1 rounded bg-slate-200 p-4 text-slate-700">
        <Link
          href={`/${rewrite.name}`}
          className="text-xl font-semibold hover:underline"
        >
          {rewrite.name}
        </Link>
        <p className="font-light">
          {rewrite.description.split(" ").map((word, i) => {
            const software = rewrite.of.find((s) =>
              new RegExp(`^['"‘\`\(\[]?${s.name}`, "i").test(word)
            );

            if (!software) return `${word} `;

            return (
              <HoverCard key={i}>
                <HoverCardTrigger className="font-normal hover:underline">
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
              <span>{formatUrl(rewrite.url)}</span>
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
              <span>{formatGithubUrl(rewrite.github)}</span>
            </a>
          )}
          {rewrite.gitlab && (
            <a
              href={rewrite.gitlab}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-slate-500 hover:underline"
            >
              <Gitlab className="h-4 w-4" />
              <span>{formatGitlabUrl(rewrite.gitlab)}</span>
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
