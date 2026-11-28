import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
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
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          type="button"
          [disabled]="busy() || count() >= updates.length"
          (click)="loadMore()"
        >
          {{ busy() ? "Loading…" : "Load More" }}
        </button>
      </div>
      <div uiTimeline feed [busy]="busy()" aria-label="Team updates">
        @for (update of updates.slice(0, count()); track update.id) {
          <div uiTimelineItem>
            <div uiTimelineMarker></div>
            <div uiTimelineConnector></div>
            <div uiTimelineTitle>{{ update.author }}</div>
            <time uiTimelineTime [attr.datetime]="update.date">{{
              update.time
            }}</time>
            <div uiTimelineDescription>{{ update.text }}</div>
          </div>
        }
      </div>
    </div>
  `,
})
class Example {
  readonly updates = [
    {
      id: 1,
      author: "Ada",
      date: "2026-11-10",
      time: "Nov 10",
      text: "Shipped the new onboarding flow.",
    },
    {
      id: 2,
      author: "Grace",
      date: "2026-11-10",
      time: "Nov 10",
      text: "Fixed the flaky upload test.",
    },
    {
      id: 3,
      author: "Linus",
      date: "2026-11-09",
      time: "Nov 9",
      text: "Moved the docs to the new theme.",
    },
    {
      id: 4,
      author: "Margaret",
      date: "2026-11-09",
      time: "Nov 9",
      text: "Wrote the launch checklist.",
    },
    {
      id: 5,
      author: "Ada",
      date: "2026-11-08",
      time: "Nov 8",
      text: "Cut search latency in half.",
    },
    {
      id: 6,
      author: "Grace",
      date: "2026-11-07",
      time: "Nov 7",
      text: "Added keyboard shortcuts to the editor.",
    },
    {
      id: 7,
      author: "Linus",
      date: "2026-11-06",
      time: "Nov 6",
      text: "Cleaned up the old billing code.",
    },
    {
      id: 8,
      author: "Margaret",
      date: "2026-11-05",
      time: "Nov 5",
      text: "Ran the accessibility review.",
    },
    {
      id: 9,
      author: "Ada",
      date: "2026-11-04",
      time: "Nov 4",
      text: "Started the mobile layout.",
    },
  ]

  readonly pageSize = 3

  readonly log = useLog()

  readonly count = signal(this.pageSize)

  readonly busy = signal(false)

  loadMore() {
    this.busy.set(true)
    setTimeout(() => {
      this.count.update((v) => v + this.pageSize)
      this.busy.set(false)
      this.log(`Loaded ${this.pageSize} more updates`)
    }, 600)
  }
}

export { Example }
