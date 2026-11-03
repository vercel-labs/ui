<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    createSelectController,
  } from "@ui-sdk/svelte/select"

  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ]

  const fruit = createSelectController<string>()
  let log = $state("")

  async function openFruit() {
    const { reason } = await fruit.open()
    log = `Closed by ${reason}, with ${fruit.getValue() ?? "nothing"}`
  }
</script>

<div data-slot="stack">
  <div data-slot="row">
    <span data-slot="hint">Toolbar</span>
    <SelectTrigger controller={fruit} aria-label="Fruit" />
  </div>
  <Select controller={fruit} items={fruits} placeholder="Fruit">
    <SelectContent>
      {#each fruits as item (item.value)}
        <SelectItem value={item.value}>
          {item.label}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>
  <div data-slot="row">
    <button type="button" onclick={openFruit}>
      Open
    </button>
    <button type="button" onclick={() => fruit.setValue("banana")}>
      Banana
    </button>
    <button type="button" onclick={() => fruit.clear()}>
      Clear
    </button>
    <button type="button" onclick={() => fruit.focus()}>
      Focus
    </button>
  </div>
  <output data-slot="output">{log || "Use the buttons"}</output>
</div>
