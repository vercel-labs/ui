<script lang="ts">
  import { toLabel, TokenInput, TokenInputEditor, type TokenInputValue } from "@ui-sdk/svelte/token-input"

  let sent = $state("")
</script>

<div data-slot="stack">
  <TokenInput submitShortcut="mod+enter" onSubmit={(value: TokenInputValue) => (sent = toLabel(value))}>
    <TokenInputEditor aria-label="Message" placeholder="Enter adds a line, Cmd/Ctrl+Enter sends" />
  </TokenInput>
  <p data-slot="output">{sent ? `Sent:\n${sent}` : "Nothing sent yet."}</p>
</div>
