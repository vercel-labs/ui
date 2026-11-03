import "@ui-sdk/web/menu"
import { createElement, LoaderCircle } from "lucide"

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function mount(root: HTMLElement) {
  const spinner = createElement(LoaderCircle, {
    class:
      "pointer-events-none ms-auto hidden size-4 shrink-0 animate-spin text-muted-foreground group-data-pending:block",
    "aria-hidden": "true",
  }).outerHTML
  root.innerHTML = `
    <ui-menu pending-announcement="Saving">
      <ui-menu-trigger>
        <button class="inline-flex cursor-default h-8 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-border bg-background bg-clip-padding px-3 text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted data-open:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none">Project</button>
      </ui-menu-trigger>
      <ui-menu-content class="min-w-36 max-h-(--available-height) overflow-y-auto origin-(--transform-origin) rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none">
        <ui-menu-item class="group flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 data-pending:cursor-progress" value="save">
          Save to cloud
          ${spinner}
        </ui-menu-item>
        <ui-menu-item class="group flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 data-pending:cursor-progress" value="sync">
          Sync with server
          ${spinner}
          <span data-error hidden class="ms-auto text-xs leading-4 font-medium text-foreground">Failed, try again</span>
        </ui-menu-item>
      </ui-menu-content>
    </ui-menu>
    <output class="mt-3 text-sm text-muted-foreground block min-h-5">Pick an item</output>
  `
  const output = root.querySelector("output")!
  const error = root.querySelector<HTMLElement>("[data-error]")!
  root.addEventListener(
    "action",
    (event) => {
      const { value, waitUntil } = (
        event as CustomEvent<{ value: string; waitUntil: (promise: Promise<unknown>) => void }>
      ).detail
      if (value === "save")
        waitUntil(
          wait(1200).then(() => {
            output.textContent = "Saved"
          }),
        )
      if (value === "sync") {
        error.hidden = true
        const sync = wait(600).then(() => {
          throw new Error("Offline")
        })
        waitUntil(sync)
        sync.catch(() => (error.hidden = false))
      }
    },
    { capture: true },
  )
}

export { mount }
