import { Component } from "@angular/core"
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
    <div uiTimeline aria-label="Activity">
      @for (event of events; track event.title) {
        <div uiTimelineItem>
          <div uiTimelineMarker></div>
          <div uiTimelineConnector></div>
          <div uiTimelineTitle>{{ event.title }}</div>
          <time uiTimelineTime [attr.datetime]="event.dateTime">{{
            event.time
          }}</time>
          <div uiTimelineDescription>{{ event.description }}</div>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly events = [
    {
      title: "Deployed to production",
      dateTime: "2026-11-10T14:32",
      time: "Today, 2:32 PM",
      description: "Version 2.4.1 is live in every region.",
    },
    {
      title: "Checks passed",
      dateTime: "2026-11-10T14:20",
      time: "Today, 2:20 PM",
      description: "312 tests and the bundle size budget.",
    },
    {
      title: "Pull request merged",
      dateTime: "2026-11-10T13:58",
      time: "Today, 1:58 PM",
      description: "Ada merged Cache search results into main.",
    },
    {
      title: "Review requested",
      dateTime: "2026-11-09T17:05",
      time: "Yesterday, 5:05 PM",
      description: "Grace and Linus were asked to review.",
    },
  ]
}

export { Example }
