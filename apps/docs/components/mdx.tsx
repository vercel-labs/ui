import { cn } from "cn"
import type { Framework } from "@/lib/frameworks"
import type { MDXComponents } from "mdx/types"
import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { ComponentExample } from "./component-example"
import { CoreEntries, CoreExports } from "./core-reference"
import { CssVariables, DataAttributes } from "./data-attributes"
import { Pre } from "./code"
import { Collapsible } from "./collapsible"
import { Card, ComponentGrid } from "./component-grid"
import { Frame } from "./frame"
import { FrameworkContent, FrameworkLink } from "./site-preferences"
import {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  StyleTabs,
  FrameworkTabs,
} from "./code-tabs"
import { SpecList } from "./spec-list"
import { ControllerTable, ReasonTable, StateTable, TypeTable } from "./type-tables"

// A heading that links to itself. The hairline after an h2 marks the start of a section.
function heading(Tag: "h2" | "h3" | "h4", className: string) {
  return function Heading({ id, children, className: _, ...props }: ComponentProps<"h2">) {
    return (
      <Tag id={id} className={cn("group scroll-mt-20 text-foreground", className)} {...props}>
        {id ? (
          <a
            href={`#${id}`}
            className="outline-none focus-visible:underline focus-visible:underline-offset-4"
          >
            {children}
          </a>
        ) : (
          children
        )}
      </Tag>
    )
  }
}

function InlineCode(props: ComponentProps<"code">) {
  return (
    <code
      className="rounded-md bg-foreground/[0.055] px-[0.3em] py-[0.15em] font-mono text-[0.85em] text-foreground"
      {...props}
    />
  )
}

// Every element MDX renders, styled here instead of with a prose plugin.
// `framework` is the section's, for tables and examples that differ by
// framework. Core and Agents pages have none.
function getMDXComponents(
  framework: Framework = "react",
  resolve: (href: string) => string = (href) => href,
) {
  return {
    h2: heading(
      "h2",
      "mt-14 mb-4 flex items-center gap-4 text-lg leading-snug font-medium tracking-[-0.01em] after:h-px after:flex-1 after:bg-border/70",
    ),
    h3: heading("h3", "mt-10 mb-3 text-[15px] leading-snug font-medium"),
    h4: heading("h4", "mt-8 mb-2 text-sm font-medium"),
    p: (props) => <p className="my-4 text-[15px] leading-[1.65] text-foreground/75" {...props} />,
    a: ({ href = "", ...props }) => {
      const url = resolve(href)
      const className =
        "font-normal text-foreground underline decoration-foreground/25 underline-offset-[3px] transition-colors hover:decoration-foreground"
      if (/^\/docs\/(components|utilities|rendering|server-rendering)\b/.test(url))
        return <FrameworkLink href={url} className={className} {...props} />
      return url.startsWith("/") || url.startsWith("#") ? (
        <Link href={url} className={className} {...props} />
      ) : (
        <a href={url} className={className} target="_blank" rel="noreferrer" {...props} />
      )
    },
    strong: (props) => <strong className="font-medium text-foreground" {...props} />,
    ul: (props) => (
      <ul
        className="my-4 flex list-disc flex-col gap-1.5 ps-5 text-[15px] leading-[1.65] text-foreground/75 marker:text-foreground/25"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="my-4 flex list-decimal flex-col gap-1.5 ps-5 text-[15px] leading-[1.65] text-foreground/75 marker:text-foreground/40"
        {...props}
      />
    ),
    li: (props) => <li className="ps-1 [&>p]:my-0" {...props} />,
    code: InlineCode,
    pre: Pre,
    CodeBlockTabs,
    CodeBlockTabsList,
    CodeBlockTabsTrigger,
    StyleTabs,
    CodeBlockTab,
    FrameworkTabs,
    FrameworkTab: CodeBlockTab,
    FrameworkContent,
    Collapsible,
    Callout: ({ children }: { children: ReactNode }) => (
      <Frame
        variant="flat"
        role="note"
        className="my-6 overflow-hidden px-4 py-3 [&>p]:my-0 [&>ul]:mt-1.5 [&>ul]:mb-0 [&>ul]:gap-0.5"
      >
        {children}
      </Frame>
    ),
    blockquote: (props) => (
      <blockquote
        className="my-5 border-s-2 border-foreground/15 ps-4 text-foreground/70 [&>p]:my-2"
        {...props}
      />
    ),
    hr: () => <hr className="my-10 border-border/70" />,
    table: (props) => (
      <Frame variant="flat" className="my-6 overflow-x-auto">
        <table
          className="w-full border-collapse text-start text-sm [&_tr:last-child>td]:border-0"
          {...props}
        />
      </Frame>
    ),
    th: (props) => (
      <th
        className="border-b border-border/70 px-4 py-2.5 text-start align-bottom text-[13px] font-normal whitespace-nowrap text-subtle"
        {...props}
      />
    ),
    td: (props) => (
      <td
        className="border-b border-border/60 px-4 py-2.5 align-top text-foreground/80 [&_code]:whitespace-nowrap"
        {...props}
      />
    ),
    // A table cell's value where we win, filling the cell as on the why page.
    Won: ({ children }: { children: ReactNode }) => (
      <span className="-mx-4 -my-2.5 block bg-green-500/10 px-4 py-2.5 font-semibold text-green-800 dark:text-green-300">
        {children}
      </span>
    ),
    img: (props) => <img className="my-6 rounded-2xl" alt="" {...props} />,
    Cards: ({ children }: { children: ReactNode }) => (
      <div className="my-6 grid gap-3 sm:grid-cols-2">{children}</div>
    ),
    Card: (props: { title: string; description?: string; href: string }) => (
      <Card {...props} href={resolve(props.href)} />
    ),
    ComponentGrid: () => <ComponentGrid framework={framework} />,
    ComponentExample: (props: {
      name: string
      caption?: string
      hideCode?: boolean
      hideTabs?: boolean
      compact?: boolean
    }) => <ComponentExample {...props} framework={framework} />,
    SpecList,
    DataAttributes: (props: { component?: string; part?: string }) => (
      <DataAttributes {...props} framework={framework} />
    ),
    CssVariables: (props: { component?: string; part: string }) => (
      <CssVariables {...props} framework={framework} />
    ),
    StateTable,
    ReasonTable,
    ControllerTable,
    CoreExports,
    CoreEntries,
    TypeTable: (props: {
      path: string
      name: string
      events?: boolean
      examples?: Record<string, string>
      type?: string
      types?: Record<string, string>
    }) => <TypeTable {...props} framework={framework} />,
  } satisfies MDXComponents
}

const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}

export { getMDXComponents, useMDXComponents }
