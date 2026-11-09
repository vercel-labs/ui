<script lang="ts">
  import {
    Textarea,
    TriggerMenu,
    TriggerMenuContent,
    TriggerMenuEmpty,
    TriggerMenuHint,
    TriggerMenuInput,
    TriggerMenuItem,
    TriggerMenuList,
    TriggerMenuStatus,
    type TriggerMenuDataItem,
  } from "@ui-sdk/svelte"
  import {
    fixtureTriggers,
    selectAction,
    triggerMenuFixture as f,
    triggerMenuOptions,
  } from "tests/fixtures/trigger-menu.ts"

  // One labelled field with its menu. The fixture renders a second one with ?twice.
  let {
    name,
    onAction,
    onOpen,
  }: {
    name: string
    onAction: (value: string) => void
    onOpen: (value: string) => void
  } = $props()

  const { input, textarea, empty, autoHighlight } = triggerMenuOptions()
  const triggers = fixtureTriggers()
  const id = $props.id()
</script>

{#snippet field({ props }: { props: Record<string, unknown> })}
  {#if input}<input {...props} />{:else}<Textarea {...props} />{/if}
{/snippet}

<TriggerMenu
  {triggers}
  {autoHighlight}
  onOpenChange={(open: boolean, details: { reason: string }) =>
    onOpen(`${open}:${details.reason}`)}
  onSelect={(value: unknown, details: { arguments: Record<string, string> }) =>
    onAction(selectAction(value, details.arguments))}
>
  <label class="label" for={id}>{name}</label>
  <TriggerMenuInput
    {id}
    name="message"
    class="input"
    render={input || textarea ? field : undefined}
  />
  <TriggerMenuHint class="hint" />
  <TriggerMenuStatus class="status" />
  <TriggerMenuContent class="popup list-popup">
    {#if empty}<TriggerMenuEmpty class="empty">{f.empty}</TriggerMenuEmpty>{/if}
    <TriggerMenuList>
      {#snippet children(state)}
        {#each state.items as TriggerMenuDataItem[] as item (item.value)}
          <TriggerMenuItem
            value={item.value}
            label={item.label}
            disabled={item.disabled}
            class="item"
          >
            {item.label}
          </TriggerMenuItem>
        {/each}
      {/snippet}
    </TriggerMenuList>
  </TriggerMenuContent>
</TriggerMenu>
