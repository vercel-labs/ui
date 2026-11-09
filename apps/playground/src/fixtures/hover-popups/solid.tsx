import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui-sdk/solid/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@ui-sdk/solid/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/solid/tooltip"
import { render } from "@solidjs/web"
import { createSignal, For } from "solid-js"
import {
  describeChange,
  hoverPopupsFixture as fixture,
} from "tests/fixtures/hover-popups.ts"

function Fixture() {
  const [change, setChange] = createSignal("")
  return (
    <div class="fixture">
      <button>Before</button>
      <Tooltip
        delay={0}
        onOpenChange={(open, { event }) =>
          open && setChange(describeChange("tooltip", "open", event))
        }
        onPayloadChange={(payload, { event }) =>
          setChange(describeChange("tooltip", `payload ${payload}`, event))
        }
      >
        <For each={fixture.days}>
          {(day) => (
            <TooltipTrigger payload={day.toLowerCase()}>{day}</TooltipTrigger>
          )}
        </For>
        <TooltipContent class="tooltip">
          {(state) => `Tip for ${state.payload}`}
        </TooltipContent>
      </Tooltip>
      <HoverCard
        delay={0}
        closeDelay={0}
        onOpenChange={(open, { event }) =>
          open && setChange(describeChange("hover card", "open", event))
        }
        onPayloadChange={(payload, { event }) =>
          setChange(describeChange("hover card", `payload ${payload}`, event))
        }
      >
        <For each={fixture.people}>
          {(person) => (
            <HoverCardTrigger
              href={`#${person}`}
              payload={person.toLowerCase()}
            >
              {person}
            </HoverCardTrigger>
          )}
        </For>
        <HoverCardContent class="hover-card">
          {(state) => `Card for ${state.payload}`}
        </HoverCardContent>
      </HoverCard>
      <Popover
        openOnHover
        delay={0}
        closeDelay={0}
        onOpenChange={(open, { event }) =>
          open && setChange(describeChange("popover", "open", event))
        }
      >
        <PopoverTrigger>{fixture.popover.trigger}</PopoverTrigger>
        <PopoverContent class="popup">{fixture.popover.content}</PopoverContent>
      </Popover>
      <output role="status" aria-label="Last change">
        {change()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
