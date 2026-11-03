import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { createSignal, For } from "solid-js"

type Member = { id: number; name: string; email: string }

const members: Member[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com" },
  { id: 3, name: "Alan Turing", email: "alan@example.com" },
  { id: 4, name: "Margaret Hamilton", email: "margaret@example.com" },
]

function Example() {
  const [assignee, setAssignee] = createSignal<Member | null>({ ...members[1] })

  return (
    <div data-slot="stack">
      <Select
        value={assignee()}
        onValueChange={setAssignee}
        name="assignee"
        itemToValue={(member) => String(member.id)}
        itemToLabel={(member) => member.name}
        isItemEqualToValue={(item, value) => item.id === value.id}
        placeholder="Unassigned"
      >
        <div data-slot="stack">
          <SelectLabel>Assignee</SelectLabel>
          <SelectTrigger>
            <SelectValue />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </SelectTrigger>
        </div>
        <SelectContent>
          <For each={members}>
            {(member) => (
              <SelectItem value={member}>
                <span>{member.name}</span>
                <span data-slot="hint">{member.email}</span>
                <SelectItemIndicator>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </SelectItemIndicator>
              </SelectItem>
            )}
          </For>
        </SelectContent>
      </Select>
      <output data-slot="output">Submits assignee={assignee()?.id ?? ""}</output>
    </div>
  )
}

export { Example }
