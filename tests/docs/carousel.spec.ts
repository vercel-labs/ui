import { expect, test, type Locator } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "solid", "web-components"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/carousel")
const folders = ["react", "vue", "svelte", "solid", "web"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The examples in the order they appear on the Carousel page.
const order = [
  "basic",
  "sizes",
  "spacing",
  "vertical",
  "indicators",
  "autoplay",
  "loop",
  "align",
  "pages",
  "thumbnails",
  "rtl",
  "controlled",
  "progress",
  "default-page",
  "controller",
  "render",
]

// Where the first carousel in a preview has scrolled to, and which slides are
// hidden, so a spec can wait for it to move.
function where(preview: Locator) {
  return preview.evaluate((el) => {
    const root = el.querySelector("[aria-roledescription='carousel']") ?? el
    const scroller = [root, ...root.querySelectorAll<HTMLElement>("*")].find(
      (node) => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1,
    )
    const slides = [...root.querySelectorAll("[aria-roledescription='slide']")]
    const hidden = slides.map((slide) => (slide.getAttribute("aria-hidden") === "true" ? 0 : 1)).join("")
    return `${scroller?.scrollLeft},${scroller?.scrollTop},${hidden}`
  })
}

// Moves the first carousel in a preview forward: its Next button, else its
// second indicator, else a thumbnail.
async function forward(preview: Locator) {
  const next = preview.getByRole("button", { name: /^(Next( slide| page)?|الشريحة التالية)$/ })
  if (await next.count()) return next.first().click()
  const tabs = preview.getByRole("tab")
  if (await tabs.count()) return tabs.nth(1).click()
  // The second thumbnail, since the first one's photo shows already.
  return preview.getByRole("button").nth(1).click()
}

for (const framework of frameworks) {
  test(`every carousel example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/carousel`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...order].sort())

    for (const [index, name] of order.entries()) {
      const preview = previews.nth(index)
      await preview.scrollIntoViewIfNeeded()
      await expect(preview.getByText(/\S/).first(), `${name} renders`).toBeVisible()
      // At rest first: a looping carousel settles its slides once it's measured.
      let before = await where(preview)
      await expect
        .poll(async () => {
          const now = await where(preview)
          const still = now === before
          before = now
          return still
        })
        .toBe(true)
      await forward(preview)
      await expect.poll(() => where(preview), `${name} moves`).not.toBe(before)
    }

    // The progress example rested on the slide Next showed, and its bar
    // follows --carousel-progress.
    const progress = previews.nth(order.indexOf("progress"))
    await expect(progress.getByText("Rested on slide 2")).toBeVisible()
    const root = progress.locator("[aria-roledescription='carousel']")
    await expect
      .poll(() => root.evaluate((el) => getComputedStyle(el).getPropertyValue("--carousel-progress")))
      .toBe("0.2500")

    expect(errors).toEqual([])
  })
}

for (const framework of frameworks) {
  test(`the render example's gallery link takes focus from Next in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/carousel`, { waitUntil: "networkidle" })
    const preview = page.locator("[data-example]").nth(order.indexOf("render"))
    await preview.scrollIntoViewIfNeeded()
    await preview.getByRole("button", { name: "Next" }).focus()
    for (let press = 0; press < 5; press++) await page.keyboard.press("Enter")
    await expect(preview.getByRole("link", { name: "See all photos" })).toBeFocused()
  })
}

for (const framework of frameworks) {
  test(`the thumbnail strip follows the gallery in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/carousel`, { waitUntil: "networkidle" })
    const preview = page.locator("[data-example]").nth(order.indexOf("thumbnails"))
    await preview.scrollIntoViewIfNeeded()
    const gallery = preview.getByRole("region", { name: "Photos" })
    await gallery.locator('[data-slot="carousel-viewport"]').focus()
    for (let press = 0; press < 5; press++) await page.keyboard.press("ArrowRight")
    const harbor = preview.getByRole("button", { name: "Harbor" })
    await expect(harbor).toHaveAttribute("aria-pressed", "true")
    // Wholly inside the strip's viewport.
    await expect
      .poll(() =>
        harbor.evaluate((el) => {
          const box = el.getBoundingClientRect()
          const strip = el.closest('[data-slot="carousel-viewport"]')!.getBoundingClientRect()
          return box.left >= strip.left - 1 && box.right <= strip.right + 1
        }),
      )
      .toBe(true)
  })
}
