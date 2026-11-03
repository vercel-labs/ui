import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/solid/menu"
import { createSignal, Show } from "solid-js"

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const Spinner = () => (
  <svg
    class="pointer-events-none ms-auto block size-4 shrink-0 animate-spin text-muted-foreground"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

function Example() {
  const [log, setLog] = createSignal("")

  return (
    <>
      <Menu pendingAnnouncement="Saving">
        <MenuTrigger class="inline-flex cursor-default h-8 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-border bg-background bg-clip-padding px-3 text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted data-open:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none">
          Project
        </MenuTrigger>
        <MenuContent class="min-w-36 max-h-(--available-height) overflow-y-auto origin-(--transform-origin) rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none">
          <MenuItem
            class="flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 data-pending:cursor-progress"
            value="save"
            onSelect={async () => {
              await wait(1200)
              setLog("Saved")
            }}
          >
            {(state) => (
              <>
                Save to cloud
                <Show when={state.pending}>
                  <Spinner />
                </Show>
              </>
            )}
          </MenuItem>
          <MenuItem
            class="flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 data-pending:cursor-progress"
            value="sync"
            onSelect={async () => {
              await wait(600)
              throw new Error("Offline")
            }}
          >
            {(state) => (
              <>
                Sync with server
                <Show
                  when={state.pending}
                  fallback={
                    <Show when={state.error !== undefined}>
                      <span class="ms-auto text-xs leading-4 font-medium text-foreground">
                        Failed, try again
                      </span>
                    </Show>
                  }
                >
                  <Spinner />
                </Show>
              </>
            )}
          </MenuItem>
        </MenuContent>
      </Menu>
      <output class="mt-3 text-sm text-muted-foreground block min-h-5">{log() || "Pick an item"}</output>
    </>
  )
}

export { Example }
