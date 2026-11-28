import { Component } from "@angular/core"
import {
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallCell,
  WaterfallColumnHeader,
  WaterfallHeaderRow,
  WaterfallMark,
  WaterfallRow,
  WaterfallRowHeader,
  type WaterfallData,
  type WaterfallOptions,
} from "@ui-sdk/angular/waterfall"

@Component({
  imports: [
    Waterfall,
    WaterfallAxis,
    WaterfallBar,
    WaterfallCell,
    WaterfallColumnHeader,
    WaterfallHeaderRow,
    WaterfallMark,
    WaterfallRow,
    WaterfallRowHeader,
  ],
  template: `
    <div
      uiWaterfall
      aria-label="Network requests"
      [items]="requests"
      [getBarLabel]="getBarLabel"
    >
      <div uiWaterfallHeaderRow>
        <div uiWaterfallColumnHeader>Name</div>
        <div uiWaterfallColumnHeader>Size</div>
        <div uiWaterfallColumnHeader aria-label="Timeline">
          <div uiWaterfallAxis [maxTicks]="5"></div>
          <span uiWaterfallMark [time]="620">DOMContentLoaded</span>
        </div>
      </div>
      @for (request of requests; track request.value) {
        <div uiWaterfallRow [value]="request.value">
          <div uiWaterfallRowHeader>{{ request.label }}</div>
          <div uiWaterfallCell>{{ sizes[request.value] }}</div>
          <div uiWaterfallBar></div>
        </div>
      }
    </div>
  `,
})
class Example {
  readonly requests: WaterfallData = [
    { value: "document", label: "/", start: 0, duration: 182 },
    { value: "styles", label: "app.css", start: 190, duration: 96 },
    { value: "script", label: "app.js", start: 192, duration: 410 },
    { value: "font", label: "inter.woff2", start: 300, duration: 220 },
    { value: "user", label: "api/user", start: 610, duration: 240 },
    { value: "avatar", label: "avatar.png", start: 860, duration: 150 },
  ]

  readonly sizes: Record<string, string> = {
    document: "14 kB",
    styles: "8 kB",
    script: "212 kB",
    font: "48 kB",
    user: "1 kB",
    avatar: "36 kB",
  }

  readonly getBarLabel: WaterfallOptions["getBarLabel"] = (
    request,
    { start, duration }
  ) => `${this.sizes[request.value]}, starts at ${start}, takes ${duration}`
}

export { Example }
