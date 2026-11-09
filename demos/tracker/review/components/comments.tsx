"use client"

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import { cn } from "cn"
import { MessageSquare, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState, useTransition } from "react"
import { addComment, removeComment } from "@/app/actions"
import type { Comment } from "@/lib/comments"
import type { Framework } from "@/lib/frameworks"

type Spot = {
  file: string
  line: number
  endLine?: number | null
  quote?: string | null
}

const authorKey = "review-author"

const card =
  "flex origin-(--transform-origin) flex-col rounded-xl bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/10 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none"

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

function lastLine(spot: { line: number | null; endLine?: number | null }) {
  return spot.endLine ?? spot.line
}

function sameRange(comment: Comment, spot: Spot) {
  return (
    comment.file === spot.file &&
    comment.line === spot.line &&
    (comment.endLine ?? null) === (spot.endLine ?? null)
  )
}

const quoteClass =
  "max-h-24 overflow-hidden rounded-md bg-muted px-2 py-1 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-muted-foreground"

function lines(comment: { line: number | null; endLine?: number | null }) {
  if (!comment.line) {
    return ""
  }
  return comment.endLine
    ? `:${comment.line}–${comment.endLine}`
    : `:${comment.line}`
}

function ago(date: string) {
  const minutes = Math.round((Date.now() - new Date(date).getTime()) / 60000)
  if (minutes < 1) {
    return "just now"
  }
  if (minutes < 60) {
    return `${minutes}m ago`
  }
  if (minutes < 60 * 24) {
    return `${Math.round(minutes / 60)}h ago`
  }
  return `${Math.round(minutes / 60 / 24)}d ago`
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[9px] font-semibold text-white">
      {initials(name) || "?"}
    </span>
  )
}

function useAuthor() {
  const [author, setAuthor] = useState("")
  const [asking, setAsking] = useState(false)

  useEffect(() => {
    let stored = ""
    try {
      stored = localStorage.getItem(authorKey) ?? ""
    } catch {}
    setAuthor(stored)
    setAsking(!stored)
  }, [])

  const change = (value: string) => {
    setAuthor(value)
    try {
      localStorage.setItem(authorKey, value.trim())
    } catch {}
  }

  return { author, asking, setAsking, change }
}

function Thread({ comments }: { comments: Comment[] }) {
  const [, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  return (
    <>
      {error && (
        <p role="alert" className="px-3 pt-2 text-[11px] text-red-600">
          {error}
        </p>
      )}
      <ul
        aria-label="Comments here"
        className="flex max-h-64 flex-col overflow-auto border-b border-border"
      >
        {comments.map((comment) => (
          <li key={comment.id} className="group flex gap-2 px-3 py-2.5">
            <Avatar name={comment.author} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-medium">{comment.author}</span>
                <span className="text-muted-foreground">
                  {ago(comment.createdAt)}
                </span>
                <button
                  type="button"
                  aria-label="Delete comment"
                  onClick={() =>
                    startTransition(async () =>
                      setError((await removeComment(comment.id)).error)
                    )
                  }
                  className="ms-auto flex size-5 items-center justify-center rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100"
                >
                  <Trash2 aria-hidden="true" className="size-3" />
                </button>
              </div>
              <p className="text-[13px] whitespace-pre-wrap">{comment.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

function CommentCard({
  spot,
  anchor,
  comments,
  framework,
  onClose,
}: {
  spot: Spot | null
  anchor: Element | null
  comments: Comment[]
  framework: Framework
  onClose: () => void
}) {
  const [body, setBody] = useState("")
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { author, asking, setAsking, change } = useAuthor()
  const authorInput = useRef<HTMLInputElement>(null)
  const thread = spot
    ? comments.filter((comment) => sameRange(comment, spot))
    : []
  const quote = spot?.quote ?? thread.find((comment) => comment.quote)?.quote

  const save = () => {
    if (!spot || !body.trim()) {
      return
    }
    if (!author.trim()) {
      authorInput.current?.focus()
      return
    }
    const path = new URLSearchParams(window.location.search).get("path") ?? "/"
    startTransition(async () => {
      const result = await addComment({
        framework,
        file: spot.file,
        line: spot.line,
        endLine: spot.endLine ?? null,
        quote: spot.quote ?? null,
        path,
        author,
        body,
      })
      setError(result.error)
      if (result.error) {
        return
      }
      setBody("")
      setAsking(false)
    })
  }

  return (
    <Popover
      open={spot !== null && anchor !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <PopoverContent
        anchor={anchor}
        side="bottom"
        align="start"
        sideOffset={2}
        alignOffset={56}
        initialFocus="[data-comment-input]"
        finalFocus="none"
        className={cn(card, "w-[min(24rem,calc(100vw-2rem))]")}
      >
        <div className="flex h-9 items-center gap-2 border-b border-border ps-3 pe-1.5">
          <PopoverTitle className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
            {spot && `${spot.file.split("/").pop()}${lines(spot)}`}
          </PopoverTitle>
          <PopoverClose
            aria-label="Close"
            className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X aria-hidden="true" className="size-3.5" />
          </PopoverClose>
        </div>
        {quote && <pre className={cn(quoteClass, "mx-3 mt-2")}>{quote}</pre>}
        {thread.length > 0 && <Thread comments={thread} />}
        <form
          className="flex flex-col gap-2 p-2"
          onSubmit={(event) => {
            event.preventDefault()
            save()
          }}
        >
          <textarea
            data-comment-input=""
            aria-label={thread.length > 0 ? "Reply" : "Comment"}
            placeholder={thread.length > 0 ? "Reply" : "Add a comment"}
            value={body}
            rows={2}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                save()
              }
            }}
            className="w-full resize-none rounded-md bg-muted px-2 py-1.5 text-[13px] outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <div className="flex items-center gap-2">
            {asking ? (
              <input
                ref={authorInput}
                aria-label="Your name"
                placeholder="Your name"
                required
                value={author}
                onChange={(event) => change(event.target.value)}
                className="h-6 w-32 min-w-0 rounded-md bg-muted px-2 text-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            ) : (
              author && (
                <span className="min-w-0 truncate text-[11px] text-muted-foreground">
                  as{" "}
                  <span className="font-medium text-foreground">{author}</span>
                  {" · "}
                  <button
                    type="button"
                    onClick={() => {
                      setAsking(true)
                      requestAnimationFrame(() => authorInput.current?.select())
                    }}
                    className="underline-offset-2 hover:text-foreground hover:underline"
                  >
                    change
                  </button>
                </span>
              )
            )}
            <span className="ms-auto text-[11px] text-muted-foreground">
              ⌘↩
            </span>
            <button
              type="submit"
              disabled={pending || !body.trim() || !author.trim()}
              className="rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background disabled:opacity-40"
            >
              {thread.length > 0 ? "Reply" : "Comment"}
            </button>
          </div>
          {error && (
            <p role="alert" className="text-[11px] text-red-600">
              {error}
            </p>
          )}
        </form>
      </PopoverContent>
    </Popover>
  )
}

function CommentPins({
  code,
  html,
  file,
  comments,
  onPick,
}: {
  code: HTMLElement | null
  html: string | undefined
  file: string
  comments: Comment[]
  onPick: (spot: Spot) => void
}) {
  const [pins, setPins] = useState<
    {
      key: string
      spot: Spot
      top: number
      height: number
      thread: Comment[]
    }[]
  >([])

  useEffect(() => {
    if (!code) {
      return
    }
    const measure = () => {
      const byRange = new Map<string, { spot: Spot; thread: Comment[] }>()
      for (const comment of comments) {
        if (comment.file !== file || !comment.line) {
          continue
        }
        const key = `${comment.line}-${lastLine(comment)}`
        const group = byRange.get(key) ?? {
          spot: { file, line: comment.line, endLine: comment.endLine ?? null },
          thread: [],
        }
        group.thread.push(comment)
        byRange.set(key, group)
      }
      const box = code.getBoundingClientRect()
      const next = []
      for (const [key, { spot, thread }] of byRange) {
        const row = code.querySelector(`[data-line="${lastLine(spot)}"]`)
        if (!row) {
          continue
        }
        const rect = row.getBoundingClientRect()
        next.push({
          key,
          spot,
          top: rect.top - box.top + code.scrollTop,
          height: rect.height,
          thread,
        })
      }
      setPins(next)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(code)
    return () => observer.disconnect()
  }, [code, html, file, comments])

  return pins.map((pin) => (
    <button
      key={pin.key}
      type="button"
      aria-label={`${pin.thread.length} ${pin.thread.length === 1 ? "comment" : "comments"} on ${pin.spot.endLine ? `lines ${pin.spot.line}–${pin.spot.endLine}` : `line ${pin.spot.line}`}`}
      onClick={() => onPick(pin.spot)}
      style={{ top: pin.top, height: pin.height }}
      className="absolute start-1 z-10 flex items-center"
    >
      <span className="flex h-4 min-w-4 items-center justify-center rounded-full rounded-bl-none bg-blue-500 px-1 text-[9px] leading-none font-semibold text-white shadow-sm ring-2 ring-background">
        {pin.thread.length > 1
          ? pin.thread.length
          : initials(pin.thread[0]?.author ?? "") || "?"}
      </span>
    </button>
  ))
}

function CommentsMenu({
  comments,
  onPick,
}: {
  comments: Comment[]
  onPick: (spot: Spot) => void
}) {
  return (
    <Popover>
      <PopoverTrigger className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground data-open:bg-muted data-open:text-foreground">
        <MessageSquare aria-hidden="true" className="size-3.5" />
        {comments.length}
        <span className="sr-only">comments</span>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={4}
        className={cn(card, "max-h-96 w-80 overflow-auto")}
      >
        <PopoverTitle className="border-b border-border px-3 py-2 text-xs font-medium">
          Comments
        </PopoverTitle>
        {comments.length === 0 ? (
          <p className="px-3 py-3 text-[13px] text-muted-foreground">
            No comments yet. Highlight code or click a line number to add one.
          </p>
        ) : (
          <ul className="flex flex-col py-1">
            {comments.map((comment) => (
              <li key={comment.id}>
                <PopoverClose
                  onClick={() =>
                    onPick({
                      file: comment.file,
                      line: comment.line ?? 1,
                      endLine: comment.endLine ?? null,
                    })
                  }
                  className="flex w-full gap-2 px-3 py-2 text-start hover:bg-muted"
                >
                  <Avatar name={comment.author} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11px] text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {comment.author}
                      </span>
                      <span className="font-mono">
                        {" · "}
                        {comment.file.split("/").pop()}
                        {lines(comment)}
                      </span>
                    </span>
                    {comment.quote && (
                      <span
                        className={cn(
                          quoteClass,
                          "my-1 line-clamp-2 block max-h-none"
                        )}
                      >
                        {comment.quote}
                      </span>
                    )}
                    <span className="line-clamp-2 block text-[13px]">
                      {comment.body}
                    </span>
                  </span>
                </PopoverClose>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}

export { CommentCard, CommentPins, CommentsMenu, lastLine }
export type { Spot }
