import { createSignal } from "solid-js"
import { Button } from "@ui-sdk/solid/button"

function Example() {
  const [count, setCount] = createSignal(0)

  return (
    <div data-slot="stack">
      <Button onClick={() => setCount((current) => current + 1)}>Button</Button>
      <output data-slot="output">
        Pressed {count()} {count() === 1 ? "time" : "times"}
      </output>
    </div>
  )
}

export { Example }
