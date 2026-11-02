import * as React from "react"
import { bindDrag, dragThreshold } from "@ui-sdk/core"
import { scrubTo } from "@ui-sdk/core/number"

const initial = [
  { id: 1, title: "Event created", body: "Design review, Friday at 10:00" },
  { id: 2, title: "Invite sent", body: "Ada and Grace can now edit" },
  { id: 3, title: "Upload finished", body: "launch-video.mp4 is ready" },
]

type Toast = (typeof initial)[number]

function SwipeToast({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [offset, setOffset] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const [dismissing, setDismissing] = React.useState(false)
  const stop = React.useRef<(() => void) | undefined>(undefined)
  React.useEffect(() => () => stop.current?.(), [])

  const dismiss = (side: number, width: number) => {
    setOffset(side * width)
    setTimeout(onDismiss, 200)
  }

  const pointerdown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as Element).closest("button")) return
    const width = event.currentTarget.offsetWidth
    const keeps = { min: -width, max: width, step: 1, snap: { points: [0], threshold: width * 0.3 } }
    const startX = event.clientX
    let moved = 0
    stop.current?.()
    stop.current = bindDrag(event.currentTarget, event.nativeEvent, {
      threshold: dragThreshold,
      cancelOnEscape: true,
      onStart: () => setDragging(true),
      onMove: ({ x }) => {
        moved = x - startX
        setOffset(moved)
        setDismissing(scrubTo(moved, keeps).point === undefined)
      },
      onEnd: (_end, canceled) => {
        stop.current = undefined
        setDragging(false)
        setDismissing(false)
        if (!canceled && scrubTo(moved, keeps).point === undefined) dismiss(Math.sign(moved), width)
        else setOffset(0)
      },
    })
  }

  return (
    <li className="relative overflow-hidden rounded-lg">
      <div
        aria-hidden
        data-dismissing={dismissing || undefined}
        className="absolute inset-y-0 flex items-center justify-center overflow-hidden bg-muted text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors duration-150 data-dismissing:bg-red-500 data-dismissing:text-white"
        style={{
          [offset < 0 ? "right" : "left"]: 0,
          width: Math.abs(offset),
          visibility: dragging ? "visible" : "hidden",
        }}
      >
        {dismissing ? "Release to dismiss" : "Dismiss"}
      </div>
      <div
        data-dragging={dragging || undefined}
        onPointerDown={pointerdown}
        className="relative flex cursor-grab touch-pan-y items-start justify-between gap-3 rounded-lg border border-border bg-background p-3 shadow-sm transition-[translate] duration-200 select-none data-dragging:cursor-grabbing data-dragging:transition-none"
        style={{ translate: `${offset}px 0` }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{toast.title}</span>
          <span className="text-muted-foreground">{toast.body}</span>
        </div>
        <button
          type="button"
          aria-label={`Dismiss ${toast.title}`}
          onClick={(event) => dismiss(1, event.currentTarget.parentElement!.offsetWidth)}
          className="rounded-md px-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          ×
        </button>
      </div>
    </li>
  )
}

function Example() {
  const [toasts, setToasts] = React.useState(initial)
  return (
    <div className="flex w-80 flex-col gap-3 text-sm">
      <ul aria-label="Notifications" className="m-0 flex min-h-48 list-none flex-col gap-2 p-0">
        {toasts.map((toast) => (
          <SwipeToast
            key={toast.id}
            toast={toast}
            onDismiss={() => setToasts((current) => current.filter((candidate) => candidate.id !== toast.id))}
          />
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setToasts(initial)}
        disabled={toasts.length === initial.length}
        className="self-start rounded-md border border-border px-2.5 py-1 hover:bg-muted disabled:opacity-50"
      >
        Show all again
      </button>
    </div>
  )
}

export { Example }
