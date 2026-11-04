import { expect, test, type Locator } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// Scrolls an example to its end with the wheel, over its first item, as a user would.
async function scrollToEnd(preview: Locator, first: string, last: string) {
  await preview.getByText(first, { exact: true }).first().hover()
  const item = preview.getByText(last, { exact: true }).first()
  await expect(async () => {
    await preview.page().mouse.wheel(0, 2000)
    await expect(item).toBeInViewport({ ratio: 1, timeout: 200 })
  }).toPass()
}

// Each example's check, in the order they appear on the Scroll Area page.
testExamples("scroll-area", {
  basic: async (preview) => {
    await expect(preview.getByText("v1.2.0-beta.50")).toBeVisible()
    await scrollToEnd(preview, "v1.2.0-beta.50", "v1.2.0-beta.1")
  },
  horizontal: async (preview) => {
    await expect(preview.getByText("Dunes at dusk")).toBeVisible()
  },
  "both-axes": async (preview) => {
    await expect(preview.getByText("v1.12.0")).toBeVisible()
  },
  rtl: async (preview) => {
    await expect(preview.getByText("الوسوم")).toBeVisible()
  },
  chat: async (preview) => {
    await preview.scrollIntoViewIfNeeded()
    // Sticking to the end, it starts at the newest message.
    await expect(preview.getByText(/follows again once you're back at the bottom/)).toBeInViewport()
    await preview.getByRole("button", { name: "Ask for more" }).click()
    await expect(preview.getByText(/count too/)).toBeInViewport({ timeout: 10_000 })
  },
  "edge-fade": async (preview) => {
    await expect(preview.getByText("v1.2.0-beta.50")).toBeVisible()
  },
  "native-scrollbars": async (preview) => {
    await expect(preview.getByText("v1.2.0-beta.50")).toBeVisible()
  },
  type: async (preview) => {
    await expect(preview.getByText('type="always"')).toBeVisible()
  },
  "hide-delay": async (preview) => {
    await expect(preview.getByText(/2000/)).toBeVisible()
  },
  controller: async (preview) => {
    await preview.scrollIntoViewIfNeeded()
    await preview.getByRole("button", { name: "Jump to the end" }).click()
    await expect(preview.getByText("v1.2.0-beta.1", { exact: true })).toBeInViewport()
    await preview.getByRole("button", { name: "Back to top" }).click()
    await expect(preview.getByText("v1.2.0-beta.50", { exact: true })).toBeInViewport()
  },
  render: async (preview) => {
    await expect(preview.getByText("v1.2.0-beta.50")).toBeVisible()
  },
})

// A smooth scroll from the controller jumps for people who ask for less motion.
for (const framework of ["react", "svelte", "solid"]) {
  test(`a smooth controller scroll jumps with reduced motion in ${framework}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto(`/docs/${framework}/components/scroll-area`)
    await page.waitForLoadState("networkidle")
    const preview = page.locator('[data-example="scroll-area/controller"]')
    await preview.scrollIntoViewIfNeeded()
    await preview.getByRole("button", { name: "Jump to the end" }).click()
    await expect(preview.getByText("v1.2.0-beta.1", { exact: true })).toBeInViewport()
    await preview.getByRole("button", { name: "Back to top" }).click()
    // Read in the same task as the press, before a smooth scroll could move.
    const top = await preview.evaluate((root) => {
      const scroller = [...root.querySelectorAll<HTMLElement>("*")].find(
        (el) => el.scrollHeight > el.clientHeight + 10 && getComputedStyle(el).overflowY !== "visible",
      )
      return scroller?.scrollTop
    })
    expect(top).toBe(0)
  })
}
