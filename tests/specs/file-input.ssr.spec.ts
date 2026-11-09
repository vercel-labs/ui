import { expect, test } from "../fixtures"
import { fileInputFixture as f } from "../fixtures/file-input"
import { browse, drop, lastAction, png, zone } from "./file-input.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("file inputs hydrate without mismatches", async ({ page, open }) => {
  await open("file-input")
  await expect(browse(page)).toBeVisible()
  await drop(zone(page), [png])
  await expect(lastAction(page)).toHaveText("attachments:drop:a.png|")
  expect(await hydrationErrors(page)).toEqual([])
})

test(
  "the server markup has a named file input that submits before hydration",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("file-input", { hydrate: "manual", required: "" })
    const input = await page.evaluate(() => {
      const el = document.querySelector<HTMLInputElement>(
        `input[type="file"][name="attachments"]`
      )!
      return {
        accept: el.accept,
        multiple: el.multiple,
        required: el.required,
        valid: el.form!.checkValidity(),
      }
    })
    expect(input).toEqual({
      accept: f.attachments.accept,
      multiple: true,
      required: true,
      valid: false,
    })
  }
)
