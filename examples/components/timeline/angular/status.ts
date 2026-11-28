import { Component } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
  createTimelineController,
  type TimelineStatus,
} from "@ui-sdk/angular/timeline"

@Component({
  imports: [
    Timeline,
    TimelineConnector,
    TimelineDescription,
    TimelineItem,
    TimelineMarker,
    TimelineTime,
    TimelineTitle,
    LucideCheck,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="controller.focus('shipped')">
          Go to Current Step
        </button>
      </div>
      <div uiTimeline aria-label="Order status" [controller]="controller">
        @for (step of steps; track step.value) {
          <div uiTimelineItem [value]="step.value" [status]="step.status">
            <div uiTimelineMarker>
              @if (step.status === "complete") {
                <svg lucideCheck></svg>
              }
            </div>
            <div uiTimelineConnector></div>
            <div uiTimelineTitle>{{ step.title }}</div>
            <time uiTimelineTime [attr.datetime]="step.dateTime">{{
              step.time
            }}</time>
            <div uiTimelineDescription>{{ step.description }}</div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly steps: {
    value: string
    title: string
    dateTime: string
    time: string
    description: string
    status: TimelineStatus
  }[] = [
    {
      value: "placed",
      title: "Order placed",
      dateTime: "2026-11-01",
      time: "Nov 1",
      description: "We received your order.",
      status: "complete",
    },
    {
      value: "packed",
      title: "Packed",
      dateTime: "2026-11-02",
      time: "Nov 2",
      description: "Your items left the shelf.",
      status: "complete",
    },
    {
      value: "shipped",
      title: "Shipped",
      dateTime: "2026-11-03",
      time: "Nov 3",
      description: "On its way with the carrier.",
      status: "current",
    },
    {
      value: "delivered",
      title: "Delivered",
      dateTime: "2026-11-05",
      time: "Nov 5",
      description: "Expected by Thursday.",
      status: "upcoming",
    },
  ]

  readonly controller = createTimelineController()
}

export { Example }
