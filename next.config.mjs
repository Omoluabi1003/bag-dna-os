const isPagesBuild = process.env.PAGES_BUILD === "true";
const repositoryBasePath = "/bag-dna-os";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isPagesBuild
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: repositoryBasePath,
        assetPrefix: `${repositoryBasePath}/`,
        env: { NEXT_PUBLIC_BASE_PATH: repositoryBasePath },
      }
    : {}),
};

export default nextConfig;
