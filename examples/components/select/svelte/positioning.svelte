<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Select,
    SelectArrow,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
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

  const sides = ["top", "right", "bottom", "left"] as const
  const aligns = ["start", "center", "end"] as const

  let side = $state<(typeof sides)[number]>("bottom")
  let align = $state<(typeof aligns)[number]>("start")
  let box: HTMLDivElement | undefined = $state()
  let anchored = $state(false)
</script>

<div data-slot="stack">
  <div data-slot="stack">
    <div role="group" aria-label="Side" data-slot="row">
      {#each sides as value (value)}
        <button type="button" aria-pressed={side === value} onclick={() => (side = value)}>
          {value}
        </button>
      {/each}
    </div>
    <div role="group" aria-label="Align" data-slot="row">
      {#each aligns as value (value)}
        <button type="button" aria-pressed={align === value} onclick={() => (align = value)}>
          {value}
        </button>
      {/each}
    </div>
    <label data-slot="label">
      <input bind:checked={anchored} type="checkbox" />
      Anchor to the box
    </label>
  </div>
  <div bind:this={box} data-slot="card">
    <Select defaultValue="apple">
      <SelectTrigger aria-label="Fruit">
        <SelectValue />
        <ChevronDownIcon />
      </SelectTrigger>
      <SelectContent
        {side}
        {align}
        sideOffset={10}
        alignOffset={0}
        collisionPadding={16}
        anchor={anchored ? box : null}
      >
        <SelectArrow />
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
  </div>
</div>
