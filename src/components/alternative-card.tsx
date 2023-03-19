import Link from "next/link";
import { Github, ExternalLink, Box, Gitlab, ArrowRight } from "lucide-react";

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

type AlternativeCardProps = {
  alternative: Rewrite & { of: Software[] };
};

export function AlternativeCard({ alternative }: AlternativeCardProps) {
  return (
    <div className="w-full p-2 max-xs:min-h-fit sm:aspect-square">
      <div className="flex h-full flex-col gap-1 rounded bg-slate-200 p-4 text-slate-700">
        <Link
          href={`/${alternative.name}`}
          className="group flex w-full items-center justify-between"
        >
          <h2 className="text-xl font-semibold group-hover:underline">
            {alternative.name}
          </h2>
          <ArrowRight
            className="h-5 w-5 text-slate-400 group-hover:text-slate-700"
            aria-hidden
          />
        </Link>
        <div className="font-light">
          {alternative.description
            .split(
              new RegExp(
                `(${alternative.of.map((s) => s.name).join(")|(")})`,
                "gi"
              )
            )
            .filter(Boolean)
            .map((word, i) => {
              const software = alternative.of.find(
                (s) => s.name.toLowerCase() === word.toLowerCase()
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
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-slate-500 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" aria-label="URL" />
                          <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                            {formatUrl(software.url)}
                          </span>
                        </a>
                      )}
                      {software.github && (
                        <a
                          href={software.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-slate-500 hover:underline"
                        >
                          <Github className="h-4 w-4" aria-label="GitHub" />
                          <span>{formatGithubUrl(software.github)}</span>
                        </a>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
        </div>
        <div className="mt-auto flex flex-col pt-2 text-sm text-slate-600">
          {alternative.url && (
            <a
              href={alternative.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              <span>{formatUrl(alternative.url)}</span>
            </a>
          )}
          {alternative.github && (
            <a
              href={alternative.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <Github className="h-4 w-4" aria-hidden />
              <span>{formatGithubUrl(alternative.github)}</span>
            </a>
          )}
          {alternative.gitlab && (
            <a
              href={alternative.gitlab}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <Gitlab className="h-4 w-4" aria-hidden />
              <span>{formatGitlabUrl(alternative.gitlab)}</span>
            </a>
          )}
          {alternative.crates && (
            <a
              href={alternative.crates}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              <Box className="h-4 w-4" aria-hidden />
              <span>{formatCratesUrl(alternative.crates)}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function AlternativeCardSkeleton() {
  return (
    <div className="aspect-video w-full p-2 sm:aspect-square">
      <div className="h-full animate-pulse rounded bg-slate-200" />
    </div>
  );
}
