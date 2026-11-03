<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
  import {
    Select,
    SelectContent,
    SelectEmpty,
    SelectGroup,
    SelectGroupLabel,
    SelectInput,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectLabel,
    SelectList,
    SelectTrigger,
    SelectValue,
  } from "@ui-sdk/svelte/select"

  const produce = [
    {
      label: "Fruits",
      items: [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "orange", label: "Orange" },
      ],
    },
    {
      label: "Vegetables",
      items: [
        { value: "carrot", label: "Carrot" },
        { value: "broccoli", label: "Broccoli" },
        { value: "spinach", label: "Spinach" },
      ],
    },
  ]
</script>

<Select placeholder="Select produce">
  <div data-slot="stack">
    <SelectLabel>Produce</SelectLabel>
    <SelectTrigger>
      <SelectValue />
      <ChevronDownIcon />
    </SelectTrigger>
  </div>
  <SelectContent>
    <SelectInput aria-label="Search produce" placeholder="Search…" />
    <SelectEmpty>Nothing found.</SelectEmpty>
    <SelectList>
      {#each produce as group (group.label)}
        <SelectGroup>
          <SelectGroupLabel>
            {group.label}
          </SelectGroupLabel>
          {#each group.items as item (item.value)}
            <SelectItem value={item.value} label={item.label}>
              <SelectItemText>
                {#snippet render({ props, state })}
                  <span {...props}>
                    {#each state.segments as segment, index (index)}
                      {#if segment.match}
                        <b>{segment.text}</b>
                      {:else}
                        {segment.text}
                      {/if}
                    {/each}
                  </span>
                {/snippet}
              </SelectItemText>
              <SelectItemIndicator>
                <CheckIcon />
              </SelectItemIndicator>
            </SelectItem>
          {/each}
        </SelectGroup>
      {/each}
    </SelectList>
  </SelectContent>
</Select>
