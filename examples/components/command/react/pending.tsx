"use client"

import { Command, CommandInput, CommandItem, CommandList } from "@ui-sdk/react/command"
import { LoaderCircleIcon } from "lucide-react"
import * as React from "react"

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function Example() {
  const [log, setLog] = React.useState("")
  return (
    <div data-slot="stack">
      <Command>
        <CommandInput aria-label="Search actions" placeholder="Search actions..." />
        <CommandList>
          <CommandItem
            value="deploy"
            onSelect={async () => {
              await wait(1200)
              setLog("Deployed")
            }}
          >
            {(state) => (
              <>
                Deploy to production
                {state.pending && <LoaderCircleIcon data-slot="spinner" aria-hidden="true" />}
              </>
            )}
          </CommandItem>
          <CommandItem
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
                  <LoaderCircleIcon data-slot="spinner" aria-hidden="true" />
                ) : (
                  state.error !== undefined && <span data-slot="hint">Failed, try again</span>
                )}
              </>
            )}
          </CommandItem>
        </CommandList>
      </Command>
      <output data-slot="output">{log || "Run a command"}</output>
    </div>
  )
}

export { Example }
