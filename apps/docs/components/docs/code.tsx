import { cn } from "cn"
import { getHighlighter } from "fumadocs-core/highlight"
import type { ComponentProps } from "react"
import type { BundledLanguage } from "shiki"
import { CopyButton } from "./copy-button"
import { frame } from "./frame"

// The same themes as the MDX code fences, in lib/source.ts.
const themes = { light: "github-light-default", dark: "github-dark-default" } as const

// The `pre` that MDX code fences render, already highlighted by Shiki. A fence
// with `title="rating.ts"` gets a header with the file's name and icon, and the
// copy button sits in it.
function Pre({ className, style, title, icon, ...props }: ComponentProps<"pre"> & { icon?: string }) {
  return (
    <div data-code-frame="" className={cn("relative my-5 overflow-hidden", frame)}>
      {title && (
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5 font-mono text-xs text-muted-foreground">
          {icon && (
            <span aria-hidden className="[&_svg]:size-3.5" dangerouslySetInnerHTML={{ __html: icon }} />
          )}
          {title}
          <CopyButton className="-my-1.5 -me-2 ms-auto" />
        </div>
      )}
      {/* The inline padding sits on the code element: the pre is the scroll
          container, and the sticky line numbers pin at its content edge, so
          padding there would leave a strip of scrolled code uncovered. */}
      <pre
        {...props}
        style={{ ...style, backgroundColor: undefined }}
        className={cn(
          className,
          "max-h-[32rem] scrollbar-none overflow-auto py-3.5 font-mono text-[13px] leading-[1.7] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0 [&>code]:px-4 [&>code]:text-[1em]",
        )}
      />
      {!title && <CopyButton className="absolute top-2 end-2 bg-background" />}
    </div>
  )
}

// Highlighted code, by language and source, so a page renders it once.
// Shiki's HTML renders as one element: its tokens as JSX were thousands per
// page, each of which React tracks in development, and 30 examples took a
// page 6 s to render.
const highlighted = new Map<
  string,
  Promise<{ html: string; className: string; style: Record<string, string> }>
>()

async function toHtml(code: string, lang: BundledLanguage) {
  const highlighter = await getHighlighter("js", { langs: [lang], themes: [themes.light, themes.dark] })
  let className = ""
  let style: Record<string, string> = {}
  const html = highlighter.codeToHtml(code, {
    lang,
    themes,
    defaultColor: false,
    transformers: [
      {
        // The `pre` is the frame's own, so only its class and colors are kept.
        pre(node) {
          className = String(node.properties.class ?? "")
          style = Object.fromEntries(
            String(node.properties.style ?? "")
              .split(";")
              .filter(Boolean)
              .map((declaration) => declaration.split(":") as [string, string]),
          )
        },
      },
    ],
  })
  return { html: html.slice(html.indexOf(">") + 1, html.lastIndexOf("</pre>")), className, style }
}

// Highlights code on the server, for code that isn't in MDX.
async function CodeBlock({
  code,
  lang,
  title,
  className,
}: {
  code: string
  lang: BundledLanguage
  title?: string
  className?: string
}) {
  const key = `${lang}\n${code}`
  let result = highlighted.get(key)
  if (!result) {
    result = toHtml(code, lang)
    highlighted.set(key, result)
    // The most recent few hundred blocks, enough for a few pages in every framework.
    if (highlighted.size > 500) highlighted.delete(highlighted.keys().next().value!)
    result.catch(() => highlighted.delete(key))
  }
  const { html, className: shiki, style } = await result
  return (
    <Pre
      title={title}
      className={cn(shiki, className)}
      style={style}
      tabIndex={0}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export { CodeBlock, Pre }
