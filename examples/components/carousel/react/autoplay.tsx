"use client"

import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselPlayToggle,
  CarouselViewport,
} from "@ui-sdk/react/carousel"
import { PauseIcon, PlayIcon } from "lucide-react"
import * as React from "react"

const photos = [
  { name: "Dunes" },
  { name: "Forest" },
  { name: "Glacier" },
  { name: "Canyon" },
  { name: "Meadow" },
  { name: "Harbor" },
]

function Example() {
  const [log, setLog] = React.useState("")
  return (
    <Carousel
      aria-label="Photos"
      defaultPlaying
      interval={4000}
      onPlayingChange={(playing, details) => setLog(`${playing ? "Playing" : "Stopped"} (${details.reason})`)}
    >
      <CarouselViewport>
        <CarouselContent>
          {photos.map((photo) => (
            <CarouselItem key={photo.name}>
              <div data-slot="tile">{photo.name}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <div data-slot="row">
        <CarouselPlayToggle data-variant="secondary">
          {(state) =>
            state.playing ? (
              <>
                <PauseIcon />
                <span data-slot="visually-hidden">Stop slide rotation</span>
              </>
            ) : (
              <>
                <PlayIcon />
                <span data-slot="visually-hidden">Start slide rotation</span>
              </>
            )
          }
        </CarouselPlayToggle>
        <CarouselIndicatorGroup aria-label="Choose a photo">
          {photos.map((photo, index) => (
            <CarouselIndicator key={photo.name} page={index + 1} aria-label={photo.name}>
              <span />
            </CarouselIndicator>
          ))}
        </CarouselIndicatorGroup>
      </div>
      <p data-slot="hint" aria-live="polite">
        {log}
      </p>
    </Carousel>
  )
}

export { Example }
