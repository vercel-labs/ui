<script lang="ts">
  import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@ui-sdk/svelte"
  import { commandFixture as f } from "tests/fixtures/command.ts"

  let action = $state("")

  function onAction(value: string) {
    action = `action:${value}`
  }
</script>

<!-- Parts rendered as other elements, with render snippets and class names of state. -->
<div class="fixture">
  <button>Before</button>
  <Command {onAction}>
    {#snippet render({ props, state })}
      <div {...props} class={["command", state.page ? "is-paged" : "is-first"]}>
        <CommandInput class="input" aria-label={f.input} />
        <CommandList class="command-list">
          <CommandItem class="item" value="docs" href="#docs">
            {#snippet render({ props })}
              <a {...props}>Docs</a>
            {/snippet}
          </CommandItem>
          {#each f.groups[0].items.slice(0, 2) as item (item.value)}
            <CommandItem value={item.value} label={item.label}>
              {#snippet render({ props, state: itemState })}
                <div
                  {...props}
                  class={[
                    "item",
                    itemState.highlighted ? "is-highlighted" : "",
                  ]}
                >
                  {item.label}{itemState.highlighted ? " ←" : ""}
                </div>
              {/snippet}
            </CommandItem>
          {/each}
        </CommandList>
      </div>
    {/snippet}
  </Command>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
