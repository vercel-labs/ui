import "@ui-sdk/web/command"
import { createElement, LoaderCircle } from "lucide"

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function mount(root: HTMLElement) {
  const spinner = createElement(LoaderCircle, {
    class:
      "pointer-events-none hidden size-4 shrink-0 animate-spin text-muted-foreground group-data-pending:block",
    "aria-hidden": "true",
  }).outerHTML
  root.innerHTML = `
    <div class="flex w-full max-w-sm flex-col gap-3">
      <ui-command pending-announcement="Deploying" class="flex min-h-40 w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-popover p-1 text-popover-foreground ring-1 ring-foreground/5">
        <div class="shrink-0 p-1 pb-0">
          <ui-command-input>
            <input aria-label="Search actions" placeholder="Search actions..." class="m-0 box-border h-8 w-full min-w-0 shrink-0 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-base leading-6 text-inherit transition-[color,box-shadow] duration-200 placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm md:leading-5" />
          </ui-command-input>
        </div>
        <ui-command-list class="min-h-0 p-1 outline-none">
          <ui-command-item value="deploy" label="Deploy to production" class="group relative flex min-h-7 cursor-default items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm leading-5 outline-none select-none data-highlighted:bg-muted data-highlighted:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-pending:cursor-progress">
            Deploy to production
            ${spinner}
          </ui-command-item>
          <ui-command-item value="sync" label="Sync with server" class="group relative flex min-h-7 cursor-default items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm leading-5 outline-none select-none data-highlighted:bg-muted data-highlighted:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-pending:cursor-progress">
            Sync with server
            ${spinner}
            <span data-error hidden class="text-xs leading-4 font-medium text-foreground">Failed, try again</span>
          </ui-command-item>
        </ui-command-list>
      </ui-command>
      <output class="block min-h-5 text-sm leading-5 text-muted-foreground">Run a command</output>
    </div>
  `
  const output = root.querySelector("output")!
  const error = root.querySelector<HTMLElement>("[data-error]")!
  root.querySelector("ui-command")!.addEventListener("action", (event) => {
    const { value, waitUntil } = (
      event as CustomEvent<{ value: string; waitUntil: (promise: Promise<unknown>) => void }>
    ).detail
    if (value === "deploy")
      waitUntil(
        wait(1200).then(() => {
          output.textContent = "Deployed"
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
  })
}

export { mount }
