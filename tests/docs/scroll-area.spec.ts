import { expect, type Locator } from "@playwright/test"
import { test } from "./docs-test"
import { testExamples, type Check } from "./docs-helpers"

// Scrolls an example to its end with the wheel, over its first item, as a user would.
async function scrollToEnd(preview: Locator, first: string, last: string) {
  await preview.getByText(first, { exact: true }).first().hover()
  const item = preview.getByText(last, { exact: true }).first()
  await expect(async () => {
    await preview.page().mouse.wheel(0, 2000)
    await expect(item).toBeInViewport({ ratio: 1, timeout: 200 })
  }).toPass()
}

// The newest line in an example's console.
const lastLog = (preview: Locator) =>
  preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()

// Each example's check, in the order they appear on the Scroll Area page.
const checks: Record<string, Check> = {
  basic: async (preview) => {
    await expect(preview.getByRole("region", { name: "Tags" })).toBeVisible()
    await scrollToEnd(preview, "v1.2.0-beta.50", "v1.2.0-beta.1")
  },
  horizontal: async (preview) => {
    await expect(preview.getByText("Sand", { exact: true })).toBeVisible()
    const viewport = preview.getByRole("region", { name: "Palette" })
    await expect
      .poll(() => viewport.evaluate((el) => el.scrollWidth > el.clientWidth))
      .toBe(true)
    await viewport.evaluate((el) => {
      el.scrollLeft = el.scrollWidth
    })
    await expect(preview.locator('[data-slot="scroll-area"]')).toHaveAttribute(
      "data-at-x-end",
      ""
    )
  },
  "both-axes": async (preview) => {
    await expect(
      preview.getByRole("columnheader", { name: "Version" })
    ).toBeVisible()
    await expect(
      preview.getByRole("rowheader", { name: "v1.12.0" })
    ).toBeVisible()
    await expect(preview.locator('[data-slot="scroll-area"]')).toHaveAttribute(
      "data-overflow-x",
      ""
    )
    await expect(preview.locator('[data-slot="scroll-area"]')).toHaveAttribute(
      "data-overflow-y",
      ""
    )
  },
  rtl: async (preview) => {
    await expect(preview.getByText("الوسوم")).toBeVisible()
  },
  "edge-fade": async (preview) => {
    await expect(preview.getByText("v1.12.0")).toBeVisible()
    const fade = preview.locator('[data-slot="top-fade"]')
    await expect
      .poll(() => fade.evaluate((el) => el.getBoundingClientRect().height))
      .toBe(0)
    await preview
      .getByRole("region", { name: "Release notes" })
      .evaluate((viewport) => {
        viewport.scrollTop = 200
      })
    await expect
      .poll(() => fade.evaluate((el) => el.getBoundingClientRect().height))
      .toBe(32)
  },
  "native-scrollbars": async (preview) => {
    await expect(
      preview.getByText("Launch checklist for Thursday")
    ).toBeVisible()
    await expect(
      preview.locator('[data-slot="scroll-area-scrollbar"]')
    ).toHaveCount(0)
  },
  type: async (preview) => {
    await expect(preview.getByText('type="always"')).toBeVisible()
  },
  "hide-delay": async (preview) => {
    await expect(preview.getByText("2000 ms delay")).toBeVisible()
  },
  controller: async (preview) => {
    await preview.scrollIntoViewIfNeeded()
    await preview.getByRole("button", { name: "Jump to the End" }).click()
    await expect(
      preview.getByText("v1.2.0-beta.1", { exact: true })
    ).toBeInViewport()
    await expect(lastLog(preview)).toHaveText("At the end")
    await preview.getByRole("button", { name: "Back to Top" }).click()
    await expect(
      preview.getByText("v1.2.0-beta.50", { exact: true })
    ).toBeInViewport()
    await expect(lastLog(preview)).toHaveText("At the start")
  },
  render: async (preview) => {
    await expect(preview.getByText("Scroll for older releases")).toBeVisible()
    await scrollToEnd(preview, "v1.2.0-beta.50", "v1.2.0-beta.1")
    await expect(preview.getByText("Scroll for older releases")).toBeHidden()
  },
}

testExamples("scroll-area", checks)

// A smooth scroll from the controller jumps for people who ask for less motion.
for (const framework of ["react", "svelte", "solid"]) {
  test(`a smooth controller scroll jumps with reduced motion in ${framework}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto(`/docs/${framework}/components/scroll-area`)
    await page.waitForLoadState("networkidle")
    const preview = page.locator('[data-example="scroll-area/controller"]')
    await preview.scrollIntoViewIfNeeded()
    await preview.getByRole("button", { name: "Jump to the end" }).click()
    await expect(
      preview.getByText("v1.2.0-beta.1", { exact: true })
    ).toBeInViewport()
    await preview.getByRole("button", { name: "Back to top" }).click()
    // Read in the same task as the press, before a smooth scroll could move.
    const top = await preview.evaluate((root) => {
      const scroller = [...root.querySelectorAll<HTMLElement>("*")].find(
        (el) =>
          el.scrollHeight > el.clientHeight + 10 &&
          getComputedStyle(el).overflowY !== "visible"
      )
      return scroller?.scrollTop
    })
    expect(top).toBe(0)
  })
}
