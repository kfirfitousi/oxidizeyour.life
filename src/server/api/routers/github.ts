import { z } from "zod";
import { Octokit } from "@octokit/rest";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const octokit = new Octokit({
  authStrategy: createOAuthAppAuth,
  auth: {
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  },
});

export const githubRouter = createTRPCRouter({
  getReadme: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { data } = await octokit.rest.repos.getReadme({
        owner: input.owner,
        repo: input.repo,
      });
      return serialize(Buffer.from(data.content, "base64").toString(), {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: "github-dark",
              },
            ],
          ],
        },
      });
    }),
});
