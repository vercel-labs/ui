import { toLabel, TokenInput, TokenInputEditor } from "@ui-sdk/react/token-input"
import * as React from "react"

export function Example() {
  const [sent, setSent] = React.useState("")
  return (
    <div data-slot="stack">
      <TokenInput submitShortcut="mod+enter" onSubmit={(value) => setSent(toLabel(value))}>
        <TokenInputEditor aria-label="Message" placeholder="Enter adds a line, Cmd/Ctrl+Enter sends" />
      </TokenInput>
      <p data-slot="output">{sent ? `Sent:\n${sent}` : "Nothing sent yet."}</p>
    </div>
  )
}
