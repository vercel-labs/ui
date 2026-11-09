import { render } from "svelte/server"
import { expect, test } from "vitest"
import App from "./apps/field-error-id-app.svelte"

test("an error with `match` takes an id with the adapter's prefix", () => {
  const body = render(App).body
  const id =
    body.match(/<div[^>]*data-slot="field-error"[^>]*\sid="([^"]*)"/)?.[1] ??
    body
  expect(id).toMatch(/^ui-sdk-/)
})
