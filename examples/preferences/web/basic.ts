import { createLocalStorage, createPreference } from "@ui-sdk/core"
import "@ui-sdk/web/button"
import "@ui-sdk/web/preferences"

function mount(root: HTMLElement) {
  const density = createPreference({
    values: ["comfortable", "compact"],
    defaultValue: "comfortable",
    attribute: "data-density",
    storage: createLocalStorage("ui-sdk-preferences-density"),
  })

  root.innerHTML = `
    <ui-preferences>
      <div class="flex w-full max-w-sm flex-col gap-4 rounded-3xl bg-card p-5 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10">
        <ui-button>
          <button type="button" aria-pressed="false" class="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 self-start rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-[color,background-color,box-shadow] hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px data-disabled:pointer-events-none data-disabled:opacity-50">
            Compact layout
          </button>
        </ui-button>
        <ul class="h-40 space-y-2" aria-label="Documents">
          <li class="rounded-xl bg-muted/50 px-3 py-3 [[data-density=compact]_&]:py-1">Project notes</li>
          <li class="rounded-xl bg-muted/50 px-3 py-3 [[data-density=compact]_&]:py-1">Meeting notes</li>
          <li class="rounded-xl bg-muted/50 px-3 py-3 [[data-density=compact]_&]:py-1">Release notes</li>
        </ul>
        <span class="text-muted-foreground">Density: comfortable</span>
      </div>
    </ui-preferences>
  `

  const preferences = root.querySelector("ui-preferences")!
  const button = root.querySelector("button")!
  const label = root.querySelector("span")!
  preferences.preferences = [density]

  const update = () => {
    const { value } = density.get()
    button.setAttribute("aria-pressed", String(value === "compact"))
    label.textContent = `Density: ${value}`
  }
  const toggle = (event: MouseEvent) => {
    density.set(density.get().value === "compact" ? "comfortable" : "compact", {
      reason: "press",
      event,
    })
  }

  const stop = density.subscribe(update)
  update()
  button.addEventListener("click", toggle)

  return () => {
    stop()
    button.removeEventListener("click", toggle)
    preferences.preferences = []
  }
}

export { mount }
