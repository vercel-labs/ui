import { createCarouselController, type UiCarouselElement } from "@ui-sdk/web"
import * as classes from "./classes"
import { kitchenSink } from "./shell"
import { slideBasis, slideCount, type Variant } from "./variants"

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
const slides = Array.from({ length: slideCount }, (_, index) => index + 1)

// Previous, Next, the toggle and the indicators. Outside the carousel, `for` connects them.
function controls(variant: Variant, target: string) {
  const forAttribute = target ? ` for="${target}"` : ""
  const indicatorTag = variant.links ? "a" : "button"
  return `
    <div class="${classes.controls}">
      <ui-carousel-previous${forAttribute}><button class="${classes.step}">Previous</button></ui-carousel-previous>
      <ui-carousel-next${forAttribute}><button class="${classes.step}">Next</button></ui-carousel-next>
      ${
        variant.toggle
          ? `<ui-carousel-play-toggle${forAttribute}><button class="${classes.toggle} group"><span class="group-data-playing:hidden">Start rotation</span><span class="hidden group-data-playing:inline">Stop rotation</span></button></ui-carousel-play-toggle>`
          : ""
      }
      <ui-carousel-indicator-group class="${classes.indicators}" aria-label="Choose a slide"${forAttribute}>
        ${slides
          .map(
            (slide) =>
              `<ui-carousel-indicator><${indicatorTag} class="${classes.indicator}" aria-label="Slide ${slide}"${
                variant.links ? ` href="#kitchen-${variant.id}-${slide}"` : ""
              }></${indicatorTag}></ui-carousel-indicator>`
          )
          .join("")}
      </ui-carousel-indicator-group>
    </div>`
}

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/carousel")
  kitchenSink(root, "web", (slot, variant, env) => {
    const attributes = Object.entries(variant.options ?? {})
      .map(([key, value]) =>
        value === true ? kebab(key) : `${kebab(key)}="${value}"`
      )
      .join(" ")
    const id = `kitchen-${variant.id}`
    slot.innerHTML = `
      <ui-carousel id="${id}" class="${classes.root}" aria-label="${variant.title}" ${attributes}>
        <ui-carousel-viewport class="${classes.viewport}">
          <ui-carousel-content class="${classes.content}">
            ${slides
              .map(
                (slide, index) =>
                  `<ui-carousel-item class="${classes.slide}" style="flex-basis: ${slideBasis(variant, index)}">${slide}</ui-carousel-item>`
              )
              .join("")}
          </ui-carousel-content>
        </ui-carousel-viewport>
        ${variant.outside ? "" : controls(variant, "")}
      </ui-carousel>
      ${variant.outside ? controls(variant, id) : ""}`
    const carousel = slot.querySelector<UiCarouselElement>("ui-carousel")!
    carousel.addEventListener("pagechange", (event) => {
      if (variant.cancel) {
        return event.preventDefault()
      }
      env.log(
        `pageChange ${event.detail.value} (${event.detail.reason}, ${event.detail.source})`
      )
    })
    carousel.addEventListener("playingchange", (event) =>
      env.log(`playingChange ${event.detail.value} (${event.detail.reason})`)
    )
    if (!variant.controller) {
      return
    }
    const controller = createCarouselController()
    carousel.controller = controller
    env.controls([
      ["next()", () => controller.next()],
      ["previous()", () => controller.previous()],
      ["setPage(4)", () => controller.setPage(4)],
      ["play()", () => controller.play()],
      ["pause()", () => controller.pause()],
      ["getPage()", () => controller.getPage()],
      ["getPageCount()", () => controller.getPageCount()],
    ])
  })
}

export { mount }
