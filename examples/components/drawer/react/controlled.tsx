"use client"

import * as React from "react"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
  type SnapPoint,
} from "@ui-sdk/react/drawer"

const snapPoints: SnapPoint[] = [0.25, 0.5, 1]

function Example() {
  const [open, setOpen] = React.useState(false)
  const [snapPoint, setSnapPoint] = React.useState<SnapPoint>(0.5)
  const [log, setLog] = React.useState<string[]>([])
  const write = (line: string) => setLog((lines) => [line, ...lines].slice(0, 8))
  return (
    <div data-slot="stack">
      <div data-slot="row">
        <label data-slot="label">
          <input type="checkbox" checked={open} onChange={(event) => setOpen(event.target.checked)} />
          open
        </label>
        <fieldset data-slot="row">
          <legend>snapPoint</legend>
          {snapPoints.map((point) => (
            <label data-slot="label" key={point}>
              <input
                type="radio"
                name="controlled-snap-point"
                checked={snapPoint === point}
                onChange={() => setSnapPoint(point)}
              />
              {point}
            </label>
          ))}
        </fieldset>
      </div>
      <Drawer
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next)
          write(`onOpenChange(${next}, "${details.reason}")`)
        }}
        onOpenChangeComplete={(next) => write(`onOpenChangeComplete(${next})`)}
        snapPoints={snapPoints}
        snapPoint={snapPoint}
        onSnapPointChange={(next, details) => {
          setSnapPoint(next)
          write(`onSnapPointChange(${next}, "${details.reason}")`)
        }}
      >
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHandle aria-label="Resize" />
          <div data-slot="stack">
            <DrawerTitle>Controlled</DrawerTitle>
            <DrawerDescription>
              Open at {snapPoint}. Drag it, or pick a size, and watch the log.
            </DrawerDescription>
          </div>
          <div data-slot="row">
            {snapPoints.map((point) => (
              <button
                key={point}
                type="button"
                aria-pressed={snapPoint === point}
                onClick={() => setSnapPoint(point)}
              >
                {point}
              </button>
            ))}
            <DrawerClose data-variant="solid">Close</DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      <p data-slot="hint">
        open: {String(open)}, snapPoint: {snapPoint}
      </p>
      <ol data-slot="log">
        {log.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ol>
    </div>
  )
}

export { Example }
