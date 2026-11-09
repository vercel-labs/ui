import type { Framework } from "@/lib/frameworks"
import { source } from "@/lib/source"
import Link from "next/link"

function Card({
  title,
  description,
  href,
}: {
  title: string
  description?: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-2xl bg-background p-4 text-[15px] sm:text-sm ring-1 ring-foreground/15 outline-none transition-shadow hover:ring-foreground/15 focus-visible:ring-3 focus-visible:ring-ring/30 dark:bg-foreground/[0.03] dark:ring-foreground/10 dark:hover:ring-foreground/20"
    >
      <span className="font-medium text-foreground">{title}</span>
      {description && (
        <span className="leading-relaxed text-subtle sm:line-clamp-2">
          {description}
        </span>
      )}
    </Link>
  )
}

function ComponentGrid({ framework }: { framework: Framework }) {
  const pages = source
    .getPages()
    .filter(
      (page) =>
        page.slugs.length === 3 &&
        page.slugs[0] === framework &&
        page.slugs[1] === "components"
    )
    .sort((a, b) => a.data.title.localeCompare(b.data.title))

  return (
    <div className="my-8 grid gap-3 sm:grid-cols-2">
      {pages.map((page) => (
        <Card
          key={page.url}
          title={page.data.title}
          description={page.data.description}
          href={page.url}
        />
      ))}
    </div>
  )
}

// A few components by name, like `names="select dialog"`. Their links name no framework,
// so they go to the one the reader last read.
function ComponentCards({
  names,
  framework,
}: {
  names: string
  framework: Framework
}) {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2">
      {names.split(" ").map((name) => {
        const page = source.getPage([framework, "components", name])
        if (!page) {
          return null
        }
        return (
          <Card
            key={name}
            title={page.data.title}
            description={page.data.description}
            href={`/docs/components/${name}`}
          />
        )
      })}
    </div>
  )
}

export { Card, ComponentCards, ComponentGrid }
