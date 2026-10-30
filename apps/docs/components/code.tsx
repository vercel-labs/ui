import { cn } from "cn"
import { getHighlighter } from "fumadocs-core/highlight"
import type { ComponentProps } from "react"
import type { BundledLanguage } from "shiki"
import { CopyButton } from "./copy-button"
import { Frame } from "./frame"

const themes = { light: "github-light-default", dark: "github-dark-default" } as const

function Pre({ className, style, title, icon, ...props }: ComponentProps<"pre"> & { icon?: string }) {
  const prompt = "data-prompt" in props
  return (
    <Frame data-code-frame="" className="relative my-5 overflow-hidden">
      {title && (
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5 font-mono text-xs text-muted-foreground">
          {icon && (
            <span aria-hidden className="[&_svg]:size-3.5" dangerouslySetInnerHTML={{ __html: icon }} />
          )}
          {title}
          <CopyButton className="-my-1.5 -me-2 ms-auto" />
        </div>
      )}
      {!title && prompt && (
        <div
          data-prompt-bar=""
          className="flex items-center border-b border-border/60 px-4 py-2 text-[13px] text-subtle"
        >
          Prompt
          <CopyButton label="Copy prompt" className="-my-1 -me-2 ms-auto" />
        </div>
      )}
      <pre
        {...props}
        style={{ ...style, backgroundColor: undefined }}
        className={cn(
          className,
          "max-h-[32rem] scrollbar-none overflow-auto overscroll-x-none py-3.5 font-mono text-[13px] leading-[1.7] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 [&>code]:rounded-none [&>code]:bg-transparent [&>code]:text-[1em]",
        )}
      />
      {!title && !prompt && <CopyButton className="absolute top-2 end-2 bg-background" />}
    </Frame>
  )
}

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
