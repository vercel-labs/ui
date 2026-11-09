<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte"
  import { selectFixture as f } from "tests/fixtures/select.ts"
</script>

<!-- Parts rendered as other elements, with render snippets and class names of state. -->
<div class="fixture">
  <button>Before</button>
  <Select name={f.name} placeholder={f.placeholder}>
    <SelectLabel class="label">{f.label}</SelectLabel>
    <SelectTrigger>
      {#snippet render({ props, state })}
        <button
          {...props}
          class={["trigger", state.open ? "is-open" : "is-closed"]}
        >
          <SelectValue />
          <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
        </button>
      {/snippet}
    </SelectTrigger>
    <SelectContent class="popup list-popup">
      <SelectItem class="item" value="docs" href="#docs">
        {#snippet render({ props })}
          <a {...props}>Docs</a>
        {/snippet}
      </SelectItem>
      {#each f.items.slice(0, 3) as item (item.value)}
        <SelectItem class="item" value={item.value}>{item.label}</SelectItem>
      {/each}
    </SelectContent>
  </Select>
  <button>After</button>
</div>
