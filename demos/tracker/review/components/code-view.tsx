"use client"

import { cn } from "cn"
import { ChevronRight, ExternalLink, MessageSquarePlus } from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import { CommentCard, CommentPins, CommentsMenu, lastLine, type Spot } from "@/components/comments"
import type { Comment } from "@/lib/comments"
import type { Framework } from "@/lib/frameworks"
import type { Frame, Inspection } from "@/lib/inspect"

const repository = "https://github.com/vercel-labs/ui/blob/main"

type Selected = { line: number; endLine: number | null; quote: string; top: number; left: number }

function lineOf(node: Node) {
  return (node instanceof Element ? node : node.parentElement)?.closest<HTMLElement>(".line") ?? null
}

function rangeText(code: HTMLElement, from: number, to: number) {
  const rows = []
  for (let line = from; line <= to; line++)
    rows.push(code.querySelector<HTMLElement>(`[data-line="${line}"]`)?.textContent ?? "")
  return rows.join("\n")
}

function readSelection(code: HTMLElement): Selected | null {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  if (!code.contains(range.commonAncestorContainer)) return null
  const start = lineOf(range.startContainer)
  const end = lineOf(range.endContainer)
  const quote = selection.toString().trim()
  if (!start || !end || !quote) return null
  const line = Number(start.dataset.line)
  let last = Number(end.dataset.line)
  // A triple click ends the range at the start of the next line.
  if (last > line && range.endOffset === 0) last -= 1
  const rects = range.getClientRects()
  const rect = rects[rects.length - 1] ?? range.getBoundingClientRect()
  const box = code.getBoundingClientRect()
  return {
    line,
    endLine: last > line ? last : null,
    quote: quote.slice(0, 2000),
    top: rect.bottom - box.top + code.scrollTop + 4,
    left: Math.max(rect.right - box.left + code.scrollLeft - 24, 56),
  }
}

function Trail({
  inspection,
  file,
  onOpen,
}: {
  inspection: Inspection
  file: string
  onOpen: (frame: Frame) => void
}) {
  const frames = [...inspection.frames].reverse()
  const chip = (frame: Frame, key: string) => (
    <button
      key={key}
      type="button"
      onClick={() => onOpen(frame)}
      title={`${frame.file}:${frame.line}`}
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[11px] hover:bg-muted",
        frame.file === file ? "bg-muted text-foreground" : "text-muted-foreground",
      )}
    >
      <span className="text-foreground/70">{frame.label}</span>
      <span>
        {frame.file.split("/").pop()}:{frame.line}
      </span>
    </button>
  )
  return (
    <div className="flex shrink-0 flex-col gap-1 border-b border-border bg-muted/30 px-2 py-1.5">
      <div className="flex items-center gap-0.5 overflow-x-auto">
        <span className="me-1 shrink-0 text-[11px] text-muted-foreground">Rendered by</span>
        {frames.length === 0 && (
          <span className="text-[11px] text-muted-foreground">no source locations in this framework yet</span>
        )}
        {frames.map((frame, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <ChevronRight aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
            )}
            {chip(frame, `frame-${index}`)}
          </Fragment>
        ))}
      </div>
      {inspection.part && (
        <div className="flex items-center gap-0.5 overflow-x-auto">
          <span className="me-1 shrink-0 text-[11px] text-muted-foreground">Part</span>
          <span className="me-1 shrink-0 rounded-md bg-background px-1.5 py-0.5 font-mono text-[11px] ring-1 ring-border">
            {inspection.part}
          </span>
          {inspection.library.map((frame, index) => chip(frame, `library-${index}`))}
        </div>
      )}
    </div>
  )
}

function CodeView({
  source,
  framework,
  file,
  comments,
  line,
  inspection,
  onOpen,
  onLine,
}: {
  source: { path: string; html: string } | null
  framework: Framework
  file: string
  comments: Comment[]
  line: number | null
  inspection: Inspection | null
  onOpen: (frame: Frame) => void
  onLine: (line: number) => void
}) {
  const [code, setCode] = useState<HTMLDivElement | null>(null)
  const [spot, setSpot] = useState<Spot | null>(null)
  const [anchor, setAnchor] = useState<Element | null>(null)
  const [shownFile, setShownFile] = useState(file)
  const [selected, setSelected] = useState<Selected | null>(null)

  if (shownFile !== file) {
    setShownFile(file)
    if (spot && spot.file !== file) setSpot(null)
  }

  const pick = (next: Spot) => {
    if (next.file !== file) onOpen({ file: next.file, line: next.line, label: "comment" })
    else if (!next.endLine) onLine(next.line)
    setSpot(next)
  }

  useEffect(() => {
    if (!code) return
    for (const selected of code.querySelectorAll(".line.selected")) selected.classList.remove("selected")
    const target = line ? code.querySelector(`[data-line="${line}"]`) : null
    target?.classList.add("selected")
    if (target) target.scrollIntoView({ block: "center" })
    else code.scrollTop = 0
  }, [code, source, line])

  useEffect(() => {
    if (!code) return
    for (const marked of code.querySelectorAll(".line.commented")) marked.classList.remove("commented")
    for (const comment of comments) {
      if (comment.file !== file || !comment.line) continue
      code.querySelector(`[data-line="${comment.line}"]`)?.classList.add("commented")
    }
  }, [code, source, file, comments])

  useEffect(() => {
    if (!code || !spot || spot.file !== file) return setAnchor(null)
    setAnchor(code.querySelector(`[data-line="${lastLine(spot)}"]`))
    if (!spot.endLine) return
    const rows: (Element | null)[] = []
    for (let row = spot.line; row <= spot.endLine; row++)
      rows.push(code.querySelector(`[data-line="${row}"]`))
    for (const row of rows) row?.classList.add("ranged")
    return () => {
      for (const row of rows) row?.classList.remove("ranged")
    }
  }, [code, source, file, spot])

  useEffect(() => {
    if (!code) return
    const read = () => setSelected(readSelection(code))
    const clear = () => {
      if (window.getSelection()?.isCollapsed) setSelected(null)
    }
    code.addEventListener("pointerup", read)
    code.addEventListener("keyup", read)
    document.addEventListener("selectionchange", clear)
    return () => {
      code.removeEventListener("pointerup", read)
      code.removeEventListener("keyup", read)
      document.removeEventListener("selectionchange", clear)
    }
  }, [code])

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
          {source?.path ?? file}
        </span>
        <CommentsMenu comments={comments} onPick={pick} />
        {source && (
          <a
            href={`${repository}/${source.path}${line ? `#L${line}` : ""}`}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            GitHub <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        )}
      </div>
      {inspection && <Trail inspection={inspection} file={file} onOpen={onOpen} />}
      <div
        ref={setCode}
        className="code relative min-h-0 flex-1 overflow-auto"
        onClick={(event) => {
          const target = event.target as HTMLElement
          const row = target.closest<HTMLElement>(".line")
          if (!row || target !== row || event.nativeEvent.offsetX >= 56) return
          const clicked = Number(row.dataset.line)
          if (!event.shiftKey || !line || line === clicked) return pick({ file, line: clicked })
          const from = Math.min(line, clicked)
          const to = Math.max(line, clicked)
          window.getSelection()?.removeAllRanges()
          pick({
            file,
            line: from,
            endLine: to,
            quote: rangeText(event.currentTarget, from, to).slice(0, 2000),
          })
        }}
      >
        {selected && (
          <button
            type="button"
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => {
              window.getSelection()?.removeAllRanges()
              setSelected(null)
              pick({ file, line: selected.line, endLine: selected.endLine, quote: selected.quote })
            }}
            style={{ top: selected.top, left: selected.left }}
            className="absolute z-20 flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-md"
          >
            <MessageSquarePlus aria-hidden="true" className="size-3.5" />
            Comment
          </button>
        )}
        <CommentPins code={code} html={source?.html} file={file} comments={comments} onPick={pick} />
        {source ? (
          <div dangerouslySetInnerHTML={{ __html: source.html }} />
        ) : (
          <p className="p-4 text-muted-foreground">Pick a file from the tree.</p>
        )}
      </div>
      <CommentCard
        spot={spot}
        anchor={anchor}
        comments={comments}
        framework={framework}
        onClose={() => setSpot(null)}
      />
    </div>
  )
}

export { CodeView }
