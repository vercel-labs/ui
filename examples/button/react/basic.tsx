"use client"

import * as React from "react"
import { Button } from "@ui-sdk/react/button"

function Example() {
  const [count, setCount] = React.useState(0)

  return (
    <div data-slot="stack">
      <Button onClick={() => setCount((current) => current + 1)}>Button</Button>
      <output data-slot="output">
        Pressed {count} {count === 1 ? "time" : "times"}
      </output>
    </div>
  )
}

export { Example }
