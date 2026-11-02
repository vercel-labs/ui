import * as React from "react"
import { bindViewport, type ViewportState } from "@ui-sdk/core"

function Example() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = React.useState<ViewportState | null>(null)
  React.useEffect(() => bindViewport(ref.current!, { onChange: setViewport }), [])
  const rows = viewport
    ? [
        ["Keyboard", `${viewport.keyboard}px`],
        ["On screen", `${viewport.width} × ${viewport.height}`],
        ["Panned down", `${viewport.offsetTop}px`],
        ["Zoom", `${Math.round(viewport.scale * 100)}%`],
        [
          "Safe areas",
          `${viewport.safeArea.top} ${viewport.safeArea.right} ${viewport.safeArea.bottom} ${viewport.safeArea.left}`,
        ],
      ]
    : []
  return (
    <div ref={ref} className="group flex w-full max-w-72 flex-col gap-3 text-sm">
      <input
        aria-label="Message"
        placeholder="Tap here on a phone"
        className="h-9 rounded-md border border-border bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <dl aria-label="Viewport" className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        {rows.map(([name, value]) => (
          <React.Fragment key={name}>
            <dt className="text-muted-foreground">{name}</dt>
            <dd className="m-0 font-mono tabular-nums" data-row={name}>
              {value}
            </dd>
          </React.Fragment>
        ))}
      </dl>
      <p className="m-0 text-xs text-muted-foreground group-data-keyboard:text-foreground">
        <span className="group-data-keyboard:hidden">No keyboard open</span>
        <span className="hidden group-data-keyboard:inline">The keyboard covers the bottom of the page</span>
      </p>
    </div>
  )
}

export { Example }
