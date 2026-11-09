<script lang="ts">
  import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
  } from "@ui-sdk/svelte"
  import { perfItems, perfModal, perfSize } from "tests/fixtures/perf.ts"

  // Many popovers on one page, like a row action in every row of a table, for
  // the counts specs. Only the first one is opened. ?modal opens them modal.
  const items = perfItems(perfSize())
  const modal = perfModal()
</script>

<div class="fixture" style="flex-wrap: wrap">
  <button>Before</button>
  {#each items as item (item.value)}
    <Popover {modal}>
      <PopoverTrigger>{item.label}</PopoverTrigger>
      <PopoverContent class="popup" aria-label={item.label}>
        {item.label} details.
        <PopoverClose>Close</PopoverClose>
      </PopoverContent>
    </Popover>
  {/each}
  <button>After</button>
</div>
