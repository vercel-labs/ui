"use client"

import { Resizable, ResizableHandle, ResizablePanel } from "@ui-sdk/react/resizable"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import { CodeView } from "@/components/code-view"
import { FileTree } from "@/components/file-tree"
import { FrameworkPicker } from "@/components/framework-picker"
import { DocsLink, HowToReview } from "@/components/how-to-review"
import { Logo, VercelLogo } from "@/components/logo"
import { Preview } from "@/components/preview"
import type { Comment } from "@/lib/comments"
import type { Root } from "@/lib/files"
import type { Framework } from "@/lib/frameworks"
import type { Frame, Inspection } from "@/lib/inspect"

function Handle() {
  return (
    <ResizableHandle className="relative w-px shrink-0 bg-border outline-none after:absolute after:inset-y-0 after:-inset-x-1 focus-visible:bg-ring data-dragging:bg-ring data-hovered:bg-ring" />
  )
}

function Review({
  framework,
  available,
  roots,
  files,
  file,
  comments,
  source,
}: {
  framework: Framework
  available: Framework[]
  roots: Root[]
  files: string[]
  file: string
  comments: Comment[]
  source: { path: string; html: string } | null
}) {
  const router = useRouter()
  const params = useSearchParams()
  const line = Number(params.get("line")) || null
  const [initialPath] = useState(() => params.get("path") ?? "/")
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const known = useMemo(() => new Set(files), [files])

  const url = useCallback((changes: Record<string, string | null>) => {
    const next = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) next.delete(key)
      else next.set(key, value)
    }
    return `?${next}`
  }, [])

  const open = useCallback(
    (frame: Frame) => router.push(url({ file: frame.file, line: String(frame.line) }), { scroll: false }),
    [router, url],
  )

  const onInspect = useCallback(
    (next: Inspection) => {
      setInspection(next)
      const first =
        next.frames.find((frame) => frame.file.startsWith("app/")) ?? next.frames[0] ?? next.library[0]
      if (first) open(first)
    },
    [open],
  )

  const onNavigate = useCallback(
    (path: string) => window.history.replaceState(null, "", url({ path })),
    [url],
  )

  return (
    <>
      <header className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-4">
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Vercel"
            className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <VercelLogo className="h-5 w-auto" />
          </a>
          <span aria-hidden className="text-lg font-light text-foreground/20">
            /
          </span>
          <span role="img" aria-label="UI SDK" className="shrink-0">
            <Logo className="h-5 w-auto" />
          </span>
          <span aria-hidden className="text-lg font-light text-foreground/20">
            /
          </span>
          <FrameworkPicker framework={framework} available={available} />
        </div>
        <div className="ms-auto flex items-center gap-5">
          <HowToReview framework={framework} />
          <DocsLink framework={framework} />
        </div>
      </header>
      <Resizable id="review" className="flex min-h-0 flex-1">
        <ResizablePanel defaultSize={18} minSize={10} className="min-w-0 overflow-auto">
          <FileTree
            roots={roots}
            files={files}
            file={file}
            onOpen={(next) => router.push(url({ file: next, line: null }), { scroll: false })}
          />
        </ResizablePanel>
        <Handle />
        <ResizablePanel defaultSize={41} minSize={20} className="min-w-0">
          <CodeView
            source={source}
            framework={framework}
            file={file}
            comments={comments}
            line={line}
            inspection={inspection}
            onOpen={open}
            onLine={(next) => window.history.replaceState(null, "", url({ line: String(next) }))}
          />
        </ResizablePanel>
        <Handle />
        <ResizablePanel defaultSize={41} minSize={20} className="min-w-0">
          <Preview
            key={framework}
            framework={framework}
            initialPath={initialPath}
            roots={roots}
            files={known}
            onNavigate={onNavigate}
            onInspect={onInspect}
          />
        </ResizablePanel>
      </Resizable>
    </>
  )
}

export { Review }
