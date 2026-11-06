import { cn } from "cn"
import { getHighlighter } from "fumadocs-core/highlight"
import { CheckIcon, XIcon } from "lucide-react"
import type { ComponentProps } from "react"
import type { BundledLanguage } from "shiki"
import { CopyButton } from "./copy-button"
import { Frame } from "./frame"

const themes = { light: "github-light-default", dark: "github-dark-default" } as const

// Code blocks titled Do or Don't show a check or a cross instead of the language icon.
const marks: Record<string, typeof CheckIcon> = { Do: CheckIcon, "Don't": XIcon }

function Pre({
  className,
  style,
  title,
  icon,
  copy = true,
  ...props
}: ComponentProps<"pre"> & { icon?: string; copy?: boolean }) {
  const prompt = "data-prompt" in props
  const Mark = typeof title === "string" ? marks[title] : undefined
  return (
    <Frame data-code-frame="" className="relative my-5 overflow-hidden">
      {title && (
        <div className="flex items-center gap-2 border-b border-border/60 p-frame ps-4 font-mono text-xs text-muted-foreground">
          {Mark ? (
            <Mark aria-hidden className="size-3.5" />
          ) : (
            icon && (
              <span aria-hidden className="[&_svg]:size-3.5" dangerouslySetInnerHTML={{ __html: icon }} />
            )
          )}
          {title}
          <CopyButton className="ms-auto" />
        </div>
      )}
      {!title && prompt && (
        <div
          data-prompt-bar=""
          className="flex items-center border-b border-border/60 p-frame ps-4 text-[14px] text-subtle sm:text-[13px]"
        >
          Prompt
          <CopyButton label="Copy prompt" className="ms-auto" />
        </div>
      )}
      <pre
        {...props}
        style={{ ...style, backgroundColor: undefined }}
        className={cn(
          className,
          "max-h-[calc(20lh+0.875rem)] scrollbar-none overflow-auto overscroll-x-none py-3.5 font-mono text-[14px] leading-[1.7] sm:text-[13px] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 [&>code]:rounded-none [&>code]:bg-transparent [&>code]:text-[1em]",
        )}
      />
      {!title && !prompt && copy && (
        <div
          data-copy-float=""
          className="absolute top-0 end-0 ps-4 pt-frame pe-frame bg-[linear-gradient(to_right,transparent,var(--gutter-bg)_1rem)] rtl:bg-[linear-gradient(to_left,transparent,var(--gutter-bg)_1rem)]"
        >
          <CopyButton />
        </div>
      )}
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
  copy,
}: {
  code: string
  lang: BundledLanguage
  title?: string
  className?: string
  copy?: boolean
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
      copy={copy}
      className={cn(shiki, className)}
      style={style}
      tabIndex={0}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export { CodeBlock, Pre }
