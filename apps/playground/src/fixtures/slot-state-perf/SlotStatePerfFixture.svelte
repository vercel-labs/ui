<script lang="ts">
  import { menu } from "@ui-sdk/core/menu"
  import { usePrimitive } from "@ui-sdk/svelte/primitive"
  import {
    countSubscriptions,
    perfItems,
    perfSize,
  } from "tests/fixtures/perf.ts"
  import SlotStateItem from "./SlotStateItem.svelte"

  // Custom parts built on `usePart`, which the specs render again and again
  // to count how often each part subscribes to its instance.
  const items = perfItems(perfSize())
  const id = $props.id()
  const handle = usePrimitive(menu, () => ({ id }))
  countSubscriptions(handle.instance)
  let renders = $state(0)
</script>

<div class="fixture">
  <button>Before</button>
  <button onclick={() => renders++}>Render again</button>
  <output aria-label="Renders">{renders}</output>
  <div role="menu" aria-label="Items">
    {#each items as item (item.value)}
      <SlotStateItem
        {handle}
        value={item.value}
        label={item.label}
        round={renders}
      />
    {/each}
  </div>
  <button>After</button>
</div>
