import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

type Member = { id: number; name: string; email: string }

const members: Member[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com" },
  { id: 3, name: "Alan Turing", email: "alan@example.com" },
  { id: 4, name: "Margaret Hamilton", email: "margaret@example.com" },
]

export function Example() {
  return (
    <Select defaultValue="1">
      <div data-slot="stack">
        <SelectLabel>Reviewer</SelectLabel>
        <SelectTrigger
          render={(props) => (
            <button {...props}>
              {props.children}
              <ChevronDownIcon />
            </button>
          )}
        >
          <SelectValue>
            {(state) => {
              const member = members.find((candidate) => String(candidate.id) === state.value)
              return (
                <>
                  <span data-slot="badge">{member?.name.slice(0, 1)}</span>
                  {state.label}
                </>
              )
            }}
          </SelectValue>
        </SelectTrigger>
      </div>
      <SelectContent>
        {members.map((member) => (
          <SelectItem
            key={member.id}
            value={String(member.id)}
            label={member.name}
            disabled={member.id === 4}
          >
            {(state) => (
              <>
                <span data-slot="badge">{member.name.slice(0, 1)}</span>
                <span data-slot="stack">
                  {member.name}
                  <span data-slot="hint">{state.disabled ? "Out of office" : member.email}</span>
                </span>
                <SelectItemIndicator
                  render={(props, indicator) => <span {...props}>{indicator.selected && <CheckIcon />}</span>}
                />
              </>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
