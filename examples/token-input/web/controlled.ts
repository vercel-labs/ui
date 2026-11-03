import { toText, type Token, type TokenInputValue } from "@ui-sdk/core/token-input"
import "@ui-sdk/web/token-input"
import "@ui-sdk/web/trigger-menu"

const files = [
  { value: "src/app.tsx", label: "app.tsx", keywords: ["src"] },
  { value: "src/routes.ts", label: "routes.ts", keywords: ["src"] },
  { value: "src/styles.css", label: "styles.css", keywords: ["src"] },
  { value: "README.md", label: "README.md" },
  { value: "package.json", label: "package.json" },
]

const draft: TokenInputValue = [
  "Explain ",
  { type: "file", value: "src/routes.ts", label: "routes.ts" },
  " in two sentences.",
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex w-full max-w-sm min-w-0 flex-col gap-3">
      <p data-show="last" class="h-12 overflow-y-auto text-sm text-muted-foreground">Type, paste or press Cmd+Z.</p>
      <p data-show="text" class="h-12 overflow-y-auto font-mono text-xs break-all text-muted-foreground"></p>
    </div>
  `
  const input = document.createElement("ui-token-input")
  input.history = { limit: 50, groupDelay: 1000 }
  input.getTokenDescription = (token: Token) => (token.type === "file" ? "attached file" : token.type)
  input.defaultValue = draft
  input.innerHTML = `
    <ui-token-input-editor aria-label="Prompt" class="h-28 overflow-y-auto rounded-2xl border border-transparent bg-input/50 px-2.5 py-2 text-base leading-6 outline-none transition-[color,box-shadow] duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm [&_[data-token-type]]:rounded-2xl [&_[data-token-type]]:bg-input [&_[data-token-type]]:px-1.5 [&_[data-token-type]]:font-medium dark:[&_[data-token-type]]:bg-input/60 motion-reduce:transition-none"></ui-token-input-editor>
    <ui-trigger-menu>
      <template>
        <ui-trigger-menu-content class="max-h-[min(18rem,var(--available-height))] w-56 origin-(--transform-origin) scroll-py-1 overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 dark:ring-foreground/10 motion-reduce:transition-none">
          <ui-trigger-menu-item class="flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50">
          </ui-trigger-menu-item>
        </ui-trigger-menu-content>
      </template>
    </ui-trigger-menu>
  `
  root.firstElementChild!.prepend(input)
  const menu = input.querySelector("ui-trigger-menu")!
  menu.triggers = [{ char: "@", type: "file", items: files }]
  root.querySelector('[data-show="text"]')!.textContent = toText(input.value)
  input.addEventListener("valuechange", (event) => {
    const { reason, inputType, removed, value } = event.detail
    const names = removed.map((token) => token.label).join(", ")
    root.querySelector('[data-show="last"]')!.textContent =
      `${reason}${inputType ? ` (${inputType})` : ""}${names ? `, removed ${names}` : ""}`
    root.querySelector('[data-show="text"]')!.textContent = toText(value)
  })
}
