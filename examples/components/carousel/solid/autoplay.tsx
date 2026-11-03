import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselPlayToggle,
  CarouselViewport,
} from "@ui-sdk/solid/carousel"
import { createSignal, For } from "solid-js"

const photos = [
  { name: "Dunes" },
  { name: "Forest" },
  { name: "Glacier" },
  { name: "Canyon" },
  { name: "Meadow" },
  { name: "Harbor" },
]

function Example() {
  const [log, setLog] = createSignal("")
  return (
    <Carousel
      aria-label="Photos"
      defaultPlaying
      interval={4000}
      onPlayingChange={(playing, details) => setLog(`${playing ? "Playing" : "Stopped"} (${details.reason})`)}
    >
      <CarouselViewport>
        <CarouselContent>
          <For each={photos}>
            {(photo) => (
              <CarouselItem>
                <div data-slot="tile">{photo.name}</div>
              </CarouselItem>
            )}
          </For>
        </CarouselContent>
      </CarouselViewport>
      <div data-slot="row">
        <CarouselPlayToggle data-variant="secondary">
          {(state) =>
            state.playing ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect x="14" y="3" width="5" height="18" rx="1" />
                  <rect x="5" y="3" width="5" height="18" rx="1" />
                </svg>
                <span data-slot="visually-hidden">Stop slide rotation</span>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                </svg>
                <span data-slot="visually-hidden">Start slide rotation</span>
              </>
            )
          }
        </CarouselPlayToggle>
        <CarouselIndicatorGroup aria-label="Choose a photo">
          <For each={photos}>
            {(photo, index) => (
              <CarouselIndicator page={index() + 1} aria-label={photo.name}>
                <span />
              </CarouselIndicator>
            )}
          </For>
        </CarouselIndicatorGroup>
      </div>
      <p data-slot="hint" aria-live="polite">
        {log()}
      </p>
    </Carousel>
  )
}

export { Example }
