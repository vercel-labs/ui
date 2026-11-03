"use client"

import { Menu, MenuContent, MenuItem, MenuTrigger } from "@ui-sdk/react/menu"
import { LoaderCircle } from "lucide-react"
import * as React from "react"

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function Example() {
  const [log, setLog] = React.useState("")

  return (
    <>
      <Menu pendingAnnouncement="Saving">
        <MenuTrigger className="inline-flex cursor-default h-8 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-border bg-background bg-clip-padding px-3 text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted data-open:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none">
          Project
        </MenuTrigger>
        <MenuContent className="min-w-36 max-h-(--available-height) overflow-y-auto origin-(--transform-origin) rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none">
          <MenuItem
            className="flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 data-pending:cursor-progress"
            value="save"
            onSelect={async () => {
              await wait(1200)
              setLog("Saved")
            }}
          >
            {(state) => (
              <>
                Save to cloud
                {state.pending && (
                  <LoaderCircle
                    aria-hidden="true"
                    className="pointer-events-none ms-auto block size-4 shrink-0 animate-spin text-muted-foreground"
                  />
                )}
              </>
            )}
          </MenuItem>
          <MenuItem
            className="flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 data-pending:cursor-progress"
            value="sync"
            onSelect={async () => {
              await wait(600)
              throw new Error("Offline")
            }}
          >
            {(state) => (
              <>
                Sync with server
                {state.pending ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="pointer-events-none ms-auto block size-4 shrink-0 animate-spin text-muted-foreground"
                  />
                ) : (
                  state.error !== undefined && (
                    <span className="ms-auto text-xs leading-4 font-medium text-foreground">
                      Failed, try again
                    </span>
                  )
                )}
              </>
            )}
          </MenuItem>
        </MenuContent>
      </Menu>
      <output className="mt-3 text-sm text-muted-foreground block min-h-5">{log || "Pick an item"}</output>
    </>
  )
}

export { Example }
