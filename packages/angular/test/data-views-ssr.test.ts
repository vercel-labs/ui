// @vitest-environment node
import { Component } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  ImageCropper,
  ImageCropperHandle,
  ImageCropperImage,
  ImageCropperSelection,
  ImageCropperViewport,
} from "../src/image-cropper"
import {
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallRow,
  WaterfallRowHeader,
  type WaterfallData,
} from "../src/waterfall"
import { render } from "./render"

const items: WaterfallData = [
  {
    value: "page",
    label: "GET /",
    start: 0,
    duration: 1000,
    children: [{ value: "api", label: "GET /api", start: 500, duration: 500 }],
  },
]

@Component({
  selector: "test-root",
  imports: [
    Waterfall,
    WaterfallAxis,
    WaterfallBar,
    WaterfallRow,
    WaterfallRowHeader,
  ],
  template: `
    <div uiWaterfall aria-label="Requests" [items]="items">
      <div uiWaterfallAxis [maxTicks]="3"></div>
      @for (value of ["page", "api"]; track value) {
        <div uiWaterfallRow [value]="value">
          <div uiWaterfallRowHeader>{{ value }}</div>
          <div uiWaterfallBar></div>
        </div>
      }
    </div>
  `,
})
class Rows {
  readonly items = items
}

@Component({
  selector: "test-root",
  imports: [Waterfall],
  template: `<div uiWaterfall aria-label="Requests" [items]="items"></div>`,
})
class Default {
  readonly items = items
}

@Component({
  selector: "test-root",
  imports: [
    ImageCropper,
    ImageCropperHandle,
    ImageCropperImage,
    ImageCropperSelection,
    ImageCropperViewport,
  ],
  template: `
    <div uiImageCropper src="/photo.jpg" [aspectRatio]="1">
      <div uiImageCropperViewport>
        <img uiImageCropperImage alt="Your photo" />
        <div uiImageCropperSelection>
          <div uiImageCropperHandle position="nw"></div>
        </div>
      </div>
    </div>
  `,
})
class Cropper {}

// Runs with no DOM: any access to window or document during render throws.
describe("server rendering", () => {
  test("a waterfall renders rows with their place, the bar's times and the axis's ticks", async () => {
    const html = await render(Rows)
    expect(typeof window).toBe("undefined")
    expect(html).toContain('role="treegrid"')
    expect(html).toContain('aria-level="2"')
    expect(html).toMatch(/--waterfall-start: ?50%/)
    expect(html).toContain('aria-label="Starts at 500 ms, lasts 500 ms"')
    expect(html).toMatch(/>0.5 sec</)
    expect(html).toMatch(
      /hidden[^>]*id="[^"]*-row-api"|id="[^"]*-row-api"[^>]*hidden/
    )
  })

  test("a waterfall left empty renders a row for every span", async () => {
    const html = await render(Default)
    expect(html.match(/role="row"/g)).toHaveLength(2)
    expect(html).toContain("GET /api")
  })

  test("an image cropper renders its image and a selection that's busy until the image loads", async () => {
    const html = await render(Cropper)
    expect(html).toContain('src="/photo.jpg"')
    expect(html).toContain('aria-busy="true"')
    expect(html).toContain('data-slot="image-cropper-selection"')
    expect(html).toContain('data-position="nw"')
  })
})
