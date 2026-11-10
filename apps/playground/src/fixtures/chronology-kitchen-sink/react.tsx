import {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
  createChronologyController,
} from "@ui-sdk/react/chronology"
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

function VariantChronology({ variant, env }: { variant: Variant; env: Env }) {
  const [controller] = React.useState(() =>
    variant.controller ? createChronologyController() : undefined
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
    <Chronology
      className={classes.root}
      aria-label={variant.title}
      controller={controller}
      {...variant.options}
    >
      {variant.events.map((event) => (
        <ChronologyItem
          key={event.value}
          className={classes.item}
          value={event.value}
          status={event.status}
          onFocus={(focusEvent) =>
            focusEvent.target === focusEvent.currentTarget &&
            env.log(`focus ${event.value}`)
          }
        >
          <ChronologyMarker className={classes.marker} />
          <ChronologyConnector className={classes.connector} />
          <ChronologyTitle className={classes.title}>
            {event.title}
          </ChronologyTitle>
          <ChronologyTime className={classes.time} dateTime={event.dateTime}>
            {event.time}
          </ChronologyTime>
          <ChronologyDescription className={classes.description}>
            {event.description}
          </ChronologyDescription>
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
        </ChronologyItem>
      ))}
    </Chronology>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantChronology variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
