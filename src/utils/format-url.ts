export function formatUrl(
  url: string,
  mode: "github" | "gitlab" | "crates" | "url" = "url"
) {
  switch (mode) {
    case "github":
      return url.replace(/(https?:\/\/)?(www)?\.?github\.com\//, "");
    case "gitlab":
      return url.replace(/(https?:\/\/)?(www)?\.?gitlab\.com\//, "");
    case "crates":
      return url.replace(/(https?:\/\/)?(www)?\.?crates\.io\/crates\//, "");
    case "url":
      return url.replace(/(https?:\/\/)?(www\.)?/, "");
  }
}
