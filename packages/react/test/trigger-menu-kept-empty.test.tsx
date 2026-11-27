// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { keys, type } from "../../core/src/testing/input"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuEmpty,
  TriggerMenuInput,
  TriggerMenuList,
} from "../src/trigger-menu"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
Element.prototype.getAnimations ??= () => []

let root: Root | undefined
afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  document.body.replaceChildren()
})

test("a kept content whose empty part shows for one trigger closes on no matches for another", async () => {
  const changes: boolean[] = []
  root = createRoot(document.body.appendChild(document.createElement("div")))
  await React.act(async () =>
    root!.render(
      <TriggerMenu
        triggers={[
          { char: "@", items: ["Ada", "Kai"] },
          { char: "/", items: ["help", "invite"] },
        ]}
        onOpenChange={(open) => changes.push(open)}
      >
        <TriggerMenuInput aria-label="Message" />
        <TriggerMenuContent keepMounted>
          {(state) => (
            <>
              {state.trigger === "@" && (
                <TriggerMenuEmpty>No one found.</TriggerMenuEmpty>
              )}
              <TriggerMenuList />
            </>
          )}
        </TriggerMenuContent>
      </TriggerMenu>
    )
  )
  const field = document.querySelector("textarea")!
  field.focus()
  await React.act(() => type(document, "@zz"))
  await React.act(() => keys(document, ["Escape", "Space"]))
  changes.length = 0
  await React.act(() => type(document, "/zz"))
  expect(changes.at(-1)).toBe(false)
})
