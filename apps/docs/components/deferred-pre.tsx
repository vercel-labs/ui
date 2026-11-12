"use client"

import * as React from "react"

const noSubscribe = () => () => {}

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
  const [filled, setFilled] = React.useState(!hydrated)

  React.useEffect(() => {
    if (filled) {
      return
    }
    const fill = () => setFilled(true)
    const scope = ref.current?.closest("figure")
    scope?.addEventListener("pointerdown", fill, { capture: true })
    scope?.addEventListener("focusin", fill)
    const idle = window.requestIdleCallback ?? setTimeout
    const cancel = window.cancelIdleCallback ?? clearTimeout
    let id = 0
    const frame = requestAnimationFrame(() => {
      id = idle(fill, { timeout: 1000 })
    })
    return () => {
      cancelAnimationFrame(frame)
      cancel(id)
      scope?.removeEventListener("pointerdown", fill, { capture: true })
      scope?.removeEventListener("focusin", fill)
    }
  }, [filled])

  return (
    <pre
      ref={ref}
      {...props}
      dangerouslySetInnerHTML={filled ? dangerouslySetInnerHTML : undefined}
    />
  )
}

export { DeferredPre }
