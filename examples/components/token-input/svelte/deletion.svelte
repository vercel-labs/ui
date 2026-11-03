<script lang="ts">
  import {
    type TokenDeletion,
    TokenInput,
    TokenInputEditor,
    TokenInputToken,
    type TokenInputValue,
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
    { type: "file", value: "src/routes.ts", label: "routes.ts", data: { trigger: "@" } },
    " in two sentences.",
  ]

  let deletion = $state<TokenDeletion>("whole")
  const options = ["whole", "select", "revert"] as const
</script>

<div data-slot="stack">
  <div role="radiogroup" aria-label="Backspace" data-slot="row">
    {#each options as option (option)}
      <label data-slot="label">
        <input bind:group={deletion} type="radio" name="token-deletion" value={option} data-slot="visually-hidden" />
        {option}
      </label>
    {/each}
  </div>
  <TokenInput tokenDeletion={deletion} defaultValue={draft}>
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
    {#snippet token(token)}
      <TokenInputToken>@{token.label}</TokenInputToken>
    {/snippet}
  </TokenInput>
</div>
