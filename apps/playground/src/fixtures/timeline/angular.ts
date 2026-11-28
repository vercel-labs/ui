import { Component } from "@angular/core"
import {
  createTimelineController,
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@ui-sdk/angular/timeline"
import {
  advance,
  timelineFixture,
  timelineOptions,
  type TimelineFixtureEvent,
} from "../../../../../tests/fixtures/timeline"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Timeline,
    TimelineConnector,
    TimelineDescription,
    TimelineItem,
    TimelineMarker,
    TimelineTime,
    TimelineTitle,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <div
        uiTimeline
        class="timeline"
        [attr.aria-label]="f.label"
        [controller]="controller"
        [orientation]="options.orientation"
        [loop]="options.loop"
        [feed]="options.feed"
        [busy]="options.busy"
      >
        @for (event of events(); track event.value) {
          <div uiTimelineItem [value]="event.value" [status]="event.status">
            <div uiTimelineMarker></div>
            <div uiTimelineConnector></div>
            <div uiTimelineTitle>{{ event.title }}</div>
            <time uiTimelineTime [attr.datetime]="event.dateTime">{{
              event.time
            }}</time>
            <div uiTimelineDescription>{{ event.description }}</div>
            @if (event.link; as link) {
              <a [href]="link.href">{{ link.label }}</a>
            }
          </div>
        }
      </div>
      <button>After</button>
      <button (click)="events.set([f.added, ...events()])">Add Event</button>
      <button (click)="reverse()">Reverse</button>
      <button (click)="controller.focus('shipped')">Focus Current</button>
      <button (click)="events.set(advance(events()))">Advance</button>
    </div>
  `,
})
class Fixture {
  readonly f = timelineFixture
  readonly advance = advance
  readonly controller = createTimelineController()
  readonly options: {
    orientation?: "horizontal" | "vertical"
    loop?: boolean
    feed?: boolean
    busy?: boolean
  } = timelineOptions()
  readonly events = state<readonly TimelineFixtureEvent[]>(
    timelineFixture.events
  )

  reverse() {
    this.events.set([...this.events()].reverse())
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
