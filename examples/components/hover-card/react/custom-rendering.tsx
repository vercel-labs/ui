"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card"

const ada = {
  handle: "ada",
  name: "Ada Lovelace",
  initials: "AL",
  bio: "Wrote the first published program, for the Analytical Engine.",
}

function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger
        href="https://example.com/people/ada"
        render={(props) => (
          <a {...props}>
            <span data-slot="avatar" aria-hidden="true">
              {ada.initials}
            </span>
            {ada.name}
          </a>
        )}
      />
      <HoverCardContent>
        <p>@{ada.handle}</p>
        <p>{ada.bio}</p>
      </HoverCardContent>
    </HoverCard>
  )
}

export { Example }
