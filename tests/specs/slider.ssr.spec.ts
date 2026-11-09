import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"
import { center, status, track, volume } from "./slider.helpers"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

test("sliders hydrate without mismatches", async ({ page, open }) => {
  await open("slider")
  await volume(page).focus()
  await page.keyboard.press("ArrowRight")
  await expect(volume(page)).toHaveValue("51")
  expect(await hydrationErrors(page)).toEqual([])
})

test("right to left sliders hydrate without mismatches", async ({
  page,
  open,
}) => {
  await open("slider", { dir: "rtl", price: "10,90" })
  await expect(volume(page)).toHaveValue("50")
  expect(await hydrationErrors(page)).toEqual([])
})

test("the server markup places the thumbs before hydration", async ({
  page,
  open,
}) => {
  await open("slider", { hydrate: "manual" })
  const box = (await track(page, 0).boundingBox())!
  // Labels join their controls once the field binds, so the thumb is found by its class.
  const thumb = await center(page.locator(".slider-thumb").first())
  expect(Math.abs(thumb.x - (box.x + box.width / 2))).toBeLessThan(1.5)
})

test("right to left, the server markup centers each thumb on its value before hydration", async ({
  page,
  open,
}) => {
  await open("slider", { dir: "rtl", hydrate: "manual" })
  const box = (await track(page, 1).boundingBox())!
  // The range's first thumb is at 20, a fifth of the way from the right.
  const thumb = await center(page.locator(".slider-thumb").nth(1))
  expect(Math.abs(thumb.x - (box.x + box.width * 0.8))).toBeLessThan(1.5)
})

test("the server markup submits the defaults before hydration", async ({
  page,
  open,
}) => {
  await open("slider", { hydrate: "manual" })
  const data = await page.evaluate(() =>
    new URLSearchParams(
      new FormData(document.querySelector("form")!) as unknown as Record<
        string,
        string
      >
    ).toString()
  )
  expect(data).toBe("volume=50&price=20%2F80")
})

test("sliders work after hydrating late", async ({ page, open }) => {
  await open("slider", { hydrate: "manual" })
  await page.evaluate(() =>
    (window as unknown as { hydrate: () => void }).hydrate()
  )
  await volume(page).focus()
  await page.keyboard.press("End")
  await expect(volume(page)).toHaveValue("100")
  await page.getByRole("button", { name: "Save" }).click()
  await expect.poll(() => status(page, "Submitted")).toContain("volume=100")
  expect(await hydrationErrors(page)).toEqual([])
})
