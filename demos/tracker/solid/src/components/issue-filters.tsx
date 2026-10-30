import { For } from "solid-js"
import { people, personOf, priorities, type Query } from "tracker-data"
import { Avatar } from "@/components/ui/avatar"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select"

const priorityItems = [{ value: "any", label: "Any priority" }, ...priorities]

function IssueFilters(props: { query: Query; onChange: (patch: Partial<Query>) => void; stacked?: boolean }) {
  const label = () => (props.stacked ? undefined : "sr-only")
  return (
    <div class={props.stacked ? "grid gap-4" : "flex items-center gap-2"}>
      <Select
        items={priorityItems}
        value={props.query.priority ?? "any"}
        onValueChange={(value) =>
          props.onChange({ priority: value === "any" ? null : (value as Query["priority"]), page: 1 })
        }
      >
        <div class="grid gap-2">
          <SelectLabel class={label()}>{props.stacked ? "Priority" : "Filter by priority"}</SelectLabel>
          <SelectTrigger class={props.stacked ? undefined : "w-36"} />
        </div>
        <SelectContent>
          <For each={priorityItems}>
            {(priority) => <SelectItem value={priority.value}>{priority.label}</SelectItem>}
          </For>
        </SelectContent>
      </Select>
      <Combobox
        value={props.query.assignee}
        onValueChange={(value) => props.onChange({ assignee: value as string | null, page: 1 })}
        itemToLabel={(id: string) => personOf(id)?.name ?? ""}
      >
        <div class="grid gap-2">
          <ComboboxLabel class={label()}>{props.stacked ? "Assignee" : "Filter by assignee"}</ComboboxLabel>
          <div class={props.stacked ? "relative" : "relative w-40"}>
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
            <For each={people}>
              {(person) => (
                <ComboboxItem value={person.id} label={person.name}>
                  <Avatar name={person.name} size="sm" decorative />
                  {person.name}
                </ComboboxItem>
              )}
            </For>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export { IssueFilters }
