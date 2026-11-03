<script lang="ts">
  import { FileIcon, XIcon } from "@lucide/svelte"
  import {
    TokenInput,
    TokenInputEditor,
    TokenInputToken,
    TokenInputTokenRemove,
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

</script>

<TokenInput>
  <TokenInputEditor aria-label="Prompt" placeholder="Ask about a file, type @ to add one" />
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
    <TokenInputToken>
      <FileIcon aria-hidden="true" />
      {token.label}
      <TokenInputTokenRemove>
        <XIcon aria-hidden="true" />
      </TokenInputTokenRemove>
    </TokenInputToken>
  {/snippet}
</TokenInput>
