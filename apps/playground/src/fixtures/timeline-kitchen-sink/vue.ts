import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
  createTimelineController,
} from "@ui-sdk/vue/timeline"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/vue/collapsible"
import { createApp, defineComponent, h, type PropType } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import type { Event, Variant } from "./variants"

const VariantTimeline = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true as const },
    env: { type: Object as PropType<Env>, required: true as const },
  },
  setup({ variant, env }) {
    const controller = variant.controller
      ? createTimelineController()
      : undefined
    if (controller) {
      env.controls([
        ['focus("shipped")', () => controller.focus("shipped")],
        ["focus()", () => controller.focus()],
      ])
    }
    const details = (event: Event) =>
      h(Collapsible, { class: "col-start-2" }, () => [
        h(CollapsibleTrigger, { class: classes.link }, () => "Details"),
        h(
          CollapsiblePanel,
          { class: classes.description },
          () => `Handled by the ${event.title.toLowerCase()} team.`
        ),
      ])
    const item = (event: Event) =>
      h(
        TimelineItem,
        {
          key: event.value,
          class: classes.item,
          value: event.value,
          status: event.status,
          onFocus: (focusEvent: FocusEvent) =>
            focusEvent.target === focusEvent.currentTarget &&
            env.log(`focus ${event.value}`),
        },
        () => [
          h(TimelineMarker, { class: classes.marker }),
          h(TimelineConnector, { class: classes.connector }),
          h(TimelineTitle, { class: classes.title }, () => event.title),
          h(
            TimelineTime,
            { class: classes.time, datetime: event.dateTime },
            () => event.time
          ),
          h(
            TimelineDescription,
            { class: classes.description },
            () => event.description
          ),
          event.link &&
            h(
              "a",
              { class: classes.link, href: `#${event.value}` },
              event.link
            ),
          variant.details && details(event),
        ]
      )
    return () =>
      h(
        Timeline,
        {
          class: classes.root,
          "aria-label": variant.title,
          controller,
          ...variant.options,
        },
        () => variant.events.map(item)
      )
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantTimeline, { variant, env }).mount(slot)
  )
}

export { mount }
