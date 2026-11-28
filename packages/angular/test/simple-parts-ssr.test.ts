// @vitest-environment node
import { Component } from "@angular/core"
import { describe, expect, test } from "vitest"
import { Avatar, AvatarFallback, AvatarImage } from "../src/avatar"
import { Button } from "../src/button"
import { Label } from "../src/label"
import { Meter, MeterIndicator, MeterTrack } from "../src/meter"
import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "../src/progress"
import { Separator } from "../src/separator"
import {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineTitle,
} from "../src/timeline"
import { Toggle, ToggleGroup } from "../src/toggle"
import { render, tagWith } from "./render"

@Component({
  selector: "test-root",
  imports: [
    Avatar,
    AvatarImage,
    AvatarFallback,
    Button,
    Label,
    Meter,
    MeterTrack,
    MeterIndicator,
    Progress,
    ProgressTrack,
    ProgressIndicator,
    ProgressLabel,
    ProgressValue,
    Separator,
    Timeline,
    TimelineItem,
    TimelineMarker,
    TimelineTitle,
    Toggle,
    ToggleGroup,
  ],
  template: `
    <button uiButton>Press</button>
    <div uiToggleGroup [defaultValue]="['b']">
      <button uiToggle value="a">Toggle a</button>
      <button uiToggle value="b">Toggle b</button>
    </div>
    <hr uiSeparator class="rule" />
    <div uiSeparator class="side" orientation="vertical"></div>
    <span uiAvatar class="avatar">
      <img uiAvatarImage src="/a.png" alt="Ada" />
      <span *uiAvatarFallback>AL</span>
    </span>
    <div uiProgress class="progress" [value]="40" #progress="uiProgress">
      <span uiProgressLabel>Uploading</span>
      <span uiProgressValue class="value">{{ progress.state().value }}</span>
      <div uiProgressTrack><div uiProgressIndicator class="bar"></div></div>
    </div>
    <div uiMeter class="meter" [value]="3" [max]="5" aria-label="Rating">
      <div uiMeterTrack><div uiMeterIndicator></div></div>
    </div>
    <ol uiTimeline aria-label="Order">
      <li uiTimelineItem value="paid" status="complete">
        <span uiTimelineMarker class="marker"></span>
        <span uiTimelineTitle>Paid</span>
      </li>
      <li uiTimelineItem value="shipped" status="current">
        <span uiTimelineTitle>Shipped</span>
      </li>
      <li uiTimelineItem class="first-unnamed">
        <span uiTimelineTitle>Out for delivery</span>
      </li>
      <li uiTimelineItem class="second-unnamed">
        <span uiTimelineTitle>Delivered</span>
      </li>
    </ol>
    <label uiLabel for="name">Name</label>
  `,
})
class Page {}

const tag = (html: string, className: string) =>
  html.match(new RegExp(`<[^>]*class="${className}"[^>]*>`))?.[0] ?? ""

// Runs with no DOM globals: a read of window or document while rendering throws.
describe("server rendering the simple parts", () => {
  test("each part renders its attributes", async () => {
    const html = await render(Page)
    expect(typeof window).toBe("undefined")
    expect(tagWith(html, "Press")).toContain('type="button"')
    expect(tagWith(html, "Toggle b")).toContain('aria-pressed="true"')
    expect(tagWith(html, "Toggle a")).toContain('aria-pressed="false"')
    expect(tag(html, "side")).toContain('aria-orientation="vertical"')
    expect(tag(html, "side")).toContain('role="separator"')
    expect(tag(html, "progress")).toContain('role="progressbar"')
    expect(tag(html, "progress")).toContain('aria-valuenow="40"')
    expect(tag(html, "meter")).toContain('role="meter"')
    expect(tag(html, "meter")).toContain('aria-valuenow="3"')
    expect(tagWith(html, "Paid")).toContain("data-slot=")
    expect(tagWith(html, "Name")).toContain('for="name"')
  })

  test("a timeline item with no value is named by its own title", async () => {
    const html = await render(Page)
    const id = (tag: string) => tag.match(/ id="([^"]+)"/)?.[1]
    for (const [item, title] of [
      ["first-unnamed", "Out for delivery"],
      ["second-unnamed", "Delivered"],
    ]) {
      expect(id(tagWith(html, title))).toBeTruthy()
      expect(tag(html, item)).toContain(
        `aria-labelledby="${id(tagWith(html, title))}"`
      )
    }
  })

  test("the avatar's fallback shows until the image loads", async () => {
    const html = await render(Page)
    expect(html).toContain(">AL<")
  })
})
