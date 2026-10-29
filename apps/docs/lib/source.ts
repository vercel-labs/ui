import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins"
import { loader } from "fumadocs-core/source"
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons"
import { metaSchema, pageSchema } from "fumadocs-core/source/schema"
import { applyMdxPreset } from "fumadocs-mdx/config"
import { defineDocs } from "fumadocs-mdx/macro"
import { highlightLines } from "./highlight-lines"
import { remarkInstall } from "./remark-install"
import { textBlocks } from "./text-blocks"

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    // The default GitHub themes' comments and strings miss 4.5:1 on our code frames.
    mdxOptions: applyMdxPreset({
      rehypeCodeOptions: {
        themes: { light: "github-light-default", dark: "github-dark-default" },
        // Fumadocs' own, for `// [!code highlight]`, `[!code ++]`, `[!code word:x]` and `[!code focus]`.
        transformers: [...(rehypeCodeDefaultOptions.transformers ?? []), highlightLines, textBlocks],
      },
      remarkPlugins: (plugins) => [remarkInstall, ...plugins],
      remarkNpmOptions: { persist: { id: "package-manager" } },
    }),
  },
  meta: { schema: metaSchema },
})

// Every page under /docs. Each top-level folder is a section with its own
// sidebar: Core and Agents, which no framework changes, and one per
// framework, like /docs/react/components/menu.
const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
})

export { source }
