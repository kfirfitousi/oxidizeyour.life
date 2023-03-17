export const formatUrl = (url: string) =>
  url.replace(/(https?:\/\/)?(www)?/, "");

export const formatGithubUrl = (url: string) =>
  url.replace(/(https?:\/\/)?(www)?\.?github\.com\//, "");

export const formatCratesUrl = (url: string) =>
  url.replace(/(https?:\/\/)?(www)?\.?crates\.io\/crates\//, "");
