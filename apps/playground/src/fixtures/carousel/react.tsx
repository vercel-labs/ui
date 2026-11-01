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
} from "@ui-sdk/react/carousel"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { carouselFixture, carouselOptions } from "tests/fixtures/carousel.ts"

const controller = createCarouselController()

function Fixture() {
  const [action, setAction] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [rested, setRested] = React.useState("")
  const { perView, cancel, playToggle, controlled, options } = carouselOptions()
  const [page, setPage] = React.useState(1)
  return (
    <div className="fixture">
      <button>Before</button>
      <Carousel
        className="carousel"
        aria-label={carouselFixture.label}
        style={{ "--per-view": perView } as React.CSSProperties}
        controller={controller}
        {...options}
        {...(controlled && { page })}
        onPageChange={(page, details) => {
          if (page === cancel) return details.cancel()
          if (controlled) setPage(page)
          setAction(String(page))
          setReason(details.reason)
        }}
        onPageChangeComplete={(page) => setRested(String(page))}
      >
        {playToggle && (
          <CarouselPlayToggle className="carousel-toggle">
            {(state) => (state.playing ? carouselFixture.stop : carouselFixture.start)}
          </CarouselPlayToggle>
        )}
        <CarouselViewport className="carousel-viewport">
          <CarouselContent className="carousel-content">
            {carouselFixture.slides.map((slide, index) => (
              <CarouselItem key={slide.title} className="carousel-slide">
                <p>{slide.title}</p>
                <a href={`?product=${index + 1}`}>{slide.link}</a>
                {index === 2 && (
                  <label>
                    {" "}
                    {carouselFixture.field} <input />
                  </label>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
        </CarouselViewport>
        <div className="carousel-controls">
          <CarouselPrevious className="carousel-step">{carouselFixture.previous}</CarouselPrevious>
          <CarouselNext className="carousel-step">{carouselFixture.next}</CarouselNext>
        </div>
        <CarouselIndicatorGroup className="carousel-controls" aria-label={carouselFixture.indicators}>
          {carouselFixture.slides.map((slide, index) => (
            <CarouselIndicator
              key={slide.title}
              className="carousel-indicator"
              aria-label={carouselFixture.indicator(index + 1)}
            >
              {index + 1}
            </CarouselIndicator>
          ))}
        </CarouselIndicatorGroup>
      </Carousel>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output aria-label="Last reason">{reason}</output>
      <output aria-label="Rested on">{rested}</output>
      <button onClick={() => controller.setPage(4)}>Show page 4</button>
      {controlled && <button onClick={() => setPage(3)}>Show page 3 by prop</button>}
      <CarouselNext controller={controller}>Next from outside</CarouselNext>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>,
  )
}

export { Fixture, mount }
