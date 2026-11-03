<script lang="ts">
  import {
    type TriggerMenuDataItem,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuList,
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
  let box: HTMLDivElement | undefined = $state()
</script>

<TriggerMenu triggers={[{ char: "@", items: people }]}>
  <div data-slot="stack">
    <TriggerMenuInput aria-label="Comment" placeholder="The list opens above, at the field's start">
      {#snippet render({ props })}
        <textarea {...props} bind:this={field} ></textarea>
      {/snippet}
    </TriggerMenuInput>
    <div bind:this={box}></div>
  </div>
  <TriggerMenuContent
    side="top"
    align="start"
    sideOffset={8}
    alignOffset={-4}
    collisionPadding={16}
    anchor={field ?? null}
    keepMounted
    container={box}
  >
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
