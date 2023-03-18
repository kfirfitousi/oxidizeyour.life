import type { NextPage } from "next";
import Head from "next/head";

import { Header } from "@/components/header";
import { RewriteCard, RewriteCardSkeleton } from "@/components/rewrite-card";
import { SearchBox } from "@/components/search-box";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";

const Home: NextPage = () => {
  const popular = api.rewrites.getPopular.useQuery();
  const newest = api.rewrites.getNewest.useQuery();

  return (
    <>
      <Head>
        <title>Rewrite it in Rust</title>
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
              Rewrite it in Rust
            </h1>
            <h2 className="pb-4 text-center text-lg sm:text-xl md:text-2xl">
              A collection of software alternatives written in Rust
            </h2>
            <SearchBox />
          </section>
        </section>
        <section className="bg-slate-300 p-6 sm:p-8">
          <Tabs defaultValue="popular" className="mx-auto max-w-5xl">
            <TabsList>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="newest">New</TabsTrigger>
            </TabsList>
            <TabsContent value="popular" className="border-none p-0">
              <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {popular.data
                  ? popular.data?.map((rewrite) => (
                    <RewriteCard rewrite={rewrite} key={rewrite.name} />
                  ))
                  : Array.from({ length: 8 }, (_, i) => (
                    <RewriteCardSkeleton key={i} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="newest" className="border-none p-0">
              <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {newest.data
                  ? newest.data?.map((rewrite) => (
                    <RewriteCard rewrite={rewrite} key={rewrite.name} />
                  ))
                  : Array.from({ length: 8 }, (_, i) => (
                    <RewriteCardSkeleton key={i} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </>
  );
};

export default Home;
