<script lang="ts">
  import {
    Combobox,
    ComboboxContent,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
  } from "@ui-sdk/svelte"
  import { comboboxFixture as f } from "tests/fixtures/combobox.ts"
</script>

<!-- Parts rendered as other elements, with render snippets and class names of state. -->
<div class="fixture">
  <button>Before</button>
  <Combobox name={f.name}>
    <ComboboxLabel class="label">{f.label}</ComboboxLabel>
    <ComboboxInput>
      {#snippet render({ props, state })}
        <input
          {...props}
          class={["input", state.open ? "is-open" : "is-closed"]}
        />
      {/snippet}
    </ComboboxInput>
    <ComboboxTrigger aria-label={f.trigger}>▾</ComboboxTrigger>
    <ComboboxContent class="popup list-popup">
      <ComboboxList>
        <ComboboxItem class="item" value="docs" label="Docs" href="#docs">
          {#snippet render({ props })}
            <a {...props}>Docs</a>
          {/snippet}
        </ComboboxItem>
        {#each f.items.slice(0, 3) as item (item.value)}
          <ComboboxItem class="item" value={item.value} label={item.label}>
            {#snippet children(state)}
              {item.label}{state.highlighted ? " ←" : ""}
            {/snippet}
          </ComboboxItem>
        {/each}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <button>After</button>
</div>
