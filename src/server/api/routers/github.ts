import { z } from "zod";
import { Octokit } from "@octokit/rest";
import { createOAuthAppAuth } from "@octokit/auth-oauth-app";

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
      const { data: readme } = await octokit.rest.repos.getReadme({
        owner: input.owner,
        repo: input.repo,
      });
      const { data } = await octokit.markdown.render({
        text: Buffer.from(readme.content, "base64").toString(),
        mode: "gfm",
        context: input.owner + "/" + input.repo,
      });
      return data;
    }),
});
