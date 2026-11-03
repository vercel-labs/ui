import * as React from "react"
import {
  createPopup,
  definePrimitive,
  popupArrow,
  popupContent,
  popupDescription,
  popupState,
  popupTitle,
  popupTrigger,
  type ChangeDetails,
} from "@ui-sdk/core"
import { popoverPreset } from "@ui-sdk/core/popover"
import { createParts } from "@ui-sdk/react/primitive"

type Person = { name: string; role: string; initials: string }

type TeamCardOptions = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: ChangeDetails<string>) => void
  onPayloadChange?: (person: unknown, details: ChangeDetails<string>) => void
}

const teamCard = definePrimitive({
  name: "team-card",
  options: { open: "boolean", defaultOpen: "boolean", onOpenChange: "callback", onPayloadChange: "callback" },
  state: (options: TeamCardOptions) => popupState(options),
  sync: (options) => (options.open === undefined ? {} : { open: options.open }),
  api: (context) => createPopup(context, { preset: popoverPreset }),
  slots: (slot) => ({
    trigger: popupTrigger(slot),
    content: popupContent(slot),
    title: popupTitle(slot),
    description: popupDescription(slot),
    arrow: popupArrow(slot),
  }),
})

const parts = createParts(teamCard, {
  trigger: "button",
  content: "div",
  title: "p",
  description: "p",
  arrow: "span",
})

const TeamCard = parts.Root

const TeamCardTrigger = parts.Trigger

const TeamCardContent = parts.Content

const TeamCardTitle = parts.Title

const TeamCardDescription = parts.Description

const TeamCardArrow = parts.Arrow

const team: Person[] = [
  { name: "Ada Lovelace", role: "Engineering", initials: "AL" },
  { name: "Grace Hopper", role: "Compilers", initials: "GH" },
  { name: "Alan Turing", role: "Research", initials: "AT" },
]

function Example() {
  const [shown, setShown] = React.useState("")
  return (
    <div data-slot="stack">
      <TeamCard
        onPayloadChange={(person: unknown, details: ChangeDetails<string>) =>
          setShown(`${(person as Person).name}, by ${details.reason}`)
        }
      >
        <div data-slot="row">
          {team.map((person) => (
            <TeamCardTrigger key={person.initials} payload={person} aria-label={person.name}>
              {person.initials}
            </TeamCardTrigger>
          ))}
        </div>
        <TeamCardContent sideOffset={8}>
          {(state) => {
            const person = state.payload as Person | undefined
            return (
              <>
                <TeamCardArrow />
                <TeamCardTitle>{person?.name}</TeamCardTitle>
                <TeamCardDescription>{person?.role}</TeamCardDescription>
              </>
            )
          }}
        </TeamCardContent>
      </TeamCard>
      <p data-team-shown data-slot="output">
        {shown}
      </p>
    </div>
  )
}

export {
  Example,
  type Person,
  teamCard,
  TeamCard,
  TeamCardArrow,
  TeamCardContent,
  TeamCardDescription,
  type TeamCardOptions,
  TeamCardTitle,
  TeamCardTrigger,
}
