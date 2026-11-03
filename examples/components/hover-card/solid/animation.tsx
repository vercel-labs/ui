import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/solid/hover-card"
import { createSignal } from "solid-js"

const grace = {
  handle: "grace",
  name: "Grace Hopper",
  bio: "Built the first compiler and popularized the word “debugging”.",
}

function Example() {
  const [status, setStatus] = createSignal("Closed")

  return (
    <div data-slot="stack">
      <HoverCard
        onOpenChange={(open) => setStatus(open ? "Opening" : "Closing")}
        onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
      >
        <HoverCardTrigger href="https://example.com/people/grace">@{grace.handle}</HoverCardTrigger>
        <HoverCardContent keepMounted>
          <p>{grace.name}</p>
          <p>{grace.bio}</p>
        </HoverCardContent>
      </HoverCard>
      <output data-slot="output">{status()}</output>
    </div>
  )
}

export { Example }
