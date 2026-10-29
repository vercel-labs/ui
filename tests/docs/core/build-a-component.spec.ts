import { expect, test, type Page } from "@playwright/test"
import { openExamples } from "./behaviors/helpers"

async function paintAt(page: Page, x: number, y: number) {
  const png = await page.screenshot({ clip: { x: Math.round(x), y: Math.round(y), width: 1, height: 1 } })
  return page.evaluate(async (base64) => {
    const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${base64}`)).blob())
    const context = new OffscreenCanvas(1, 1).getContext("2d")!
    context.drawImage(bitmap, 0, 0)
    return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]
  }, png.toString("base64"))
}

test("Build a component's examples render without errors", async ({ page }) => {
  const { errors } = await openExamples(page, "/docs/core/build-a-component")
  await expect(page.locator("[data-example]")).toHaveCount(2)
  expect(errors).toEqual([])
})

test("Mute toggles its pressed state with a click, Enter and Space", async ({ page }) => {
  await openExamples(page, "/docs/core/build-a-component")
  const button = page.locator("[data-example]").first().getByRole("button", { name: "Mute", exact: true })
  await expect(button).toHaveAttribute("aria-pressed", "false")
  await button.click()
  await expect(button).toHaveAttribute("aria-pressed", "true")
  await button.press("Enter")
  await expect(button).toHaveAttribute("aria-pressed", "false")
  await button.press("Space")
  await expect(button).toHaveAttribute("aria-pressed", "true")
})

test("highlighted lines span the code block's full scrollable width", async ({ page }) => {
  await page.goto("/docs/core/build-a-component")
  const pre = page.locator("pre").filter({ hasText: 'onMutedChange: "callback"' }).first()
  await pre.scrollIntoViewIfNeeded()
  const { clientWidth, scrollWidth, bands } = await pre.evaluate((el) => ({
    clientWidth: el.clientWidth,
    scrollWidth: el.scrollWidth,
    bands: [...el.querySelectorAll(".line.highlighted")].map((line) => line.getBoundingClientRect().width),
  }))
  expect(scrollWidth, "the block must overflow for the test to mean anything").toBeGreaterThan(clientWidth)
  expect(bands.length).toBeGreaterThan(0)
  for (const width of bands) expect(width).toBeGreaterThanOrEqual(scrollWidth - 2)
})

test("line numbers stay pinned while the code scrolls", async ({ page }) => {
  await page.goto("/docs/core/build-a-component")
  const pre = page.locator("pre").filter({ hasText: 'onMutedChange: "callback"' }).first()
  await pre.scrollIntoViewIfNeeded()
  const hits = await pre.evaluate((el) => {
    el.scrollLeft = 100
    const rect = el.getBoundingClientRect()
    return [...el.querySelectorAll(".line")].slice(0, 8).map((line) => {
      const y = line.getBoundingClientRect().top + 8
      const top = document.elementsFromPoint(rect.left + 4, y)[0]
      return top?.classList.contains("line") ? "gutter" : (top?.tagName ?? "none")
    })
  })
  expect(hits).toEqual(Array(8).fill("gutter"))
})

test("a highlighted gutter matches its band, and the block keeps its end padding", async ({ page }) => {
  await page.goto("/docs/core/build-a-component")
  const pre = page.locator("pre").filter({ hasText: 'onMutedChange: "callback"' }).first()
  await pre.scrollIntoViewIfNeeded()
  for (const theme of ["light", "dark"] as const) {
    await page.evaluate((next) => {
      localStorage.setItem("theme", next)
      const dark = next === "dark"
      document.documentElement.classList.toggle("dark", dark)
      document.documentElement.style.colorScheme = dark ? "dark" : "light"
    }, theme)
    const gap = await pre.evaluate((el) => {
      const lines = [...el.querySelectorAll<HTMLElement>(".line.highlighted")]
      const widest = lines.reduce((best, line) => (line.offsetWidth > best.offsetWidth ? line : best))
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const pad = parseFloat(getComputedStyle(widest).paddingInlineEnd)
      const textEnd =
        widest.getBoundingClientRect().right - pad - el.getBoundingClientRect().left + el.scrollLeft
      return { rem, gap: el.scrollWidth - textEnd }
    })
    expect(gap.gap).toBeGreaterThan(gap.rem * 0.75)
    expect(gap.gap).toBeLessThan(gap.rem * 1.25)
    await pre.evaluate((el) => {
      el.scrollLeft = 0
    })
    const gutter = await pre.evaluate((el) => {
      const line = el.querySelector(".line.highlighted")
      if (!line) {
        return null
      }
      const lineBox = line.getBoundingClientRect()
      const preBox = el.getBoundingClientRect()
      return { x: preBox.left + 4, y: lineBox.top + lineBox.height / 2 }
    })
    const band = await pre.evaluate((el) => {
      el.scrollLeft = el.scrollWidth
      const line = el.querySelector(".line.highlighted")
      if (!line) {
        return null
      }
      const lineBox = line.getBoundingClientRect()
      const preBox = el.getBoundingClientRect()
      return { x: preBox.left + el.clientWidth - 4, y: lineBox.top + lineBox.height / 2 }
    })
    expect(gutter).not.toBeNull()
    expect(band).not.toBeNull()
    if (!gutter || !band) {
      return
    }
    const gutterRgb = await paintAt(page, gutter.x, gutter.y)
    const bandRgb = await paintAt(page, band.x, band.y)
    for (const channel of [0, 1, 2] as const) {
      expect(Math.abs(gutterRgb[channel] - bandRgb[channel])).toBeLessThanOrEqual(1)
    }
  }
})

test("installation, rendering and the next guide follow the framework docs visited last", async ({
  page,
}) => {
  await page.goto("/docs/vue")
  await page.goto("/docs/core/build-a-component")
  await expect(page.getByRole("tablist", { name: "Framework", exact: true })).toHaveCount(0)
  const content = page.getByRole("main")
  await expect(content).toContainText("npm install @ui-sdk/vue")
  await expect(content).toContainText('import { createParts } from "@ui-sdk/vue/primitive"')
  await expect(content).toContainText('import { muteButton } from "@/lib/mute-button"')
  await expect(content).not.toContainText('from "@ui-sdk/react/primitive"')

  await page.goto("/docs/core/compose-behaviors")
  await expect(content).toContainText('import { createParts } from "@ui-sdk/vue/primitive"')
  await page.goto("/docs/web-components")
  await page.goto("/docs/core/compose-behaviors")
  await expect(content).toContainText("createParts(rating,")
  await expect(content).toContainText('import { rating } from "./rating"')
  await expect(content).not.toContainText('import { createParts } from "@ui-sdk/vue/primitive"')
  await expect(
    page.locator("pre").filter({ hasText: "const rating = definePrimitive({" }).first(),
  ).toBeVisible()
})
