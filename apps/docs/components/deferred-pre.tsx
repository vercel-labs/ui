"use client"

import * as React from "react"

const noSubscribe = () => () => {}

const waiting = new Set<() => void>()
let scheduled = false

// Fills waiting code blocks a few at a time while the browser is idle, so a long
// page's code doesn't arrive in one frame that holds up a scroll or a click.
function fillWhenIdle() {
  if (scheduled) {
    return
  }
  scheduled = true
  const run = (deadline?: IdleDeadline) => {
    scheduled = false
    for (const fill of waiting) {
      fill()
      if (!deadline || deadline.timeRemaining() < 4) {
        break
      }
    }
    if (waiting.size > 0) {
      fillWhenIdle()
    }
  }
  if ("requestIdleCallback" in window) {
    requestIdleCallback(run)
  } else {
    setTimeout(run)
  }
}

// A code block hidden behind a tab. The server's HTML has its code. A page the router
// renders fills it after it paints, or as soon as its example is touched.
function DeferredPre({
  dangerouslySetInnerHTML,
  ...props
}: React.ComponentProps<"pre">) {
  const ref = React.useRef<HTMLPreElement>(null)
  const hydrated = React.useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false
  )
  const [deferred] = React.useState(hydrated)
  const html = dangerouslySetInnerHTML?.__html

  React.useEffect(() => {
    const pre = ref.current
    if (!deferred || !pre || typeof html !== "string") {
      return
    }
    const scope = pre.closest("figure")
    const fill = () => {
      waiting.delete(fill)
      scope?.removeEventListener("pointerdown", fill, { capture: true })
      scope?.removeEventListener("focusin", fill)
      pre.innerHTML = html
    }
    scope?.addEventListener("pointerdown", fill, { capture: true })
    scope?.addEventListener("focusin", fill)
    const frame = requestAnimationFrame(() => {
      waiting.add(fill)
      fillWhenIdle()
    })
    return () => {
      cancelAnimationFrame(frame)
      waiting.delete(fill)
      scope?.removeEventListener("pointerdown", fill, { capture: true })
      scope?.removeEventListener("focusin", fill)
    }
  }, [deferred, html])

  return (
    <pre
      ref={ref}
      {...props}
      dangerouslySetInnerHTML={deferred ? undefined : dangerouslySetInnerHTML}
    />
  )
}

export { DeferredPre }
