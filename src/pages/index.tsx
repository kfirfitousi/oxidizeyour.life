import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Loader2 } from "lucide-react";

import {
  AlternativeCard,
  AlternativeCardSkeleton,
} from "@/components/alternative-card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { SearchBox } from "@/components/search-box";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";

const Home: NextPage = () => {
  const popular = api.alternatives.getPopular.useInfiniteQuery(
    { limit: 8 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const newest = api.alternatives.getNewest.useInfiniteQuery(
    { limit: 8 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <>
      <Head>
        <title>Oxidize Your Life</title>
        <meta
          name="description"
          content="A collection of software alternatives written in Rust."
        />
      </Head>
      <Header />
      <main className="grid min-h-screen grid-rows-[min-content_1fr]">
        <section className="grid h-full grid-cols-[1fr_minmax(0,1024px)_1fr] grid-rows-[min-content_1fr] bg-slate-700 px-6 text-slate-300 sm:px-12">
          <section className="col-start-2 flex flex-col items-center justify-center gap-2 pb-8">
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
              Oxidize Your Life
            </h1>
            <h2 className="pb-4 text-center text-lg sm:text-xl md:text-2xl">
              A collection of software alternatives written in Rust
            </h2>
            <SearchBox />
          </section>
        </section>
        <Tabs
          defaultValue="popular"
          className="mx-auto max-w-5xl p-4 py-8 sm:px-0"
        >
          <TabsList>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="newest">New</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="border-none p-0">
            <section className="flex flex-col gap-4">
              <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {popular.status === "success"
                  ? popular.data.pages.map((group, i) => (
                      <React.Fragment key={i}>
                        {group.items.map((alternative) => (
                          <AlternativeCard
                            alternative={alternative}
                            key={alternative.name}
                          />
                        ))}
                      </React.Fragment>
                    ))
                  : Array.from({ length: 8 }, (_, i) => (
                      <AlternativeCardSkeleton key={i} />
                    ))}
              </div>
              <Button
                className="mx-auto w-full max-w-xs text-slate-700"
                variant="ghost"
                onClick={() => void popular.fetchNextPage()}
                disabled={!popular.hasNextPage || popular.isFetchingNextPage}
              >
                {popular.isFetchingNextPage ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Load More"
                )}
              </Button>
            </section>
          </TabsContent>
          <TabsContent value="newest" className=" border-none p-0">
            <section className="flex flex-col gap-4">
              <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {newest.status === "success"
                  ? newest.data.pages.map((group, i) => (
                      <React.Fragment key={i}>
                        {group.items.map((alternative) => (
                          <AlternativeCard
                            alternative={alternative}
                            key={alternative.name}
                          />
                        ))}
                      </React.Fragment>
                    ))
                  : Array.from({ length: 8 }, (_, i) => (
                      <AlternativeCardSkeleton key={i} />
                    ))}
              </div>
              <Button
                className="mx-auto w-fit text-slate-700"
                variant="ghost"
                onClick={() => void newest.fetchNextPage()}
                disabled={!newest.hasNextPage || newest.isFetchingNextPage}
              >
                {newest.isFetchingNextPage ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Load More"
                )}
              </Button>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
};

export default Home;
