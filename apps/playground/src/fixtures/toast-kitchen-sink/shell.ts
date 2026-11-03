import { createToaster } from "@ui-sdk/core/toast"
import { variants } from "./variants"

/** The region options the controls set. */
type RegionOptions = {
  side: "top" | "bottom"
  align: "start" | "center" | "end"
  maxVisible: number
  expanded: boolean
  shortcut: string | null
}

const button =
  "inline-flex h-8 items-center rounded-md border border-neutral-200 bg-white px-3 text-sm hover:bg-neutral-100"

// The framework-neutral page: controls for the region, a button per toast
// variant and an event log. Each framework renders the region into `slot` and
// renders again when the options change.
function createShell(root: HTMLElement) {
  const toast = createToaster<unknown>()
  const options: RegionOptions = {
    side: "bottom",
    align: "end",
    maxVisible: 3,
    expanded: false,
    shortcut: "F6",
  }
  const listeners = new Set<() => void>()
  root.innerHTML = `
    <div class="grid gap-6 p-6 text-sm">
      <h1 class="text-lg font-semibold">Toast kitchen sink</h1>
      <div class="flex flex-wrap items-center gap-3" data-controls>
        <label>Side <select name="side"><option>bottom</option><option>top</option></select></label>
        <label>Align <select name="align"><option>end</option><option>center</option><option>start</option></select></label>
        <label>Max <input name="maxVisible" type="number" min="1" max="10" value="3" class="w-14 border" /></label>
        <label><input name="expanded" type="checkbox" /> Expanded</label>
        <label>Shortcut <select name="shortcut"><option>F6</option><option>alt+t</option><option value="">none</option></select></label>
      </div>
      <div class="grid gap-3" data-variants></div>
      <pre class="max-h-40 overflow-auto rounded border p-2 text-xs" aria-label="Event log" data-log></pre>
      <div data-slot-region></div>
    </div>
  `
  const logEl = root.querySelector<HTMLElement>("[data-log]")!
  const log = (line: string) => (logEl.textContent = `${line}\n${logEl.textContent}`)
  const sections = new Map<string, HTMLElement>()
  for (const variant of variants) {
    let section = sections.get(variant.section)
    if (!section) {
      const group = document.createElement("section")
      group.innerHTML = `<h2 class="mb-2 font-medium">${variant.section}</h2><div class="flex flex-wrap gap-2"></div>`
      root.querySelector("[data-variants]")!.append(group)
      section = group.querySelector("div")!
      sections.set(variant.section, section)
    }
    const el = document.createElement("button")
    el.className = button
    el.textContent = variant.label
    el.dataset.variant = variant.label
    el.addEventListener("click", () => variant.show(toast, log))
    section.append(el)
  }
  root.querySelector("[data-controls]")!.addEventListener("change", (event) => {
    const input = event.target as HTMLInputElement
    if (input.name === "expanded") options.expanded = input.checked
    else if (input.name === "maxVisible") options.maxVisible = Number(input.value)
    else if (input.name === "shortcut") options.shortcut = input.value || null
    else (options as Record<string, unknown>)[input.name] = input.value
    log(`option: ${input.name}`)
    listeners.forEach((listener) => listener())
  })
  return {
    toast,
    log,
    slot: root.querySelector<HTMLElement>("[data-slot-region]")!,
    options: () => ({ ...options }),
    onChange: (listener: () => void) => listeners.add(listener),
  }
}

// Shared by every framework's toasts, written as whole strings for Tailwind.
const classes = {
  region:
    "m-4 w-[356px] h-(--toast-front-height) [--dir:-1] data-[side=top]:[--dir:1] data-expanded:h-[calc(var(--toast-stack-height)+(var(--toast-count)-1)*0.75rem)]",
  toast:
    "absolute inset-x-0 z-[calc(100-var(--toast-index))] flex items-center gap-3 overflow-hidden rounded-lg border bg-white p-4 shadow-lg transition-[translate,scale,opacity,height] duration-300 in-data-[side=bottom]:bottom-0 in-data-[side=top]:top-0 [--y:calc(var(--dir)*var(--toast-index)*0.75rem)] [translate:var(--toast-swipe-x,0px)_calc(var(--y)+var(--toast-swipe-y,0px))] scale-[calc(1-var(--toast-index)*0.05)] not-data-front:not-data-expanded:h-(--toast-front-height) data-expanded:scale-100 data-expanded:[--y:calc(var(--dir)*(var(--toast-offset)+var(--toast-index)*0.75rem))] data-starting-style:opacity-0 data-ending-style:opacity-0 data-swiping:transition-none data-[type=error]:border-red-500 data-[type=success]:border-green-500",
  content: "grid flex-1 gap-1",
  title: "font-medium",
  description: "text-neutral-500",
  action: "rounded bg-neutral-900 px-2 py-1 text-xs text-white data-pending:opacity-60",
  close: "rounded border px-2 py-1 text-xs",
}

export { classes, createShell, type RegionOptions }
