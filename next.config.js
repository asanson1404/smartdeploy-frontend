module.exports = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "": undefined,
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
}