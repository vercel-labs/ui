import { render } from "@solidjs/web"
import { createSignal, flush } from "solid-js"
import { afterEach, expect, test } from "vitest"
import { createAgent } from "../src/agent"
import { Popover, PopoverContent, PopoverTrigger } from "../src/popover"
import { Switch } from "../src/switch"

Element.prototype.getAnimations ??= () => []
HTMLElement.prototype.showPopover ??= function () {}
HTMLElement.prototype.hidePopover ??= function () {}

let dispose = () => {}
afterEach(() => {
  dispose()
  document.body.replaceChildren()
})

test("controls that leave the page together are listed in their order on it", async () => {
  const [open, setOpen] = createSignal(true)
  const root = document.body.appendChild(document.createElement("div"))
  dispose = render(
    () => (
      <Popover open={open()} onOpenChange={setOpen}>
        <PopoverTrigger>Link settings</PopoverTrigger>
        <PopoverContent>
          <Switch aria-label="Allow comments" defaultChecked />
          <Switch aria-label="Expire in 7 days" />
        </PopoverContent>
      </Popover>
    ),
    root
  )
  flush()
  await new Promise((resolve) => setTimeout(resolve))
  const agent = createAgent()
  agent.snapshot()
  setOpen(false)
  flush()
  await new Promise((resolve) => setTimeout(resolve, 20))
  expect(
    agent
      .snapshot()
      .filter((entry) => entry.offPage)
      .map((entry) => entry.label)
  ).toEqual(["Allow comments", "Expire in 7 days"])
})
