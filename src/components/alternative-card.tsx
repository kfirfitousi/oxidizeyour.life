import type { Rewrite, Software } from "@prisma/client";
import Link from "next/link";
import { Github, ExternalLink, Box, Gitlab, ArrowRight } from "lucide-react";

import { SoftwareHoverCard } from "@/components/software-hover-card";
import { formatUrl } from "@/utils/format-url";

type AlternativeCardProps = {
  alternative: Rewrite & { of: Software[] };
};

export function AlternativeCardSkeleton() {
  return (
    <div className="aspect-video w-full p-2 sm:aspect-square">
      <div className="h-full animate-pulse rounded bg-slate-200" />
    </div>
  );
}

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
                <SoftwareHoverCard key={i} software={software}>
                  {word}
                </SoftwareHoverCard>
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
              <span>{formatUrl(alternative.github, "github")}</span>
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
              <span>{formatUrl(alternative.gitlab, "gitlab")}</span>
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
              <span>{formatUrl(alternative.crates, "crates")}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
