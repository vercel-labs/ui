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

  let value = $state<string | null>("apple")
  let open = $state(false)
  let log = $state("")

  function onValueChange(next: unknown, details: { reason: string; cancel: () => void }) {
    if (next === "pineapple") {
      details.cancel()
      log = "Pineapple is sold out"
      return
    }
    log = `value: ${next} (${details.reason})`
  }

  function onOpenChange(next: boolean, details: { reason: string }) {
    log = `open: ${next} (${details.reason})`
  }
</script>

<div data-slot="stack">
  <Select bind:value bind:open debug {onValueChange} {onOpenChange}>
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
  <div data-slot="row">
    <button type="button" onclick={() => (value = "blueberry")}>
      Blueberry
    </button>
    <button type="button" onclick={() => (open = true)}>
      Open
    </button>
  </div>
  <output data-slot="output">{log || "Change something"}</output>
</div>
