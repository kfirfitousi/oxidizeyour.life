import type { Software } from "@prisma/client";
import { Github, ExternalLink } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatUrl } from "@/utils/format-url";

type SoftwareHoverCardProps = {
  software: Software;
  children: React.ReactNode;
};

export function SoftwareHoverCard({
  software,
  children,
}: SoftwareHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger className="font-normal hover:underline">
        {children}
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col text-base text-slate-600">
          <div className="text-lg font-semibold">{software.name}</div>
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
              <span>{formatUrl(software.github, "github")}</span>
            </a>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
