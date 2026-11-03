"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

type Member = { id: number; name: string; email: string }

const members: Member[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com" },
  { id: 3, name: "Alan Turing", email: "alan@example.com" },
  { id: 4, name: "Margaret Hamilton", email: "margaret@example.com" },
]

function Example() {
  const [assignee, setAssignee] = React.useState<Member | null>({ ...members[1] })

  return (
    <div data-slot="stack">
      <Select
        value={assignee}
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
            <ChevronDownIcon />
          </SelectTrigger>
        </div>
        <SelectContent>
          {members.map((member) => (
            <SelectItem key={member.id} value={member}>
              <span>{member.name}</span>
              <span data-slot="hint">{member.email}</span>
              <SelectItemIndicator>
                <CheckIcon />
              </SelectItemIndicator>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <output data-slot="output">Submits assignee={assignee ? assignee.id : ""}</output>
    </div>
  )
}

export { Example }
