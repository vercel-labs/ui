import * as React from "react"
import { ConfirmButton } from "./confirm-button"

function Example() {
  const [locked, setLocked] = React.useState(false)
  const [last, setLast] = React.useState("Press the button, or wait for it to disarm.")
  return (
    <div data-slot="stack">
      <div data-slot="row">
        <ConfirmButton
          timeout={2000}
          onArmedChange={(armed, details) => {
            if (locked) details.cancel()
            setLast(
              `${armed ? "Arm" : "Disarm"}: ${details.reason}, from ${details.source}${details.canceled ? ", canceled" : ""}`,
            )
          }}
        >
          {({ armed }) => (armed ? "Press again to delete" : "Delete")}
        </ConfirmButton>
        <label data-slot="label">
          <input type="checkbox" checked={locked} onChange={(event) => setLocked(event.target.checked)} />
          Lock
        </label>
      </div>
      <p data-last data-slot="hint">
        {last}
      </p>
    </div>
  )
}

export { Example }
