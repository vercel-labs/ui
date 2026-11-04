import { createMDX } from "fumadocs-mdx/next"
import path from "node:path"
import { newestByMajor, releasesIn, webReleaseHeaders } from "./lib/web-releases.mjs"

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Prerendering every page's props tables can pass Next's 60-second default
  // on a busy machine, which fails the whole build.
  staticPageGenerationTimeout: 300,
  // Workspace packages ship TypeScript source. The examples aren't bundled:
  // examples/vite.config.ts compiles them, and the browser loads them.
  transpilePackages: ["@ui-sdk/core", "@ui-sdk/react"],
  turbopack: { root: path.resolve(import.meta.dirname, "../..") },
  // The examples route reads examples/dist at runtime, so those files ship
  // with its function.
  outputFileTracingIncludes: {
    "/examples/**": ["../../examples/dist/**/*.js"],
  },
  // The newest `@ui-sdk/web` release of each major, like `{"1":"1.3.0"}`, for `proxy.ts`.
  env: {
    WEB_RELEASES: JSON.stringify(
      Object.fromEntries(newestByMajor(releasesIn(path.join(import.meta.dirname, "public")))),
    ),
  },
  async headers() {
    return webReleaseHeaders()
  },
  // Every page as Markdown, like `/docs/react/components/menu.md`. Behaviors'
  // and Agents' own `.md` files are the whole section, and they win.
  async rewrites() {
    return [{ source: "/docs/:path*.md", destination: "/md/:path*" }]
  },
  async redirects() {
    const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
    const pages = "components|utilities|rendering|server-rendering|how-it-works|build-with-an-agent"
    return [
      {
        source: `/docs/:framework(${frameworks.join("|")})/:folder(hooks|utilities)/observe`,
        destination: "/docs/behaviors/observe",
        permanent: true,
      },
      { source: "/docs/utilities/observe", destination: "/docs/behaviors/observe", permanent: true },
      {
        source: `/docs/:framework(${frameworks.join("|")})/why`,
        destination: "/docs/:framework",
        permanent: true,
      },
      { source: "/docs/why", destination: "/docs/frameworks", permanent: false },
      ...frameworks.map((framework) => ({
        source: "/docs/frameworks",
        has: [{ type: "cookie", key: "framework", value: framework }],
        destination: `/docs/${framework}`,
        permanent: false,
      })),
      { source: "/docs/frameworks", destination: "/docs/react", permanent: false },
      {
        source: `/docs/:framework(${frameworks.join("|")})/usage`,
        destination: "/docs/:framework/parts-and-composition",
        permanent: false,
      },
      // Form was removed: a native form with fields does its job.
      {
        source: `/docs/:framework(${frameworks.join("|")})/components/form`,
        destination: "/docs/:framework/forms",
        permanent: true,
      },
      // The shared sections link to a framework's pages without naming one, like
      // /docs/components/field. They go to the framework the reader last read,
      // which its pages remember in a cookie, else React.
      ...frameworks.map((framework) => ({
        source: `/docs/:page(${pages})/:rest*`,
        has: [{ type: "cookie", key: "framework", value: framework }],
        destination: `/docs/${framework}/:page/:rest*`,
        permanent: false,
      })),
      { source: `/docs/:page(${pages})/:rest*`, destination: "/docs/react/:page/:rest*", permanent: false },
      // Core became Behaviors, with its Behaviors and Foundations groups as pages
      // of their own. Its introduction moved to each framework's.
      { source: "/docs/core", destination: "/docs/behaviors", permanent: true },
      { source: "/docs/core/get-started", destination: "/docs/behaviors/build-a-component", permanent: true },
      {
        source: "/docs/core/:page(building-blocks|behaviors)",
        destination: "/docs/behaviors",
        permanent: true,
      },
      { source: "/docs/core/primitives", destination: "/docs/behaviors/define-a-primitive", permanent: true },
      {
        source: "/docs/:path(core/behaviors|behaviors|core/kernel)/state-and-events",
        destination: "/docs/behaviors/state-and-changes",
        permanent: true,
      },
      {
        source: "/docs/core/:folder(behaviors|kernel)/:rest*",
        destination: "/docs/behaviors/:rest*",
        permanent: true,
      },
      { source: "/docs/core/:rest*", destination: "/docs/behaviors/:rest*", permanent: true },
      // Where Primitives and Building Blocks were before Core had its section.
      {
        source: "/docs/:framework/utilities/primitives",
        destination: "/docs/behaviors/define-a-primitive",
        permanent: true,
      },
      {
        source: "/docs/:framework/utilities/building-blocks",
        destination: "/docs/behaviors",
        permanent: true,
      },
      // Building with an agent moved to each framework. Connect an Agent's pages
      // are the Agents section's own.
      {
        source: "/docs/agents/build-with-an-agent",
        destination: "/docs/build-with-an-agent",
        permanent: true,
      },
      {
        source: "/docs/agents/skills",
        destination: "/docs/build-with-an-agent#add-the-skill",
        permanent: true,
      },
      { source: "/docs/agents/create-agent", destination: "/docs/agents/connect-an-agent", permanent: true },
      {
        source: "/docs/agents/connect-an-agent/:rest+",
        destination: "/docs/agents/:rest+",
        permanent: true,
      },
      // Each framework's Primitives page became Rendering.
      {
        source: `/docs/:framework(${frameworks.join("|")})/primitives`,
        destination: "/docs/:framework/rendering",
        permanent: true,
      },
      { source: "/docs/primitives", destination: "/docs/rendering", permanent: true },
      // React's utilities are hooks.
      { source: "/docs/react/utilities/:rest*", destination: "/docs/react/hooks/:rest*", permanent: true },
      // Core and Agents were once a copy per framework.
      { source: "/docs/:framework/core.md", destination: "/docs/core.md", permanent: true },
      { source: "/docs/:framework/core/:page*", destination: "/docs/core/:page*", permanent: true },
      { source: "/docs/:framework/agents", destination: "/docs/agents", permanent: true },
    ]
  },
}

export default withMDX(config)
