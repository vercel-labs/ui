import { toLabel, TokenInput, TokenInputEditor } from "@ui-sdk/solid/token-input"
import { createSignal } from "solid-js"

export function Example() {
  const [sent, setSent] = createSignal("")
  return (
    <div data-slot="stack">
      <TokenInput
        submitShortcut="mod+enter"
        onSubmit={(value) => {
          setSent(toLabel(value))
        }}
      >
        <TokenInputEditor aria-label="Message" placeholder="Enter adds a line, Cmd/Ctrl+Enter sends" />
      </TokenInput>
      <p data-slot="output">{sent() ? `Sent:\n${sent()}` : "Nothing sent yet."}</p>
    </div>
  )
}
