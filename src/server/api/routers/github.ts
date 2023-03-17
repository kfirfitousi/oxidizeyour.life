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
        url: z
          .string()
          .url()
          .refine((url) => /^https:\/\/github.com\/(.*)\/(.*)$/.test(url), {
            message:
              "Must be a GitHub repo URL, e.g. https://github.com/user/repo. Must not end with a slash.",
          }),
      })
    )
    .query(async ({ input }) => {
      const github = input.url
        ?.replace(/https:\/\/github.com\//, "")
        .split("/");

      if (!github[0] || !github[1]) {
        // this should never happen
        return null;
      }

      const { data: readme } = await octokit.rest.repos.getReadme({
        owner: github[0],
        repo: github[1],
      });

      const { data } = await octokit.markdown.render({
        text: Buffer.from(readme.content, "base64").toString(),
        mode: "gfm",
        context: github[0] + "/" + github[1],
      });

      return data;
    }),
});
