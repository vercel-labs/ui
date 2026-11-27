import { render } from "@solidjs/web"
import { flush } from "solid-js"
import { afterEach, expect, test } from "vitest"
import { Button } from "../src/button"
import { FileInput, FileInputTrigger } from "../src/file-input"
import { Popover, PopoverContent, PopoverTrigger } from "../src/popover"

let dispose = () => {}
afterEach(() => {
  dispose()
  document.body.innerHTML = ""
})

test("a disabled part rendered as a Button through render disables the button", () => {
  const root = document.body.appendChild(document.createElement("div"))
  dispose = render(
    () => (
      <>
        <Popover>
          <PopoverTrigger
            disabled
            render={(props) => <Button {...props}>Open</Button>}
          />
          <PopoverContent>Content</PopoverContent>
        </Popover>
        <FileInput disabled>
          <FileInputTrigger
            render={(props) => <Button {...props}>Choose files</Button>}
          />
        </FileInput>
      </>
    ),
    root
  )
  flush()
  const buttons = [...root.querySelectorAll("button")]
  expect(buttons.map((button) => button.textContent)).toEqual([
    "Open",
    "Choose files",
  ])
  for (const button of buttons) {
    expect(button.disabled).toBe(true)
  }
})
