<script lang="ts">
  import {
    type Token,
    TokenInput,
    TokenInputEditor,
    type TokenInputValue,
    type TokenInputValueChangeDetails,
    toText,
  } from "@ui-sdk/svelte/token-input"
  import {
    type TriggerMenuDataItem,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuItem,
    TriggerMenuList,
  } from "@ui-sdk/svelte/trigger-menu"

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

  let value = $state<TokenInputValue>(draft)
  let last = $state("")

  function onChange(next: TokenInputValue, details: TokenInputValueChangeDetails) {
    const removed = details.removed.map((token) => token.label).join(", ")
    last = `${details.reason}${details.inputType ? ` (${details.inputType})` : ""}${removed ? `, removed ${removed}` : ""}`
  }
</script>

<div data-slot="stack">
  <TokenInput
    bind:value
    history={{ limit: 50, groupDelay: 1000 }}
    getTokenDescription={(token: Token) => (token.type === "file" ? "attached file" : token.type)}
    onValueChange={onChange}
  >
    <TokenInputEditor aria-label="Prompt" />
    <TriggerMenu triggers={[{ char: "@", type: "file", items: files }]}>
      <TriggerMenuContent>
        <TriggerMenuList>
          {#snippet children(state)}
            {#each (state.items as TriggerMenuDataItem[]) as item (item.value)}
              <TriggerMenuItem value={item.value} label={item.label} disabled={item.disabled}>
                {item.label}
              </TriggerMenuItem>
            {/each}
          {/snippet}
        </TriggerMenuList>
      </TriggerMenuContent>
    </TriggerMenu>
  </TokenInput>
  <p data-slot="output">{last || "Type, paste or press Cmd+Z."}</p>
  <p data-slot="output">{toText(value)}</p>
</div>
