import * as React from "react"
import { definePrimitive } from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type CopyButtonOptions = {
  text?: string
  timeout?: number
  onCopy?: (text: string) => void
}

type CopyButtonState = { copied: boolean }

const copyButton = definePrimitive({
  name: "copy-button",
  options: { text: "string", timeout: "number", onCopy: "callback" },
  state: (_options: CopyButtonOptions): CopyButtonState => ({ copied: false }),
  api: (context) => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let text = context.options().text
    context.onOptions((options) => {
      if (options.text === text) return
      text = options.text
      clearTimeout(timer)
      context.store.set({ copied: false })
    })
    context.onDestroy(() => clearTimeout(timer))
    return {
      async copy() {
        const { text = "", timeout = 1500, onCopy } = context.options()
        await navigator.clipboard?.writeText(text).catch(() => {})
        context.store.set({ copied: true })
        onCopy?.(text)
        clearTimeout(timer)
        timer = setTimeout(() => context.store.set({ copied: false }), timeout)
      },
    }
  },
  slots: (slot) => ({
    root: slot<{}, { copied: boolean }>({
      state: (state) => ({ copied: state.copied }),
      attrs: (state) => ({ type: "button", "data-copied": state.copied ? "" : undefined }),
      press: ({ api }) => api.copy(),
    }),
  }),
})

const parts = createParts(copyButton, { root: "button" })

const CopyButton = parts.Root

const commands = { pnpm: "pnpm add @ui-sdk/core", npm: "npm install @ui-sdk/core" }

function Example() {
  const [manager, setManager] = React.useState<keyof typeof commands>("pnpm")
  const [copies, setCopies] = React.useState(0)
  return (
    <div data-slot="row">
      <select
        aria-label="Package manager"
        value={manager}
        onChange={(event) => setManager(event.target.value as keyof typeof commands)}
      >
        <option value="pnpm">pnpm</option>
        <option value="npm">npm</option>
      </select>
      <code data-slot="copy-command">{commands[manager]}</code>
      <CopyButton text={commands[manager]} onCopy={() => setCopies((count) => count + 1)}>
        {({ copied }) => (copied ? "Copied" : "Copy")}
      </CopyButton>
      <span data-slot="hint">
        Copied {copies} {copies === 1 ? "time" : "times"}
      </span>
    </div>
  )
}

export { copyButton, CopyButton, type CopyButtonOptions, type CopyButtonState, Example }
