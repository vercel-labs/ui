"use client"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select"

const priorityItems = [{ value: "any", label: "Any priority" }, ...priorities]

function IssueFilters({
  query,
  onChange,
  stacked = false,
}: {
  query: Query
  onChange: (patch: Partial<Query>) => void
  stacked?: boolean
}) {
  const label = stacked ? undefined : "sr-only"
  return (
    <div className={stacked ? "grid gap-4" : "flex items-center gap-2"}>
      <Select
        items={priorityItems}
        value={query.priority ?? "any"}
        onValueChange={(value) =>
          onChange({
            priority: value === "any" ? null : (value as Query["priority"]),
            page: 1,
          })
        }
      >
        <div className="grid gap-2">
          <SelectLabel className={label}>
            {stacked ? "Priority" : "Filter by priority"}
          </SelectLabel>
          <SelectTrigger className={stacked ? undefined : "w-36"} />
        </div>
        <SelectContent>
          {priorityItems.map((priority) => (
            <SelectItem key={priority.value} value={priority.value}>
              {priority.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Combobox
        value={query.assignee}
        onValueChange={(value) =>
          onChange({ assignee: value as string | null, page: 1 })
        }
        itemToLabel={(id: string) => personOf(id)?.name ?? ""}
      >
        <div className="grid gap-2">
          <ComboboxLabel className={label}>
            {stacked ? "Assignee" : "Filter by assignee"}
          </ComboboxLabel>
          <div className={stacked ? "relative" : "relative w-40"}>
            <ComboboxInput
              placeholder="Anyone"
              className="h-8 w-full rounded-2xl bg-input/50 px-2.5 pe-8 focus-visible:ring-3 focus-visible:ring-ring/30"
            />
            <ComboboxTrigger aria-label="Show people" />
          </div>
        </div>
        <ComboboxContent>
          <ComboboxEmpty>Nobody matches.</ComboboxEmpty>
          <ComboboxList>
            {people.map((person) => (
              <ComboboxItem
                key={person.id}
                value={person.id}
                label={person.name}
              >
                <Avatar name={person.name} size="sm" decorative />
                {person.name}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export { IssueFilters }
