import {
  createHoverCardController,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/solid/hover-card"
import { For } from "solid-js"

const people = [
  {
    handle: "ada",
    name: "Ada Lovelace",
    initials: "AL",
    bio: "Wrote the first published program, for the Analytical Engine.",
  },
  {
    handle: "grace",
    name: "Grace Hopper",
    initials: "GH",
    bio: "Built the first compiler and popularized the word “debugging”.",
  },
  {
    handle: "alan",
    name: "Alan Turing",
    initials: "AT",
    bio: "Described the universal machine every computer descends from.",
  },
]

type Person = (typeof people)[number]

function Example() {
  const card = createHoverCardController<Person>()
  return (
    <>
      <ul>
        <For each={people}>
          {(person) => (
            <li data-slot="row">
              <HoverCardTrigger
                controller={card}
                payload={person}
                href={`https://example.com/people/${person.handle}`}
              >
                {person.name}
              </HoverCardTrigger>
              <span data-slot="hint">@{person.handle}</span>
            </li>
          )}
        </For>
      </ul>
      <HoverCard controller={card}>
        <HoverCardContent<Person> align="start">
          {(state) => {
            const person = () => state.payload
            return (
              <div data-slot="row">
                <div data-slot="avatar" aria-hidden="true">
                  {person()?.initials}
                </div>
                <div data-slot="stack">
                  <p>{person()?.name}</p>
                  <p>{person()?.bio}</p>
                  <a href={`https://example.com/people/${person()?.handle}`}>View profile</a>
                </div>
              </div>
            )
          }}
        </HoverCardContent>
      </HoverCard>
    </>
  )
}

export { Example }
