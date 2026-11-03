<script lang="ts">
  import { TokenInput, TokenInputEditor, type TokenInputValue } from "@ui-sdk/svelte/token-input"

  const draft: TokenInputValue = [
    "Explain ",
    { type: "file", value: "src/routes.ts", label: "routes.ts" },
    " in two sentences.",
  ]

  let submitted = $state("")
  let disabled = $state(false)
  let readOnly = $state(false)
  const formId = $props.id()

  function submit(event: Event) {
    event.preventDefault()
    submitted = String(new FormData(event.currentTarget as HTMLFormElement).get("prompt") ?? "")
  }
</script>

<div data-slot="stack">
  <div data-slot="row">
    <label data-slot="label">
      <input bind:checked={disabled} type="checkbox" />
      Disabled
    </label>
    <label data-slot="label">
      <input bind:checked={readOnly} type="checkbox" />
      Read-only
    </label>
  </div>
  <TokenInput form={formId} name="prompt" required defaultValue={draft} {disabled} {readOnly}>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label id={`${formId}-label`} data-slot="label">Prompt</label>
    <TokenInputEditor aria-labelledby={`${formId}-label`} />
  </TokenInput>
  <form onreset={() => submitted = ""} id={formId} data-slot="stack" onsubmit={submit}>
    <div data-slot="row">
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </div>
    <p data-slot="output">{submitted}</p>
  </form>
</div>
