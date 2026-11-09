"use client"

import * as React from "react"

function signal() {
  let resolve = () => {}
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

// Every demo comes from one module, since Turbopack copies a module that two
// async chunks share into both, which cost 46 KB gzipped across the page.
function island(name: keyof typeof import("./home-demos")) {
  const Demo = React.lazy(() =>
    import("./home-demos").then((demos) => ({ default: demos[name] }))
  )

  function Deferred({ until }: { until: Promise<void> | null }) {
    if (until) {
      React.use(until)
    }
    return <Demo />
  }

  function Island({ className }: { className: string }) {
    const id = React.useId()
    const ref = React.useRef<HTMLDivElement>(null)
    // Only a hydrating island finds its element. It suspends until it nears the
    // viewport, and React keeps the server's HTML on screen until it hydrates.
    const [visible] = React.useState(() =>
      typeof document !== "undefined" && document.getElementById(id)
        ? signal()
        : null
    )

    React.useEffect(() => {
      const element = ref.current
      if (!element || !visible) {
        return
      }
      const reveal = () => {
        visible.resolve()
        stop()
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            reveal()
          }
        },
        { rootMargin: "100% 0px" }
      )
      const stop = () => {
        observer.disconnect()
        element.removeEventListener("focusin", reveal)
        element.removeEventListener("pointerenter", reveal)
      }
      observer.observe(element)
      element.addEventListener("focusin", reveal)
      element.addEventListener("pointerenter", reveal)
      return stop
    }, [visible])

    return (
      <div ref={ref} id={id} className={className}>
        <React.Suspense>
          <Deferred until={visible?.promise ?? null} />
        </React.Suspense>
      </div>
    )
  }

  return Island
}

const AccordionIsland = island("AccordionDemo")
const AgentsIsland = island("AgentsDemo")
const AskIsland = island("AskDemo")
const CalendarIsland = island("CalendarDemo")
const CanvasIsland = island("CanvasDemo")
const ColorIsland = island("ColorDemo")
const CommandIsland = island("CommandDemo")
const FlowIsland = island("FlowDemo")
const NumberInputIsland = island("NumberInputDemo")
const OTPIsland = island("OTPDemo")
const OperateIsland = island("OperateDemo")
const RatingIsland = island("RatingDemo")
const ResizableIsland = island("ResizableDemo")
const SegmentedIsland = island("SegmentedDemo")
const SheetIsland = island("SheetDemo")
const SliderIsland = island("SliderDemo")
const SwitchIsland = island("SwitchDemo")
const TabsIsland = island("TabsDemo")
const TimelineIsland = island("TimelineDemo")
const TokenInputIsland = island("TokenInputDemo")
const ToolbarIsland = island("ToolbarDemo")
const TreeIsland = island("TreeDemo")
const WeekIsland = island("WeekDemo")

export {
  AccordionIsland,
  AgentsIsland,
  AskIsland,
  CalendarIsland,
  CanvasIsland,
  ColorIsland,
  CommandIsland,
  FlowIsland,
  NumberInputIsland,
  OTPIsland,
  OperateIsland,
  RatingIsland,
  ResizableIsland,
  SegmentedIsland,
  SheetIsland,
  SliderIsland,
  SwitchIsland,
  TabsIsland,
  TimelineIsland,
  TokenInputIsland,
  ToolbarIsland,
  TreeIsland,
  WeekIsland,
}
