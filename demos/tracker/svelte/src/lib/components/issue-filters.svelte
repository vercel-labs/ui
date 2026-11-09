<script lang="ts">
  import { Avatar } from "#ui/avatar"
  import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
  } from "#ui/combobox"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
  } from "#ui/select"
  import { people, personOf, priorities, type Query } from "tracker-data"

  let {
    query,
    onChange,
    stacked = false,
  }: {
    query: Query
    onChange: (patch: Partial<Query>) => void
    stacked?: boolean
  } = $props()

  const priorityItems = [{ value: "any", label: "Any priority" }, ...priorities]
  const label = $derived(stacked ? undefined : "sr-only")
</script>

<div class={stacked ? "grid gap-4" : "flex items-center gap-2"}>
  <Select
    items={priorityItems}
    value={query.priority ?? "any"}
    onValueChange={(value) =>
      onChange({
        priority: value === "any" ? null : (value as Query["priority"]),
        page: 1,
      })}
  >
    <div class="grid gap-2">
      <SelectLabel class={label}
        >{stacked ? "Priority" : "Filter by priority"}</SelectLabel
      >
      <SelectTrigger class={stacked ? undefined : "w-36"} />
    </div>
    <SelectContent>
      {#each priorityItems as priority (priority.value)}
        <SelectItem value={priority.value}>{priority.label}</SelectItem>
      {/each}
    </SelectContent>
  </Select>
  <Combobox
    value={query.assignee}
    onValueChange={(value) =>
      onChange({ assignee: value as string | null, page: 1 })}
    itemToLabel={(id: string) => personOf(id)?.name ?? ""}
  >
    <div class="grid gap-2">
      <ComboboxLabel class={label}
        >{stacked ? "Assignee" : "Filter by assignee"}</ComboboxLabel
      >
      <div class={stacked ? "relative" : "relative w-40"}>
        <ComboboxInput
          placeholder="Anyone"
          class="h-8 w-full rounded-2xl bg-input/50 px-2.5 pe-8 focus-visible:ring-3 focus-visible:ring-ring/30"
        />
        <ComboboxTrigger aria-label="Show people" />
      </div>
    </div>
    <ComboboxContent>
      <ComboboxEmpty>Nobody matches.</ComboboxEmpty>
      <ComboboxList>
        {#each people as person (person.id)}
          <ComboboxItem value={person.id} label={person.name}>
            <Avatar name={person.name} size="sm" decorative />
            {person.name}
          </ComboboxItem>
        {/each}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</div>
