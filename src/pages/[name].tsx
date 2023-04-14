import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useEffect } from "react";
import {
  ArrowLeft,
  Box,
  ExternalLink,
  Flame,
  Github,
  Gitlab,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { SearchBox } from "@/components/search-box";
import { SoftwareHoverCard } from "@/components/software-hover-card";
import { api } from "@/utils/api";
import { formatUrl } from "@/utils/format-url";

const AlternativePage: NextPage = () => {
  const { query } = useRouter();

  const { data: alternative, status } = api.alternatives.getOne.useQuery(
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
          content={`${alternative?.name || ""} - ${alternative?.description || ""
            }`}
        />
      </Head>
      <Header>
        <SearchBox small />
      </Header>
      <main className="grid min-h-screen grid-rows-[min-content_1fr]">
        <section className="grid h-full grid-cols-[1fr_minmax(0,800px)_1fr] grid-rows-[min-content_1fr] bg-slate-700 px-6 sm:px-12">
          <section className="col-start-2 flex flex-col gap-4 py-8">
            {status === "loading" && (
              <>
                <div className="h-8 w-28 animate-pulse rounded-sm bg-slate-500/80" />
                <div className="h-8 w-[36rem] max-w-full animate-pulse rounded-sm bg-slate-500/80" />
                <div className="h-6 w-96 animate-pulse rounded-sm bg-slate-400/80" />
              </>
            )}
            {status === "success" && !alternative && (
              <>
                <div className="text-2xl font-semibold text-rose-300 sm:text-3xl">
                  Couldn&apos;t find &quot;{query.name}&quot;
                </div>
                <Link href="/">
                  <Button variant="ghost" className="w-fit text-rose-300">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </Button>
                </Link>
              </>
            )}
            {status === "success" && alternative && (
              <>
                <h1 className="text-2xl font-bold text-slate-300 sm:text-3xl">
                  {alternative.name}
                </h1>
                <h2 className="text-lg font-light text-slate-300 sm:text-xl">
                  {alternative.description
                    .split(
                      new RegExp(
                        `(${alternative.to.map((s) => s.name).join(")|(")})`,
                        "gi"
                      )
                    )
                    .filter(Boolean)
                    .map((word, i) => {
                      const software = alternative.to.find(
                        (s) => s.name.toLowerCase() === word.toLowerCase()
                      );

                      if (!software) return word;

                      return (
                        <SoftwareHoverCard key={i} software={software}>
                          {word}
                        </SoftwareHoverCard>
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
                      <span>{formatUrl(alternative.github, "github")}</span>
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
                      <span>{formatUrl(alternative.gitlab, "gitlab")}</span>
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
                      <span>{formatUrl(alternative.crates, "crates")}</span>
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
