import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(() => (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors)

// What the HTML the server sent shows, before hydration.
const serverPicker = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const template = document.createElement("template")
    template.innerHTML = (window as unknown as { __serverHtml: string }).__serverHtml
    const hue = template.content.querySelector('[role="slider"][aria-label="Hue"]')
    return {
      hue: hue?.getAttribute("aria-valuenow"),
      background: template.content
        .querySelector('[data-slot="color-picker-area"]')
        ?.getAttribute("style")
        ?.includes("--color-area-background:linear-gradient"),
    }
  })

test("a color picker hydrates without mismatches", async ({ page, open }) => {
  await open("color-picker")
  const hue = page.getByRole("slider", { name: "Hue", exact: true })
  await hue.focus()
  await page.keyboard.press("ArrowRight")
  await expect(hue).toHaveAttribute("aria-valuenow", "218")
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders the parts at the default value", async ({ page, open }) => {
  await open("color-picker")
  expect(await serverPicker(page)).toMatchObject({
    hue: expect.stringMatching(/^217(\.\d+)?$/),
    background: true,
  })
})
