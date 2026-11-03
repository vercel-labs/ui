<script lang="ts">
  import {
    type TriggerMenuDataItem,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuItem,
    TriggerMenuList,
    textFieldAdapter,
  } from "@ui-sdk/svelte/trigger-menu"

  const people = [
    { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
    { value: "alan", label: "Alan Turing" },
    { value: "grace", label: "Grace Hopper" },
    { value: "katherine", label: "Katherine Johnson" },
    { value: "linus", label: "Linus Torvalds", disabled: true },
    { value: "margaret", label: "Margaret Hamilton" },
  ]

  let field: HTMLTextAreaElement | undefined = $state()
  const editor = $derived(field ? textFieldAdapter(field) : undefined)
</script>

<TriggerMenu {editor} triggers={[{ char: "@", items: people }]}>
  <textarea bind:this={field} aria-label="Notes" placeholder="A textarea you render yourself" ></textarea>
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
