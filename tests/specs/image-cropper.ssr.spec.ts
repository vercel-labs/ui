import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

// What the HTML the server sent shows, before hydration.
const serverCropper = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const template = document.createElement("template")
    template.innerHTML = (
      window as unknown as { __serverHtml: string }
    ).__serverHtml
    const content = template.content
    return {
      busy: content
        .querySelector('[data-slot="image-cropper-root"]')
        ?.getAttribute("aria-busy"),
      image: !!content
        .querySelector('img[data-slot="image-cropper-image"]')
        ?.getAttribute("src"),
      selectionHidden: content
        .querySelector('[data-slot="image-cropper-selection"]')
        ?.hasAttribute("hidden"),
    }
  })

test("an image cropper hydrates without mismatches", async ({ page, open }) => {
  await open("image-cropper", { aspect: "1" })
  const selection = page.getByRole("slider", { name: "Crop" })
  await selection.focus()
  await page.keyboard.press("ArrowRight")
  await expect(selection).toHaveAttribute(
    "aria-valuetext",
    "240 by 240 pixels, at 81, 30"
  )
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server renders the image with no crop until it loads", async ({
  page,
  open,
}) => {
  await open("image-cropper")
  expect(await serverCropper(page)).toEqual({
    busy: "true",
    image: true,
    selectionHidden: true,
  })
})
