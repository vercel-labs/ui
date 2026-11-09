<script lang="ts">
  import {
    createListboxController,
    Listbox,
    ListboxGroup,
    ListboxGroupLabel,
    ListboxItem,
    ListboxItemIcon,
    ListboxItemIndicator,
    ListboxSeparator,
  } from "@ui-sdk/svelte"
  import { onItemsChange } from "tests/fixtures/items.ts"
  import {
    changedToppings,
    listboxAction,
    listboxData,
    listboxFixture as f,
    listboxOptions,
    longToppings,
  } from "tests/fixtures/listbox.ts"
  import { serializeForm } from "tests/fixtures/select.ts"

  let { data = false }: { data?: boolean } = $props()

  const controller = createListboxController<string, boolean>()
  const {
    fieldset,
    grouped,
    cancel,
    long,
    controlled,
    defaultValue,
    ...options
  } = listboxOptions()
  let action = $state("")
  let reason = $state("")
  let submitted = $state("")
  let value = $state.raw<unknown>(
    defaultValue ?? (options.multiple ? [] : null)
  )
  let list = $state.raw(f.items)
  // Items a spec swaps in. Only in the browser: the server has no document.
  $effect(() => onItemsChange(changedToppings, (next) => (list = next)))
  const items = $derived(
    long ? longToppings() : grouped ? listboxData(true) : list
  )
  // What both the data listbox and the composed one take.
  const shared = $derived({
    ...options,
    ...(controlled ? { value } : { defaultValue }),
    class: "listbox",
    "aria-label": f.label,
    name: f.name,
    controller,
  })

  // What the composed list holds, in order: the items, or groups with a separator between.
  type Listed =
    | {
        type: "item"
        key: string
        value: string
        label: string
        disabled?: boolean
      }
    | {
        type: "group"
        key: string
        label: string
        items: { value: string; label: string }[]
      }
    | { type: "separator"; key: string }
  const listed = $derived<Listed[]>(
    grouped
      ? f.groups.flatMap((group, index): Listed[] => [
          ...(index
            ? [{ type: "separator" as const, key: `separator-${index}` }]
            : []),
          {
            type: "group",
            key: group.label,
            label: group.label,
            items: group.items,
          },
        ])
      : (long ? longToppings() : list).map((item) => ({
          type: "item",
          key: item.value,
          ...item,
        }))
  )

  function onValueChange(
    next: unknown,
    details: { reason: string; cancel: () => void }
  ) {
    reason = details.reason
    if (cancel) {
      return details.cancel()
    }
    value = next
    action = listboxAction(next)
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = serializeForm(event.target as HTMLFormElement)
  }
</script>

<div class="fixture">
  <button>Before</button>
  <form class="select-form" aria-label={f.formLabel} onsubmit={onSubmit}>
    <svelte:element
      this={fieldset ? "fieldset" : "div"}
      disabled={fieldset || undefined}
      style="display: contents"
    >
      <!-- A data listbox knows every option from its items, and renders the same parts. -->
      <Listbox {...shared} items={data ? items : undefined} {onValueChange}>
        {#each listed as item (item.key)}
          {#if item.type === "separator"}
            <ListboxSeparator class="separator" />
          {:else if item.type === "group"}
            <ListboxGroup class="group">
              <ListboxGroupLabel class="label">{item.label}</ListboxGroupLabel>
              {#each item.items as child (child.value)}
                <ListboxItem class="item" value={child.value}>
                  <ListboxItemIcon class="icon" />
                  {child.label}
                  <ListboxItemIndicator class="indicator"
                    >✓</ListboxItemIndicator
                  >
                </ListboxItem>
              {/each}
            </ListboxGroup>
          {:else}
            <ListboxItem
              class="item"
              value={item.value}
              disabled={item.disabled}
            >
              <ListboxItemIcon class="icon" />
              {item.label}
              <ListboxItemIndicator class="indicator">✓</ListboxItemIndicator>
            </ListboxItem>
          {/if}
        {/each}
      </Listbox>
    </svelte:element>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Reason">{reason}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
  <button onclick={() => controller.clear()}>{f.clear}</button>
  <button onclick={() => controller.selectAll()}>{f.selectAll}</button>
</div>
