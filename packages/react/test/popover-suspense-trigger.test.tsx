// @vitest-environment jsdom
import * as React from "react"
import { act } from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test, vi } from "vitest"
import { Popover, PopoverContent, PopoverTrigger } from "../src/popover"

Element.prototype.getAnimations ??= () => []
HTMLElement.prototype.showPopover ??= function () {}
HTMLElement.prototype.hidePopover ??= function () {}

afterEach(() => document.body.replaceChildren())

const never = new Promise<never>(() => {})
function Gate({ server }: { server: boolean }) {
  if (server) {
    throw never
  }
  return null
}

const App = ({ server }: { server: boolean }) => (
  <Popover>
    <React.Suspense fallback={null}>
      <PopoverTrigger>Profile</PopoverTrigger>
      <Gate server={server} />
    </React.Suspense>
    <PopoverTrigger>Account</PopoverTrigger>
    <PopoverContent>Edit profile</PopoverContent>
  </Popover>
)

test("a trigger beside a boundary the client renders names the popup it opens", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {})
  const root = document.createElement("div")
  root.innerHTML = renderToString(<App server />)
  document.body.append(root)
  await act(async () => {
    hydrateRoot(root, <App server={false} />, { onRecoverableError: () => {} })
  })
  const account = [...root.querySelectorAll("button")].find(
    (button) => button.textContent === "Account"
  )!
  await act(async () => account.click())
  const content = document.querySelector('[role="dialog"]')!
  const label = content.getAttribute("aria-labelledby")!
  expect(document.getElementById(label)?.textContent).toBe("Account")
  error.mockRestore()
})
