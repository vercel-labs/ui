<script lang="ts">
  import { Listbox, ListboxItem } from "@ui-sdk/svelte"
  import { listboxAction, listboxFixture as f } from "tests/fixtures/listbox.ts"

  let action = $state("")
</script>

<!-- Parts rendered as other elements, with render snippets and class names of state. -->
<div class="fixture">
  <button>Before</button>
  <Listbox
    aria-label={f.label}
    class="listbox"
    activation="manual"
    onValueChange={(value) => (action = listboxAction(value))}
  >
    {#snippet render({ props })}
      <ul {...props}>
        <ListboxItem class="item" value="docs" href="#docs">
          {#snippet render({ props })}
            <a {...props}>Docs</a>
          {/snippet}
        </ListboxItem>
        <ListboxItem value="star">
          {#snippet render({ props, state })}
            <li
              {...props}
              class={["item", state.selected ? "is-selected" : "is-unselected"]}
            >
              {state.selected ? "★" : "☆"} Star
            </li>
          {/snippet}
        </ListboxItem>
        {#each f.items.slice(0, 3) as item (item.value)}
          <ListboxItem class="item" value={item.value}>
            {#snippet render({ props })}
              <li {...props}>{item.label}</li>
            {/snippet}
          </ListboxItem>
        {/each}
      </ul>
    {/snippet}
  </Listbox>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
</div>
