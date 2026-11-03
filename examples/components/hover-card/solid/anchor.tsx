import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/solid/hover-card"
import { createSignal } from "solid-js"

const ada = {
  handle: "ada",
  name: "Ada Lovelace",
  initials: "AL",
  bio: "Wrote the first published program, for the Analytical Engine.",
}

function Example() {
  const [row, setRow] = createSignal<HTMLDivElement | null>(null)

  return (
    <div data-slot="card" ref={setRow}>
      <div data-slot="avatar" aria-hidden="true">
        {ada.initials}
      </div>
      <div data-slot="row">
        <HoverCard>
          <HoverCardTrigger href="https://example.com/people/ada">{ada.name}</HoverCardTrigger>
          <HoverCardContent anchor={row()} align="start">
            <p>@{ada.handle}</p>
            <p>{ada.bio}</p>
          </HoverCardContent>
        </HoverCard>
        <span data-slot="hint">committed “Fix the loop”</span>
      </div>
      <span data-slot="hint">2h ago</span>
    </div>
  )
}

export { Example }
