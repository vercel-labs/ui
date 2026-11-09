import {
  createResizableController,
  Resizable,
  ResizableHandle,
  ResizablePanel,
} from "@ui-sdk/react/resizable"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { classes as c } from "./classes"
import { describe, isHandleDisabled, renderShell, type Log } from "./shell"
import { presets, type GroupSpec, type Variant } from "./variants"

function Group({
  group,
  log,
  nested = false,
  onLayout,
  ...props
}: {
  group: GroupSpec
  log: Log
  nested?: boolean
  onLayout?: (layout: number[]) => void
} & Partial<React.ComponentProps<typeof Resizable>>) {
  return (
    <Resizable
      className={nested ? c.nested : c.group}
      {...group.options}
      onLayoutChange={(layout, details) => {
        log.change(`${describe(layout)} (${details.reason})`)
        onLayout?.(layout)
      }}
      onLayoutCommit={(layout, details) =>
        log.commit(`${describe(layout)} (${details.reason})`)
      }
      {...props}
    >
      {group.panels.map(({ label, nested: inner, ...sizes }, index) => (
        <React.Fragment key={label}>
          {index > 0 && (
            <ResizableHandle
              className={c.handle}
              aria-label={`Resize ${group.panels[index - 1].label}`}
              disabled={isHandleDisabled(group, index - 1)}
            />
          )}
          <ResizablePanel className={c.panel} {...sizes}>
            {inner ? <Group group={inner} log={log} nested /> : label}
          </ResizablePanel>
        </React.Fragment>
      ))}
    </Resizable>
  )
}

function Card({ variant, log }: { variant: Variant; log: Log }) {
  const [layout, setLayout] = React.useState(presets[0])
  const [controller] = React.useState(createResizableController)
  const [extra, setExtra] = React.useState(false)
  const group = extra
    ? {
        ...variant.group,
        panels: [...variant.group.panels, { label: "Extra", id: "extra" }],
      }
    : variant.group
  let body = (
    <Group
      group={group}
      log={log}
      controller={variant.controller ? controller : undefined}
      {...(variant.controlled && { layout, onLayout: setLayout })}
    />
  )
  if (variant.place === "rtl") {
    body = <div dir="rtl">{body}</div>
  }
  if (variant.place === "transformed") {
    body = <div className={c.transformed}>{body}</div>
  }
  if (variant.place === "scroll") {
    body = <div className={c.scroll}>{body}</div>
  }
  return (
    <>
      {body}
      <div className={c.row}>
        {variant.controlled &&
          presets.map((preset) => (
            <button
              key={describe(preset)}
              type="button"
              className={c.button}
              onClick={() => setLayout(preset)}
            >
              Set {describe(preset)}
            </button>
          ))}
        {variant.controller && (
          <>
            <button
              type="button"
              className={c.button}
              onClick={() => controller.collapse("sidebar")}
            >
              Collapse
            </button>
            <button
              type="button"
              className={c.button}
              onClick={() => controller.expand("sidebar")}
            >
              Expand
            </button>
            <button
              type="button"
              className={c.button}
              onClick={() => controller.resize("sidebar", "160px")}
            >
              160px
            </button>
          </>
        )}
        {variant.conditional && (
          <button
            type="button"
            className={c.button}
            onClick={() => setExtra(!extra)}
          >
            {extra ? "Remove panel" : "Add panel"}
          </button>
        )}
      </div>
    </>
  )
}

function mount(root: HTMLElement) {
  renderShell(root, "react", (slot, variant, log) =>
    createRoot(slot).render(
      <React.StrictMode>
        <Card variant={variant} log={log} />
      </React.StrictMode>
    )
  )
}

export { mount }
