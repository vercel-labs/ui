import type { Framework } from "@/lib/frameworks"
import { source } from "@/lib/source"
import Link from "next/link"

function Card({ title, description, href }: { title: string; description?: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-2xl bg-background p-4 text-sm shadow-[0_1px_1px_rgb(0_0_0/0.03),0_4px_6px_-3px_rgb(0_0_0/0.04)] ring-1 ring-foreground/[0.06] outline-none transition-shadow hover:ring-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/30 dark:bg-foreground/[0.03] dark:ring-foreground/10 dark:hover:ring-foreground/20"
    >
      <span className="font-medium text-foreground">{title}</span>
      {description && <span className="line-clamp-2 leading-relaxed text-subtle">{description}</span>}
    </Link>
  )
}

function ComponentGrid({ framework }: { framework: Framework }) {
  const pages = source
    .getPages()
    .filter(
      (page) => page.slugs.length === 3 && page.slugs[0] === framework && page.slugs[1] === "components",
    )
    .sort((a, b) => a.data.title.localeCompare(b.data.title))

  return (
    <div className="my-8 grid gap-3 sm:grid-cols-2">
      {pages.map((page) => (
        <Card key={page.url} title={page.data.title} description={page.data.description} href={page.url} />
      ))}
    </div>
  )
}

export { Card, ComponentGrid }
