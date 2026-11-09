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
  type CarouselController,
} from "@ui-sdk/react/carousel"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { slideBasis, slideCount, type Variant } from "./variants"

const slides = Array.from({ length: slideCount }, (_, index) => index + 1)

function Controls({
  variant,
  controller,
}: {
  variant: Variant
  controller?: CarouselController
}) {
  return (
    <div className={classes.controls}>
      <CarouselPrevious className={classes.step} controller={controller}>
        Previous
      </CarouselPrevious>
      <CarouselNext className={classes.step} controller={controller}>
        Next
      </CarouselNext>
      {variant.toggle && (
        <CarouselPlayToggle className={classes.toggle} controller={controller}>
          {(state) => (state.playing ? "Stop rotation" : "Start rotation")}
        </CarouselPlayToggle>
      )}
      <CarouselIndicatorGroup
        className={classes.indicators}
        aria-label="Choose a slide"
        controller={controller}
      >
        {slides.map((slide) => (
          <CarouselIndicator
            key={slide}
            className={classes.indicator}
            aria-label={`Slide ${slide}`}
            render={
              variant.links ? (
                <a href={`#kitchen-${variant.id}-${slide}`} />
              ) : undefined
            }
          />
        ))}
      </CarouselIndicatorGroup>
    </div>
  )
}

function VariantCarousel({ variant, env }: { variant: Variant; env: Env }) {
  const [page, setPage] = React.useState(1)
  const [controller] = React.useState(() =>
    variant.controller || variant.outside
      ? createCarouselController()
      : undefined
  )
  React.useEffect(() => {
    if (!controller || !variant.controller) {
      return
    }
    env.controls([
      ["next()", () => controller.next()],
      ["previous()", () => controller.previous()],
      ["setPage(4)", () => controller.setPage(4)],
      ["play()", () => controller.play()],
      ["pause()", () => controller.pause()],
      ["getPage()", () => controller.getPage()],
      ["getPageCount()", () => controller.getPageCount()],
    ])
  }, [controller, env, variant.controller])
  return (
    <>
      <Carousel
        className={classes.root}
        aria-label={variant.title}
        {...variant.options}
        {...(variant.controlled && { page })}
        controller={controller}
        onPageChange={(next, details) => {
          if (variant.cancel) {
            return details.cancel()
          }
          if (variant.controlled) {
            setPage(next)
          }
          env.log(`pageChange ${next} (${details.reason}, ${details.source})`)
        }}
        onPlayingChange={(playing, details) =>
          env.log(`playingChange ${playing} (${details.reason})`)
        }
      >
        <CarouselViewport className={classes.viewport}>
          <CarouselContent className={classes.content}>
            {slides.map((slide, index) => (
              <CarouselItem
                key={slide}
                className={classes.slide}
                style={{ flexBasis: slideBasis(variant, index) }}
              >
                {slide}
              </CarouselItem>
            ))}
          </CarouselContent>
        </CarouselViewport>
        {!variant.outside && <Controls variant={variant} />}
      </Carousel>
      {variant.outside && (
        <Controls variant={variant} controller={controller} />
      )}
    </>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    createRoot(slot).render(
      <React.StrictMode>
        <VariantCarousel variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
