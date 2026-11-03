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
    <div ref={ref}>
      <input aria-label="Message" placeholder="Tap here on a phone" />
      <dl aria-label="Viewport">
        {rows.map(([name, value]) => (
          <React.Fragment key={name}>
            <dt>{name}</dt>
            <dd data-row={name}>{value}</dd>
          </React.Fragment>
        ))}
      </dl>
      <p>
        <span>No keyboard open</span>
        <span>The keyboard covers the bottom of the page</span>
      </p>
    </div>
  )
}

export { Example }
