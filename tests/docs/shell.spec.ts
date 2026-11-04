import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { menu } from "../../apps/docs/lib/menu"

// Axe on the docs shell: the header, the sidebar and search. Examples have their own checks.
for (const theme of ["light", "dark"]) {
  test(`docs shell has no axe violations in ${theme}`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("theme", value), theme)
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/docs/react/components/button")
    const scan = async () => {
      const { violations } = await new AxeBuilder({ page }).exclude("[data-example]").analyze()
      return violations.map(
        (violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(" | ")}`,
      )
    }
    expect(await scan()).toEqual([])
    await page.getByRole("combobox", { name: "Framework", exact: true }).click()
    await expect(page.getByRole("option", { name: "Vue", exact: true })).toBeVisible()
    expect(await scan()).toEqual([])
    await page.keyboard.press("Escape")
    await page.keyboard.press("ControlOrMeta+k")
    await expect(page.getByRole("dialog", { name: "Search the docs" })).toBeVisible()
    expect(await scan()).toEqual([])
  })
}

for (const [label, width] of [
  ["desktop", 1280],
  ["mobile", 390],
] as const) {
  test(`the ${label} docs list the sections, and Behaviors is current on its pages`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/docs/behaviors")
    // On a phone the sections open from the menu.
    if (label === "mobile") await page.getByRole("button", { name: "Menu", exact: true }).click()
    const sections = page.getByRole("navigation", { name: "Sections" }).filter({ visible: true })
    await expect(sections).toHaveCount(1)
    await expect(sections.getByRole("listitem")).toHaveText(menu.map((item) => item.title))
    await expect(sections.getByRole("link", { name: "Behaviors", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    )
    await sections.getByRole("link", { name: "Agents", exact: true }).click()
    await expect(page).toHaveURL(/\/docs\/agents$/)
  })
}

test("the header's framework picker opens the same page in another framework", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  const picker = page.getByRole("combobox", { name: "Framework", exact: true })
  await page.goto("/docs/frameworks")
  await expect(page).toHaveURL(/\/docs\/react$/)
  await expect(picker).toContainText("React")
  await page.goto("/docs/react/components/button")
  await expect(picker).toContainText("React")
  await picker.click()
  await page.getByRole("option", { name: "Vue", exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/vue\/components\/button$/)
  await expect(picker).toContainText("Vue")
})

test("the header's framework picker stays on Core and Agents pages and changes the framework", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  const picker = page.getByRole("combobox", { name: "Framework", exact: true })
  for (const path of ["/docs/behaviors", "/docs/agents"]) {
    await page.goto(path)
    // Nothing picked yet.
    await expect(picker).toHaveText("Framework", { useInnerText: true })
  }
  await picker.click()
  await page.getByRole("option", { name: "Svelte", exact: true }).click()
  await expect(picker).toHaveText("Svelte", { useInnerText: true })
  await expect(page).toHaveURL(/\/docs\/agents$/)
  await page.goto("/docs")
  await expect(page).toHaveURL(/\/docs\/svelte$/)
})

test("the header shows the saved framework and framework-less links before the page hydrates", async ({
  page,
}) => {
  await page.context().addCookies([{ name: "framework", value: "vue", url: "http://localhost" }])
  // No scripts but the inline ones, so React never hydrates.
  await page.route(/\.js(\?|$)/, (route) => route.abort())
  for (const path of ["/", "/docs/behaviors"]) {
    await page.goto(path)
    await expect(page.getByRole("combobox", { name: "Framework", exact: true })).toHaveText("Vue", {
      useInnerText: true,
    })
  }
})

test("a framework's sidebar holds its guides and its components, A to Z", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/docs")
  await expect(page).toHaveURL(/\/docs\/react$/)
  const sections = page.getByRole("navigation", { name: "Sections" })
  const docs = page.getByRole("navigation", { name: "Docs" })
  const frameworks = sections.getByRole("button", { name: "Get Started", exact: true })
  await expect(frameworks).toHaveAttribute("data-current", "")
  await expect(sections.getByRole("link", { name: "Components", exact: true })).toHaveCount(0)
  for (const name of [
    "Introduction",
    "How It Works",
    "Build with an Agent",
    "Parts and Composition",
    "Button",
  ])
    await expect(docs.getByRole("link", { name, exact: true })).toBeVisible()
  const components = docs.getByRole("link", { name: "Components", exact: true })
  await expect(components).toHaveAttribute("href", "/docs/react/components")
  const names = await components.locator("xpath=following-sibling::ul[1]").getByRole("link").allTextContents()
  expect(names).toContain("Accordion")
  expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))

  await page.goto("/docs/react/components/button")
  await expect(frameworks).toHaveAttribute("data-current", "")
  await expect(docs.getByRole("link", { name: "Parts and Composition", exact: true })).toBeVisible()

  await frameworks.click()
  const list = sections.getByRole("link", { name: /^(React|Vue|Svelte|Web Components|Solid)$/ })
  await expect(list).toHaveText(["React", "Vue", "Svelte", "Web Components", "Solid"])
  await sections.getByRole("link", { name: "Solid", exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/solid$/)
  await expect(frameworks).toHaveAttribute("data-current", "")
  await expect(page.getByRole("combobox", { name: "Framework", exact: true })).toContainText("Solid")
  await expect(page.locator("html")).toHaveAttribute("data-framework", "solid")
  await page.goto("/docs/frameworks")
  await expect(page).toHaveURL(/\/docs\/solid$/)
})

test("install commands keep the reader's package manager after a reload", async ({ page }) => {
  await page.goto("/docs/svelte/installation")
  const managers = page.getByRole("tablist", { name: "Package manager" }).first()
  await managers.getByRole("tab", { name: "pnpm", exact: true }).click()
  await expect(page.locator("html")).toHaveAttribute("data-package-manager", "pnpm")
  await page.reload()
  await expect(managers.getByRole("tab", { name: "pnpm", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  )
  await expect(page.getByText("pnpm add @ui-sdk/svelte @ui-sdk/core")).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem("tabs:package-manager"))).toBe("pnpm")
})
