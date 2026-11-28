// @vitest-environment jsdom
import { Component, signal } from "@angular/core"
import { describe, expect, test } from "vitest"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselViewport,
  createCarouselController,
} from "../src/carousel"
import { Resizable, ResizableHandle, ResizablePanel } from "../src/resizable"
import { mount } from "./mount"

@Component({
  selector: "test-root",
  imports: [Resizable, ResizableHandle, ResizablePanel],
  template: `
    <div
      uiResizable
      [(layout)]="layout"
      (layoutCommit)="saved.set($event.value)"
    >
      <div uiResizablePanel id="nav"></div>
      <div uiResizableHandle id="handle" aria-label="Resize navigation"></div>
      <div uiResizablePanel id="main"></div>
    </div>
  `,
})
class Panels {
  readonly layout = signal([30, 70])
  readonly saved = signal<number[] | undefined>(undefined)
}

@Component({
  selector: "test-root",
  imports: [
    Carousel,
    CarouselContent,
    CarouselIndicator,
    CarouselIndicatorGroup,
    CarouselItem,
    CarouselNext,
    CarouselViewport,
  ],
  template: `
    <button uiCarouselNext id="next" [controller]="controller">Next</button>
    <div uiCarouselIndicatorGroup id="dots" [controller]="controller">
      <button uiCarouselIndicator [page]="1">1</button>
      <button uiCarouselIndicator [page]="2">2</button>
    </div>
    @if (shown()) {
      <div uiCarousel aria-label="Featured" [controller]="controller">
        <div uiCarouselViewport>
          <div uiCarouselContent>
            <div uiCarouselItem>One</div>
            <div uiCarouselItem>Two</div>
          </div>
        </div>
      </div>
    }
  `,
})
class Slides {
  readonly controller = createCarouselController()
  readonly shown = signal(false)
}

const el = (host: HTMLElement, selector: string) =>
  host.querySelector<HTMLElement>(selector)!
const press = (target: HTMLElement, type: string, name: string) =>
  target.dispatchEvent(
    new KeyboardEvent(type, { key: name, bubbles: true, cancelable: true })
  )

describe("resizable", () => {
  test("an arrow key on the handle resizes the panels and updates the bound layout", async () => {
    const { host, instance, settle } = await mount(Panels)
    const handle = el(host, "#handle")
    expect(handle.getAttribute("role")).toBe("separator")
    expect(handle.getAttribute("aria-controls")).toBe("nav")
    expect(handle.getAttribute("aria-valuenow")).toBe("30")
    press(handle, "keydown", "ArrowRight")
    press(handle, "keyup", "ArrowRight")
    await settle()
    expect(instance.layout()[0]).toBeGreaterThan(30)
    expect(instance.saved()).toEqual(instance.layout())
    expect(handle.getAttribute("aria-valuenow")).toBe(
      String(instance.layout()[0])
    )
  })
})

describe("carousel", () => {
  test("controls outside are plain until their carousel is on the page, then join it", async () => {
    const { host, instance, settle } = await mount(Slides)
    const next = el(host, "#next")
    expect(next.getAttribute("type")).toBe("button")
    expect(next.hasAttribute("data-slot")).toBe(false)
    expect(el(host, "#dots").hasAttribute("role")).toBe(false)
    instance.shown.set(true)
    await settle()
    await settle()
    expect(next.getAttribute("data-slot")).toBe("carousel-next")
    expect(el(host, "#dots").getAttribute("role")).toBe("tablist")
    const dots = host.querySelectorAll<HTMLElement>("#dots button")
    expect(dots[0]!.getAttribute("aria-selected")).toBe("true")
    // jsdom has no layout, so both slides fit one page and the second indicator hides.
    expect(dots[1]!.hidden).toBe(true)
    expect(instance.controller.getPage()).toBe(1)
  })
})
