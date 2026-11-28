import { Component } from "@angular/core"
import { LucideChevronDown } from "@lucide/angular"
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@ui-sdk/angular/collapsible"
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
    Collapsible,
    CollapsiblePanel,
    CollapsibleTrigger,
    Timeline,
    TimelineConnector,
    TimelineDescription,
    TimelineItem,
    TimelineMarker,
    TimelineTime,
    TimelineTitle,
    LucideChevronDown,
  ],
  template: `
    <div uiTimeline aria-label="Changelog">
      @for (release of releases; track release.title) {
        <div uiTimelineItem>
          <div uiTimelineMarker></div>
          <div uiTimelineConnector></div>
          <div uiTimelineTitle>{{ release.title }}</div>
          <time uiTimelineTime [attr.datetime]="release.dateTime">{{
            release.time
          }}</time>
          <div uiTimelineDescription>{{ release.description }}</div>
          <div uiCollapsible>
            <button uiCollapsibleTrigger>
              What Changed
              <svg lucideChevronDown></svg>
            </button>
            <div uiCollapsiblePanel>
              <ul>
                @for (change of release.changes; track change) {
                  <li>{{ change }}</li>
                }
              </ul>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly releases = [
    {
      title: "Version 2.4",
      dateTime: "2026-10-28",
      time: "October 28",
      description: "Faster search and resumable uploads.",
      changes: [
        "Search now matches file contents, not only names.",
        "Uploads resume after the connection drops.",
      ],
    },
    {
      title: "Version 2.3",
      dateTime: "2026-09-30",
      time: "September 30",
      description: "Shared links and a new sidebar.",
      changes: [
        "Shared links remember the folder they were opened from.",
        "The sidebar collapses to icons on narrow screens.",
      ],
    },
    {
      title: "Version 2.2",
      dateTime: "2026-08-26",
      time: "August 26",
      description: "Dark mode follows your system.",
      changes: [
        "Dark mode follows the system setting.",
        "Avatars are sharper.",
      ],
    },
  ]
}

export { Example }
