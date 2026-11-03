<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"

  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
  ]

  const modes = [
    { value: "pointer", label: "Pointer" },
    { value: true, label: "Modal" },
    { value: false, label: "Non-modal" },
  ] as const

  let modal = $state<boolean | "pointer">("pointer")
  let presses = $state(0)
</script>

<div data-slot="stack">
  <div role="group" aria-label="Modal" data-slot="row">
    {#each modes as mode (mode.label)}
      <button type="button" aria-pressed={modal === mode.value} onclick={() => (modal = mode.value)}>
        {mode.label}
      </button>
    {/each}
  </div>
  <Select {modal} defaultValue="apple">
    <div data-slot="stack">
      <SelectLabel>Fruit</SelectLabel>
      <SelectTrigger>
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
    </div>
    <SelectContent>
      {#each fruits as fruit (fruit.value)}
        <SelectItem value={fruit.value}>
          {fruit.label}
          <SelectItemIndicator>
            <CheckIcon />
          </SelectItemIndicator>
        </SelectItem>
      {/each}
    </SelectContent>
  </Select>
  <button type="button" onclick={() => presses++}>
    Pressed {presses} times
  </button>
</div>
