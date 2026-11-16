import { render } from "svelte/server"
import { expect, test } from "vitest"
import App from "./apps/field-error-id-app.svelte"

test("an error shown with match is the one the control's description names", () => {
  const { body } = render(App)
  const error = idOf(body, "field-error")
  const described = body.match(/<input[^>]*aria-describedby="([^"]+)"/)![1]
  expect(error).toMatch(/^ui-sdk-/)
  expect(described.split(" ")).toContain(error)
})

// The id of the element with this `data-slot`, wherever the attributes fall.
const idOf = (html: string, slot: string) =>
  html
    .match(new RegExp(`<[^>]*data-slot="${slot}"[^>]*>`))![0]
    .match(/\sid="([^"]+)"/)![1]
