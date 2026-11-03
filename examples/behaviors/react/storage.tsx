import * as React from "react"
import {
  createCookieStorage,
  createLocalStorage,
  createSessionStorage,
  type ValueStorage,
} from "@ui-sdk/core"

const storages: { label: string; storage: ValueStorage; lasts: string }[] = [
  {
    label: "localStorage",
    storage: createLocalStorage("ui-sdk-note"),
    lasts: "Stays until cleared, in every tab.",
  },
  {
    label: "sessionStorage",
    storage: createSessionStorage("ui-sdk-note"),
    lasts: "Stays while this tab is open.",
  },
  {
    label: "Cookie",
    storage: createCookieStorage("ui-sdk-note"),
    lasts: "Stays a year, and the server reads it too.",
  },
]

const noServerValue = () => null

function Example() {
  const [picked, setPicked] = React.useState(0)
  const { storage, lasts } = storages[picked]
  const note = React.useSyncExternalStore(storage.subscribe, storage.get, noServerValue)
  const [available, setAvailable] = React.useState(true)
  React.useEffect(() => setAvailable(storage.available()), [storage])

  return (
    <div data-slot="stack">
      <div role="group" aria-label="Keep the note in" data-slot="row">
        {storages.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={picked === index}
            data-size="sm"
            onClick={() => setPicked(index)}
          >
            {label}
          </button>
        ))}
      </div>
      <label data-slot="label">
        <span>Note</span>
        <input
          value={note ?? ""}
          onChange={(event) => storage.set(event.target.value)}
          placeholder={available ? "Type, then reload the page" : "Unavailable here"}
          disabled={!available}
        />
      </label>
      <div data-slot="row">
        <p data-slot="hint">{available ? lasts : "This browser blocks it here."}</p>
        <button type="button" data-size="sm" onClick={() => storage.remove()} disabled={note === null}>
          Clear
        </button>
      </div>
    </div>
  )
}

export { Example }
