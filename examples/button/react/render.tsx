"use client"

import * as React from "react"
import { Button } from "@ui-sdk/react/button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function Example() {
  const [fail, setFail] = React.useState(false)

  return (
    <div data-slot="stack">
      <label data-slot="label">
        <input type="checkbox" checked={fail} onChange={(event) => setFail(event.target.checked)} />
        Make saving fail
      </label>
      <Button
        onClick={async () => {
          await wait(1000)
          if (fail) {
            throw new Error("Couldn't save. Check your connection and try again.")
          }
        }}
        render={(props, state) => (
          <div data-slot="stack">
            <button {...props}>
              {state.pending ? "Saving…" : state.error ? "Try again" : "Save changes"}
            </button>
            <p data-slot="output" role="alert">
              {state.error instanceof Error && state.error.message}
            </p>
          </div>
        )}
      />
    </div>
  )
}

export { Example }
