import { pageDate } from "@/lib/page-date"
import { source } from "@/lib/source"
import Link from "next/link"

function ChangelogPosts() {
  const posts = source
    .getPages()
    .flatMap((page) =>
      page.slugs.length === 3 && page.slugs[0] === "core" && page.slugs[1] === "changelog" && page.data.date
        ? [{ ...page, date: page.data.date }]
        : [],
    )
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <ul className="my-8 flex flex-col gap-8">
      {posts.map((post) => (
        <li key={post.url} className="flex flex-col gap-1.5">
          <time dateTime={post.date} className="text-[13px] text-subtle">
            {pageDate(post.date)}
          </time>
          <Link
            href={post.url}
            className="w-fit rounded-md text-lg font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            {post.data.title}
          </Link>
          <p className="text-[17px] leading-relaxed text-pretty text-subtle sm:text-[15px]">
            {post.data.description}
          </p>
        </li>
      ))}
    </ul>
  )
}

export { ChangelogPosts }
