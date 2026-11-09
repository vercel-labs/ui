import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
  CarouselViewport,
  createCarouselController,
} from "@ui-sdk/vue"
import type { ChangeDetails } from "@ui-sdk/core"
import type {
  CarouselController,
  CarouselPlayToggleState,
} from "@ui-sdk/core/carousel"
import { createApp, defineComponent, h, ref, type PropType } from "vue"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { slideBasis, slideCount, type Variant } from "./variants"
import { renderAs } from "../vue-render-as"

const slides = Array.from({ length: slideCount }, (_, index) => index + 1)

function controls(variant: Variant, controller?: CarouselController) {
  return h("div", { class: classes.controls }, [
    h(CarouselPrevious, { class: classes.step, controller }, () => "Previous"),
    h(CarouselNext, { class: classes.step, controller }, () => "Next"),
    variant.toggle &&
      h(
        CarouselPlayToggle,
        { class: classes.toggle, controller },
        {
          default: ({ state }: { state: CarouselPlayToggleState }) =>
            state.playing ? "Stop rotation" : "Start rotation",
        }
      ),
    h(
      CarouselIndicatorGroup,
      { class: classes.indicators, "aria-label": "Choose a slide", controller },
      () =>
        slides.map((slide) =>
          h(
            CarouselIndicator,
            {
              key: slide,
              class: classes.indicator,
              "aria-label": `Slide ${slide}`,
              ...(variant.links && { href: `#kitchen-${variant.id}-${slide}` }),
            },
            renderAs(variant.links ? "a" : undefined)
          )
        )
    ),
  ])
}

const VariantCarousel = defineComponent({
  props: {
    variant: { type: Object as PropType<Variant>, required: true as const },
    env: { type: Object as PropType<Env>, required: true as const },
  },
  setup({ variant, env }) {
    const page = ref(1)
    const controller =
      variant.controller || variant.outside
        ? createCarouselController()
        : undefined
    if (controller && variant.controller) {
      env.controls([
        ["next()", () => controller.next()],
        ["previous()", () => controller.previous()],
        ["setPage(4)", () => controller.setPage(4)],
        ["play()", () => controller.play()],
        ["pause()", () => controller.pause()],
        ["getPage()", () => controller.getPage()],
        ["getPageCount()", () => controller.getPageCount()],
      ])
    }
    return () => [
      h(
        Carousel,
        {
          class: classes.root,
          "aria-label": variant.title,
          ...variant.options,
          ...(variant.controlled && { page: page.value }),
          controller,
          onPageChange: (next: number, details: ChangeDetails) => {
            if (variant.cancel) {
              return details.cancel()
            }
            if (variant.controlled) {
              page.value = next
            }
            env.log(`pageChange ${next} (${details.reason}, ${details.source})`)
          },
          onPlayingChange: (playing: boolean, details: ChangeDetails) =>
            env.log(`playingChange ${playing} (${details.reason})`),
        },
        () => [
          h(CarouselViewport, { class: classes.viewport }, () =>
            h(CarouselContent, { class: classes.content }, () =>
              slides.map((slide, index) =>
                h(
                  CarouselItem,
                  {
                    key: slide,
                    class: classes.slide,
                    style: { flexBasis: slideBasis(variant, index) },
                  },
                  () => String(slide)
                )
              )
            )
          ),
          !variant.outside && controls(variant),
        ]
      ),
      variant.outside && controls(variant, controller),
    ]
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) =>
    createApp(VariantCarousel, { variant, env }).mount(slot)
  )
}

export { mount }
