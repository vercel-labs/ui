import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/solid/hover-card"

const ada = {
  handle: "ada",
  initials: "AL",
  bio: "Wrote the first published program, for the Analytical Engine.",
  joined: "Joined December 1842",
}

function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger href="https://example.com/people/ada">@{ada.handle}</HoverCardTrigger>
      <HoverCardContent>
        <div data-slot="row">
          <div data-slot="avatar" aria-hidden="true">
            {ada.initials}
          </div>
          <div data-slot="stack">
            <p>@{ada.handle}</p>
            <p>{ada.bio}</p>
            <p data-slot="hint">{ada.joined}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export { Example }
