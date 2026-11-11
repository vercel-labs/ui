<script lang="ts">
  import { bindScrollPicker } from "@ui-sdk/core"
  import { Listbox, ListboxItem } from "@ui-sdk/svelte"
  import { pickerFixtures } from "tests/fixtures/listbox-picker.ts"

  const pickers = $state(
    pickerFixtures.map((picker) => ({
      value: picker.defaultValue as string | null,
      changes: [] as string[],
    }))
  )

  function choose(index: number, next: string | null) {
    pickers[index].value = next
    pickers[index].changes.push(String(next))
  }
</script>

<div class="fixture">
  <button>Before</button>
  {#each pickerFixtures as picker, index (picker.label)}
    <Listbox
      class="picker"
      aria-label={picker.label}
      orientation={picker.orientation}
      keepInView={false}
      value={pickers[index].value}
      onValueChange={(next) => choose(index, next)}
      {@attach (el) =>
        bindScrollPicker(el, {
          onSelect: (item) => choose(index, picker.items[item].value),
        })}
    >
      {#each picker.items as item (item.value)}
        <ListboxItem
          class="picker-item"
          value={item.value}
          disabled={item.disabled}
        >
          {item.value}
        </ListboxItem>
      {/each}
    </Listbox>
    <output role="status" aria-label={`${picker.label} changes`}
      >{pickers[index].changes.join(",")}</output
    >
  {/each}
  <button>After</button>
</div>
