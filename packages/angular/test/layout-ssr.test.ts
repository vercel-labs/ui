// @vitest-environment node
import { Component } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "../src/carousel"
import { Resizable, ResizableHandle, ResizablePanel } from "../src/resizable"
import {
  ScrollArea,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaScrollToEnd,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "../src/scroll-area"
import { render } from "./render"

@Component({
  selector: "test-root",
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div uiResizable autoSaveId="editor" orientation="vertical">
      <div uiResizablePanel id="code" [defaultSize]="70"></div>
      <div uiResizableHandle aria-label="Resize terminal"></div>
      <div uiResizablePanel id="terminal"></div>
    </div>
  `,
})
class Panels {}

@Component({
  selector: "test-root",
  imports: [
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselIndicatorGroup,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselViewport,
  ],
  template: `
    <div uiCarousel aria-label="Featured" [defaultPage]="2">
      <div uiCarouselViewport>
        <div uiCarouselContent>
          <div uiCarouselItem>One</div>
          <div uiCarouselItem>Two</div>
        </div>
      </div>
      <button uiCarouselPrevious>Previous</button>
      <button uiCarouselNext>Next</button>
      <div uiCarouselIndicatorGroup aria-label="Choose a slide">
        <button uiCarouselIndicator [page]="1">1</button>
        <button uiCarouselIndicator [page]="2">2</button>
      </div>
    </div>
  `,
})
class Slides {}

@Component({
  selector: "test-root",
  imports: [
    ScrollArea,
    ScrollAreaContent,
    ScrollAreaScrollbar,
    ScrollAreaScrollToEnd,
    ScrollAreaThumb,
    ScrollAreaViewport,
  ],
  template: `
    <div uiScrollArea stickToEnd>
      <div uiScrollAreaViewport aria-label="Messages">
        <div uiScrollAreaContent>Hello</div>
      </div>
      <div uiScrollAreaScrollbar><div uiScrollAreaThumb></div></div>
      <button uiScrollAreaScrollToEnd>Jump to latest</button>
    </div>
  `,
})
class Messages {}

// Runs with no DOM: any access to window, document or storage during render throws.
describe("server rendering", () => {
  test("resizable panels take their default size as their basis, and the rest grow into what's left", async () => {
    const html = await render(Panels)
    expect(typeof window).toBe("undefined")
    expect(html).toMatch(/flex: ?0 1 var\(--resizable-panel-size, 70%\)/)
    expect(html).toMatch(/flex: ?1 1 var\(--resizable-panel-size, 0px\)/)
    expect(html).toContain('aria-orientation="horizontal"')
    expect(html).toMatch(/flex-direction: ?column/)
  })

  test("a carousel renders the pattern's roles and native snapping, so it pages before hydration", async () => {
    const html = await render(Slides)
    expect(html).toContain('aria-roledescription="carousel"')
    expect(html).toContain('aria-roledescription="slide"')
    expect(html).toMatch(/scroll-snap-type: ?x mandatory/)
    expect(html).toMatch(/aria-selected="true"[^>]*>2</)
    expect(html).not.toContain("inert")
  })

  test("a scroll area's viewport scrolls and hides native scrollbars already, so they never flash", async () => {
    const html = await render(Messages)
    expect(html).toMatch(
      /style="overflow: ?auto; ?scrollbar-width: ?none;?"[^>]*data-slot="scroll-area-viewport"/
    )
    expect(html).toMatch(/aria-hidden="true"[^>]*data-orientation="vertical"/)
    expect(html).toMatch(
      /display: ?none;?"[^>]*data-slot="scroll-area-scrollbar"/
    )
  })
})
