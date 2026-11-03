import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { For, Show } from "solid-js"

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
        <For each={members}>
          {(member) => (
            <SelectItem value={String(member.id)} label={member.name} disabled={member.id === 4}>
              {(state) => (
                <>
                  <span data-slot="badge">{member.name.slice(0, 1)}</span>
                  <span data-slot="stack">
                    {member.name}
                    <span data-slot="hint">{state.disabled ? "Out of office" : member.email}</span>
                  </span>
                  <SelectItemIndicator
                    render={(props, indicator) => (
                      <span {...props}>
                        <Show when={indicator.selected}>
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
                        </Show>
                      </span>
                    )}
                  />
                </>
              )}
            </SelectItem>
          )}
        </For>
      </SelectContent>
    </Select>
  )
}
