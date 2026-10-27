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
  test(`the ${label} docs list the sections, and Components opens the React catalog`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/docs/core")
    // On a phone the sections open from the menu.
    if (label === "mobile") await page.getByRole("button", { name: "Menu", exact: true }).click()
    const sections = page.getByRole("navigation", { name: "Sections" }).filter({ visible: true })
    await expect(sections).toHaveCount(1)
    await expect(sections.getByRole("link")).toHaveText(menu.map((item) => item.title))
    await expect(sections.getByRole("link", { name: menu[0].title, exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    )
    await sections.getByRole("link", { name: "Components", exact: true }).click()
    await expect(page).toHaveURL(/\/docs\/react\/components$/)
    if (label === "mobile") await page.getByRole("button", { name: "Menu", exact: true }).click()
    await expect(sections.getByRole("link", { name: "Components", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    )
    const docs = page.getByRole("navigation", { name: "Docs" }).filter({ visible: true })
    await expect(docs.getByRole("link", { name: "Overview", exact: true })).toBeVisible()
    await expect(docs.getByRole("link", { name: "Button", exact: true })).toBeVisible()
    await expect(docs.getByRole("link", { name: "Parts and Composition", exact: true })).toHaveCount(0)
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

test("the header's framework picker stays on Docs and Agents pages and changes the framework", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  const picker = page.getByRole("combobox", { name: "Framework", exact: true })
  for (const path of ["/docs/core", "/docs/agents"]) {
    await page.goto(path)
    // Nothing picked yet.
    await expect(picker).toHaveText("Framework", { useInnerText: true })
  }
  await picker.click()
  await page.getByRole("option", { name: "Svelte", exact: true }).click()
  await expect(picker).toHaveText("Svelte", { useInnerText: true })
  await expect(page).toHaveURL(/\/docs\/agents$/)
  const sections = page.getByRole("navigation", { name: "Sections" })
  await sections.getByRole("link", { name: "Guides", exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/svelte$/)
})

test("the header shows the saved framework and framework-less links before the page hydrates", async ({
  page,
}) => {
  await page.context().addCookies([{ name: "framework", value: "vue", url: "http://localhost" }])
  // No scripts but the inline ones, so React never hydrates.
  await page.route(/\.js(\?|$)/, (route) => route.abort())
  for (const path of ["/", "/docs/core"]) {
    await page.goto(path)
    await expect(page.getByRole("combobox", { name: "Framework", exact: true })).toHaveText("Vue", {
      useInnerText: true,
    })
  }
  // Guides and Components keep their framework-less hrefs, so the cookie
  // redirects send this reader to Vue, not the hydration fallback.
  const sections = page.getByRole("navigation", { name: "Sections" }).first()
  await expect(sections.getByRole("link", { name: "Guides", exact: true })).toHaveAttribute(
    "href",
    "/docs/frameworks",
  )
  await expect(sections.getByRole("link", { name: "Components", exact: true })).toHaveAttribute(
    "href",
    "/docs/components",
  )
})

test("Guides and Components split a framework's docs, each with its own sidebar", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/docs/frameworks")
  await expect(page).toHaveURL(/\/docs\/react$/)
  const sections = page.getByRole("navigation", { name: "Sections" })
  const docs = page.getByRole("navigation", { name: "Docs" })
  const guides = sections.getByRole("link", { name: "Guides", exact: true })
  const components = sections.getByRole("link", { name: "Components", exact: true })
  await expect(sections.getByRole("link", { name: "Frameworks", exact: true })).toHaveCount(0)
  await expect(guides).toHaveAttribute("aria-current", "page")
  await expect(components).not.toHaveAttribute("aria-current", "page")
  await expect(components).not.toHaveAttribute("aria-haspopup")
  await expect(docs.getByText("Using Components", { exact: true })).toBeVisible()
  await expect(docs.getByRole("link", { name: "Parts and Composition", exact: true })).toBeVisible()
  await expect(docs.getByRole("link", { name: "Button", exact: true })).toHaveCount(0)

  await components.click()
  await expect(page).toHaveURL(/\/docs\/react\/components$/)
  await expect(components).toHaveAttribute("aria-current", "page")
  await expect(guides).not.toHaveAttribute("aria-current", "page")
  await expect(docs.getByRole("link", { name: "Overview", exact: true })).toBeVisible()
  await expect(docs.getByRole("link", { name: "Button", exact: true })).toBeVisible()
  await expect(docs.getByRole("link", { name: "Parts and Composition", exact: true })).toHaveCount(0)

  await page.getByRole("combobox", { name: "Framework", exact: true }).click()
  await page.getByRole("option", { name: "Vue", exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/vue\/components$/)
  await guides.click()
  await expect(page).toHaveURL(/\/docs\/vue$/)
  await expect(page.getByRole("combobox", { name: "Framework", exact: true })).toContainText("Vue")
  await page.goto("/docs/frameworks")
  await expect(page).toHaveURL(/\/docs\/vue$/)
})
