import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";
import {
  Box,
  ExternalLink,
  Flame,
  Github,
  Gitlab,
  Loader2,
} from "lucide-react";

import { Header } from "@/components/header";
import { SearchBox } from "@/components/search-box";
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
import { api } from "@/utils/api";

const AlternativePage: NextPage = () => {
  const { query } = useRouter();

  const { data: alternative } = api.alternatives.getOne.useQuery(
    {
      name: query.name as string,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const readme = api.github.getReadme.useQuery(
    { url: alternative?.github as string },
    {
      enabled: !!alternative?.github,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: incrementViews } =
    api.alternatives.incrementViews.useMutation();

  useEffect(() => {
    if (alternative?.name) {
      incrementViews({
        name: alternative.name,
      });
    }
  }, [alternative?.name, incrementViews]);

  return (
    <>
      <Head>
        <title>Oxidize Your Life - {alternative?.name}</title>
        <meta
          name="description"
          content={`${alternative?.name || ""} - ${
            alternative?.description || ""
          }`}
        />
      </Head>
      <Header>
        <SearchBox small />
      </Header>
      <main className="grid min-h-screen grid-rows-[min-content_1fr]">
        <section className="grid h-full grid-cols-[1fr_minmax(0,800px)_1fr] grid-rows-[min-content_1fr] bg-slate-700 px-6 text-slate-300 sm:px-12">
          <section className="col-start-2 flex flex-col gap-4 py-8">
            {!alternative ? (
              <>
                <div className="h-8 w-28 animate-pulse rounded-sm bg-slate-500/80" />
                <div className="h-8 w-[36rem] max-w-full animate-pulse rounded-sm bg-slate-500/80" />
                <div className="h-6 w-96 animate-pulse rounded-sm bg-slate-400/80" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {alternative.name}
                </h1>
                <h2 className="text-lg font-light sm:text-xl">
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
                            <div className="flex flex-col text-base text-slate-600">
                              <div className="text-lg font-semibold">
                                {software.name}
                              </div>
                              <div className="pb-2">{software.description}</div>
                              {software.url && (
                                <a
                                  href={software.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex gap-1 text-slate-500 hover:underline"
                                >
                                  <ExternalLink
                                    className="h-5 w-5"
                                    aria-label="URL"
                                  />
                                  <span>{formatUrl(software.url)}</span>
                                </a>
                              )}
                              {software.github && (
                                <a
                                  href={software.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex gap-1 text-slate-500 hover:underline"
                                >
                                  <Github
                                    className="h-5 w-5"
                                    aria-label="GitHub"
                                  />
                                  <span>
                                    {formatGithubUrl(software.github)}
                                  </span>
                                </a>
                              )}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}
                </h2>
                <div className="flex flex-wrap gap-4 text-slate-300/75">
                  {alternative.url && (
                    <a
                      href={alternative.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-slate-100 hover:underline"
                    >
                      <ExternalLink className="h-5 w-5" aria-label="URL" />
                      <span>{formatUrl(alternative.url)}</span>
                    </a>
                  )}
                  {alternative.github && (
                    <a
                      href={alternative.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-slate-100 hover:underline"
                    >
                      <Github className="h-5 w-5" aria-label="GitHub" />
                      <span>{formatGithubUrl(alternative.github)}</span>
                    </a>
                  )}
                  {alternative.gitlab && (
                    <a
                      href={alternative.gitlab}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-slate-100 hover:underline"
                    >
                      <Gitlab className="h-5 w-5" aria-label="GitLab" />
                      <span>{formatGitlabUrl(alternative.gitlab)}</span>
                    </a>
                  )}
                  {alternative.crates && (
                    <a
                      href={alternative.crates}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:text-slate-100 hover:underline"
                    >
                      <Box className="h-5 w-5" aria-label="crates.io" />
                      <span>{formatCratesUrl(alternative.crates)}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-1">
                    <Flame className="h-5 w-5" aria-hidden />
                    <span>{alternative.views} views</span>
                  </div>
                </div>
              </>
            )}
          </section>
        </section>
        <section className="min-h-full w-screen p-6 sm:p-12">
          <div className="prose prose-slate mx-auto max-w-3xl">
            {alternative && !alternative.github && <p>No README found.</p>}
            {readme.isFetching ? (
              <Loader2
                className="mx-auto h-10 w-10 animate-spin"
                aria-label="Loading..."
              />
            ) : readme.isError ? (
              <p>Error: {readme.error.message}</p>
            ) : (
              <section
                // TODO: find a better way to do this
                dangerouslySetInnerHTML={{ __html: readme.data ?? "" }}
              />
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default AlternativePage;
