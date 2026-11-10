import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
  createTimelineController,
} from "@ui-sdk/react/timeline"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/react/collapsible"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import type { Variant } from "./variants"

function VariantTimeline({ variant, env }: { variant: Variant; env: Env }) {
  const [controller] = React.useState(() =>
    variant.controller ? createTimelineController() : undefined
  )
  React.useEffect(() => {
    if (!controller) {
      return
    }
    env.controls([
      ['focus("shipped")', () => controller.focus("shipped")],
      ["focus()", () => controller.focus()],
    ])
  }, [controller, env])
  return (
    <Timeline
      className={classes.root}
      aria-label={variant.title}
      controller={controller}
      {...variant.options}
    >
      {variant.events.map((event) => (
        <TimelineItem
          key={event.value}
          className={classes.item}
          value={event.value}
          status={event.status}
          onFocus={(focusEvent) =>
            focusEvent.target === focusEvent.currentTarget &&
            env.log(`focus ${event.value}`)
          }
        >
          <TimelineMarker className={classes.marker} />
          <TimelineConnector className={classes.connector} />
          <TimelineTitle className={classes.title}>{event.title}</TimelineTitle>
          <TimelineTime className={classes.time} dateTime={event.dateTime}>
            {event.time}
          </TimelineTime>
          <TimelineDescription className={classes.description}>
            {event.description}
          </TimelineDescription>
          {event.link && (
            <a className={classes.link} href={`#${event.value}`}>
              {event.link}
            </a>
          )}
          {variant.details && (
            <Collapsible className="col-start-2">
              <CollapsibleTrigger className={classes.link}>
                Details
              </CollapsibleTrigger>
              <CollapsiblePanel className={classes.description}>
                Handled by the {event.title.toLowerCase()} team.
              </CollapsiblePanel>
            </Collapsible>
          )}
        </TimelineItem>
      ))}
    </Timeline>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantTimeline variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
