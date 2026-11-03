"use client"

import { paginationRange } from "@ui-sdk/react/pagination"
import * as React from "react"

function Example() {
  const [slide, setSlide] = React.useState(1)
  const items = paginationRange({ page: slide, pageCount: 20, siblings: 2, boundaries: 1 })

  return (
    <div data-slot="stack">
      <div data-slot="row" data-variant="dots" role="group" aria-label="Slides">
        {items.map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              aria-label={`Slide ${item}`}
              aria-current={item === slide ? "true" : undefined}
              onClick={() => setSlide(item)}
            />
          ) : (
            <span key={item} aria-hidden />
          ),
        )}
      </div>
      <output data-slot="output">Slide {slide} of 20</output>
    </div>
  )
}

export { Example }
