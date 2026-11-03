import {
  createHoverCardController,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/solid/hover-card"
import { createSignal } from "solid-js"

const grace = {
  handle: "grace",
  name: "Grace Hopper",
  bio: "Built the first compiler and popularized the word “debugging”.",
}

function Example() {
  const card = createHoverCardController()
  const [open, setOpen] = createSignal(false)
  const [reason, setReason] = createSignal("")

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <HoverCard
          open={open()}
          onOpenChange={(next, details) => {
            setOpen(next)
            setReason(details.reason)
          }}
          controller={card}
        >
          <HoverCardTrigger href="https://example.com/people/grace">@{grace.handle}</HoverCardTrigger>
          <HoverCardContent>
            <p>{grace.name}</p>
            <p>{grace.bio}</p>
          </HoverCardContent>
        </HoverCard>
        <button type="button" onClick={() => card.open()}>
          Show from elsewhere
        </button>
      </div>
      <output data-slot="output">
        {open() ? "Open" : "Closed"}
        {reason() && `, last change: ${reason()}`}
      </output>
    </div>
  )
}

export { Example }
