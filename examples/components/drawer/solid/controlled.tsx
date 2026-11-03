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
} from "@ui-sdk/solid/drawer"
import { createSignal, For } from "solid-js"

const snapPoints: SnapPoint[] = [0.25, 0.5, 1]

function Example() {
  const [open, setOpen] = createSignal(false)
  const [snapPoint, setSnapPoint] = createSignal<SnapPoint>(0.5)
  const [log, setLog] = createSignal<string[]>([])
  const write = (line: string) => setLog((lines) => [line, ...lines].slice(0, 8))
  return (
    <div data-slot="stack">
      <div data-slot="row">
        <label data-slot="label">
          <input
            type="checkbox"
            checked={open()}
            onChange={(event) => setOpen(event.currentTarget.checked)}
          />
          open
        </label>
        <fieldset data-slot="row">
          <legend>snapPoint</legend>
          <For each={snapPoints}>
            {(point) => (
              <label data-slot="label">
                <input
                  type="radio"
                  name="controlled-snap-point"
                  checked={snapPoint() === point}
                  onChange={() => setSnapPoint(point)}
                />
                {point}
              </label>
            )}
          </For>
        </fieldset>
      </div>
      <Drawer
        open={open()}
        onOpenChange={(next, details) => {
          setOpen(next)
          write(`onOpenChange(${next}, "${details.reason}")`)
        }}
        onOpenChangeComplete={(next) => write(`onOpenChangeComplete(${next})`)}
        snapPoints={snapPoints}
        snapPoint={snapPoint()}
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
              Open at {snapPoint()}. Drag it, or pick a size, and watch the log.
            </DrawerDescription>
          </div>
          <div data-slot="row">
            <For each={snapPoints}>
              {(point) => (
                <button
                  type="button"
                  aria-pressed={snapPoint() === point ? "true" : "false"}
                  onClick={() => setSnapPoint(point)}
                >
                  {point}
                </button>
              )}
            </For>
            <DrawerClose data-variant="solid">Close</DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
      <p data-slot="hint">
        open: {String(open())}, snapPoint: {snapPoint()}
      </p>
      <ol data-slot="log">
        <For each={log()}>{(line) => <li>{line}</li>}</For>
      </ol>
    </div>
  )
}

export { Example }
