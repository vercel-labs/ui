<script lang="ts">
  import {
    createTokenInputController,
    TokenInput,
    TokenInputEditor,
    type TokenInputValue,
  } from "@ui-sdk/svelte/token-input"

  const draft: TokenInputValue = [
    "Explain ",
    { type: "file", value: "src/routes.ts", label: "routes.ts" },
    " in two sentences.",
  ]

  const loadFile = () => new Promise<void>((resolve) => setTimeout(resolve, 800))

  const prompt = createTokenInputController()

  const first = () => prompt.getValue().find((segment) => typeof segment !== "string")

  function rename() {
    const token = first()
    if (typeof token === "object") prompt.updateToken(token.id!, { label: token.label.toUpperCase() })
  }

  function remove() {
    const token = first()
    if (typeof token === "object") prompt.removeToken(token.id!)
  }

</script>

<div data-slot="stack">
  <TokenInput controller={prompt} defaultValue={draft}>
    <TokenInputEditor aria-label="Prompt" />
  </TokenInput>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div data-slot="row" onmousedown={(event) => event.preventDefault()}>
    <button
      type="button"
      onclick={() =>
        prompt.insert(
          { type: "file", value: "package.json", label: "package.json" },
          { at: "end", resolve: loadFile() },
        )}
    >
      Attach package.json
    </button>
    <button type="button" onclick={rename}>Rename first</button>
    <button type="button" onclick={remove}>Remove first</button>
    <button type="button" onclick={() => prompt.canUndo() && prompt.undo()}>Undo</button>

    <button type="button" onclick={() => prompt.clear()}>Clear</button>

  </div>
</div>
