import { Review } from "@/components/review"
import { availableFrameworks, frameworks } from "@/lib/frameworks"
import { store } from "@/lib/comments"
import { listFiles, readSource } from "@/lib/files"
import { highlight } from "@/lib/highlight"

type SearchParams = Record<string, string | string[] | undefined>

async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const available = availableFrameworks()
  const framework = available.find((name) => name === params.fw) ?? available[0] ?? "svelte"
  const file = typeof params.file === "string" ? params.file : frameworks[framework].start
  const [{ roots, files }, source, comments] = await Promise.all([
    listFiles(framework),
    readSource(framework, file),
    store?.read() ?? [],
  ])

  return (
    <Review
      framework={framework}
      available={available}
      roots={roots}
      files={files}
      file={file}
      comments={comments.filter((comment) => comment.framework === framework)}
      source={source && { path: source.repoPath, html: await highlight(source.code, file) }}
    />
  )
}

export default Page
