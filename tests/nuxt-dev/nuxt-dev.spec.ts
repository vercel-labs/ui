import { expect, test } from "@playwright/test"

test("a page that imports from the core renders and hydrates in nuxt dev, on one copy of it", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      errors.push(message.text())
    }
  })
  const prebundled: string[] = []
  const raw: string[] = []
  page.on("request", (request) => {
    const path = decodeURIComponent(new URL(request.url()).pathname)
    if (/\/deps\/@ui-sdk_core/.test(path)) {
      prebundled.push(path)
    } else if (path.includes("/@ui-sdk/core/")) {
      raw.push(path)
    }
  })

  await page.goto("/", { waitUntil: "networkidle" })
  await expect(page.locator("[data-view]")).toHaveAttribute("data-view", "list")
  await page.getByRole("tab", { name: "Password" }).click()
  await expect(page.getByRole("tab", { name: "Password" })).toHaveAttribute(
    "aria-selected",
    "true"
  )
  await page.getByRole("tab", { name: "Week" }).click()
  await expect(page.getByRole("tabpanel")).toHaveText([
    "A new password.",
    "1,024 visitors this week.",
  ])

  expect(errors).toEqual([])
  expect(prebundled.length + raw.length).toBeGreaterThan(0)
  expect(prebundled.length === 0 || raw.length === 0).toBe(true)
})
