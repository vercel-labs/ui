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
  // Re-reads the note whenever a storage with the same ID, here or in another tab, writes it.
  const note = React.useSyncExternalStore(storage.subscribe, storage.get, noServerValue)
  const [available, setAvailable] = React.useState(true)
  React.useEffect(() => setAvailable(storage.available()), [storage])

  return (
    <div className="flex w-80 flex-col gap-4 rounded-3xl bg-card p-5 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10">
      <div
        role="group"
        aria-label="Keep the note in"
        className="inline-flex h-8 w-full items-center rounded-2xl bg-muted p-[3px] text-muted-foreground"
      >
        {storages.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={picked === index}
            onClick={() => setPicked(index)}
            className="inline-flex h-full flex-1 items-center justify-center rounded-2xl border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 outline-none transition-[color,box-shadow] hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm dark:text-muted-foreground dark:aria-pressed:border-input dark:aria-pressed:bg-input/30 dark:aria-pressed:text-foreground"
          >
            {label}
          </button>
        ))}
      </div>
      <label className="flex flex-col gap-2">
        <span className="font-medium">Note</span>
        <input
          value={note ?? ""}
          onChange={(event) => storage.set(event.target.value)}
          placeholder={available ? "Type, then reload the page" : "Unavailable here"}
          disabled={!available}
          className="h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-base outline-none transition-[color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50 md:text-sm"
        />
      </label>
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground">{available ? lasts : "This browser blocks it here."}</p>
        <button
          type="button"
          onClick={() => storage.remove()}
          disabled={note === null}
          className="inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-2xl border border-border bg-background bg-clip-padding px-3 text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 dark:bg-transparent dark:hover:bg-input/30"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export { Example }
