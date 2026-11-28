import { Component } from "@angular/core"
import {
  Timeline,
  TimelineConnector,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "@ui-sdk/angular/timeline"

@Component({
  imports: [
    Timeline,
    TimelineConnector,
    TimelineItem,
    TimelineMarker,
    TimelineTime,
    TimelineTitle,
  ],
  template: `
    <div
      uiTimeline
      orientation="horizontal"
      [loop]="false"
      aria-label="Roadmap"
    >
      @for (milestone of milestones; track milestone.title) {
        <div uiTimelineItem>
          <div uiTimelineMarker></div>
          <div uiTimelineConnector></div>
          <div uiTimelineTitle>{{ milestone.title }}</div>
          <time uiTimelineTime [attr.datetime]="milestone.dateTime">
            {{ milestone.time }}
          </time>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly milestones = [
    { title: "Kickoff", dateTime: "2026-01", time: "January" },
    { title: "Design review", dateTime: "2026-03", time: "March" },
    { title: "Beta", dateTime: "2026-06", time: "June" },
    { title: "Launch", dateTime: "2026-09", time: "September" },
  ]
}

export { Example }
