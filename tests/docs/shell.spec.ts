import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { menu } from "../../apps/docs/lib/menu"

// Axe on the docs shell: the header, the sidebar and search. Examples have their own checks.
for (const theme of ["light", "dark"]) {
  test(`docs shell has no axe violations in ${theme}`, async ({ page }) => {
    await page.addInitScript(
      (value) => localStorage.setItem("theme", value),
      theme
    )
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/docs/react/components/button")
    const scan = async () => {
      const { violations } = await new AxeBuilder({ page })
        .exclude("[data-example]")
        .analyze()
      return violations.map(
        (violation) =>
          `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(" | ")}`
      )
    }
    expect(await scan()).toEqual([])
    await page.getByRole("button", { name: "Frameworks", exact: true }).click()
    await expect(
      page.getByRole("link", { name: "Vue", exact: true })
    ).toBeVisible()
    expect(await scan()).toEqual([])
    await page.keyboard.press("Escape")
    await page.keyboard.press("ControlOrMeta+k")
    await expect(
      page.getByRole("dialog", { name: "Search the docs" })
    ).toBeVisible()
    expect(await scan()).toEqual([])
  })
}

for (const [label, width] of [
  ["desktop", 1280],
  ["mobile", 390],
] as const) {
  test(`the ${label} docs list the sections, and Components opens the React catalog`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto("/docs/core")
    // On a phone the sections open from the menu, which lists the frameworks on their own.
    if (label === "mobile") {
      await page.getByRole("button", { name: "Menu", exact: true }).click()
    }
    const sections = page
      .getByRole("navigation", { name: "Sections" })
      .filter({ visible: true })
    await expect(sections).toHaveCount(1)
    const items = menu.filter((item) =>
      label === "mobile"
        ? item.href !== "/docs/frameworks"
        : !item.href.startsWith("http")
    )
    await expect(
      sections.getByRole("listitem").filter({ hasNot: page.locator("li li") })
    ).toHaveText(
      label === "mobile"
        ? [
            ...items.map((item) => item.title),
            "React",
            "Vue",
            "Svelte",
            "Web Components",
            "Solid",
          ]
        : items.map((item) => item.title)
    )
    // Core shares its sidebar with Get Started, so Docs covers it.
    await expect(
      sections.getByRole("link", { name: "Docs", exact: true })
    ).toHaveAttribute("aria-current", "page")
    await sections
      .getByRole("link", { name: "Components", exact: true })
      .click()
    await expect(page).toHaveURL(/\/docs\/react\/components$/)
    if (label === "mobile") {
      await page.getByRole("button", { name: "Menu", exact: true }).click()
    }
    await expect(
      sections.getByRole("link", { name: "Components", exact: true })
    ).toHaveAttribute("aria-current", "page")
    const docs = page
      .getByRole("navigation", { name: "Docs" })
      .filter({ visible: true })
    await expect(
      docs.getByRole("link", { name: "Button", exact: true })
    ).toBeVisible()
    await expect(
      docs.getByRole("link", { name: "Parts and Composition", exact: true })
    ).toBeVisible()
  })
}

test("Get Started is the docs home, in Core's sidebar under Overview", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/docs")
  await expect(
    page.getByRole("heading", { name: "Get Started", level: 1 })
  ).toBeVisible()
  const docs = page.getByRole("navigation", { name: "Docs" })
  await expect(
    docs.getByRole("link", { name: "Get Started", exact: true })
  ).toHaveAttribute("aria-current", "page")
  await expect(docs.getByText("Overview", { exact: true })).toBeVisible()
  await expect(docs.getByText("Core", { exact: true })).toBeVisible()
  await expect(
    page
      .getByRole("navigation", { name: "Sections" })
      .getByRole("link", { name: "Docs", exact: true })
  ).toHaveAttribute("aria-current", "page")
  const markdown = await (await page.request.get("/docs.md")).text()
  expect(markdown).toContain("# Get Started")
  expect(markdown).not.toContain("<include>")
})

test("the setup prompt's framework dropdown remembers the choice", async ({
  page,
}) => {
  await page.goto("/docs")
  const picker = page.getByRole("combobox", { name: "Framework", exact: true })
  await expect(picker).toContainText("React")
  await picker.click()
  await page.getByRole("option", { name: "Svelte", exact: true }).click()
  await expect(picker).toContainText("Svelte")
  await expect(page.getByRole("main")).toContainText(
    "Set up ui-sdk in this Svelte project"
  )
  await expect(page.locator("html")).toHaveAttribute("data-framework", "svelte")
  await page.reload()
  await expect(picker).toContainText("Svelte")
})

test("the header's Frameworks menu opens the same page in another framework", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/docs/frameworks")
  await expect(page).toHaveURL(/\/docs\/react$/)
  await page.goto("/docs/react/components/button")
  await page.getByRole("button", { name: "Frameworks", exact: true }).click()
  await page.getByRole("link", { name: "Vue", exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/vue\/components\/button$/)
})

test("the Frameworks menu checks the current framework, else the saved one, else React", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  const checked = async () => {
    await page.getByRole("button", { name: "Frameworks", exact: true }).click()
    const links = page
      .getByRole("navigation", { name: "Sections" })
      .filter({ visible: true })
      .getByRole("link", { name: /^(React|Vue|Svelte|Web Components|Solid)$/ })
    await expect(links).toHaveCount(5)
    const names = []
    for (const link of await links.all()) {
      if (await link.locator("svg").isVisible()) {
        names.push(await link.textContent())
      }
    }
    await page.keyboard.press("Escape")
    return names
  }
  await page.goto("/docs/agents")
  expect(await checked()).toEqual(["React"])
  await page.goto("/docs/svelte")
  expect(await checked()).toEqual(["Svelte"])
  await page.goto("/docs/agents")
  expect(await checked()).toEqual(["Svelte"])
  await page
    .getByRole("navigation", { name: "Sections" })
    .getByRole("link", { name: "Components", exact: true })
    .click()
  await expect(page).toHaveURL(/\/docs\/svelte\/components$/)
})

test("the saved framework and framework-less links are in place before the page hydrates", async ({
  page,
}) => {
  await page
    .context()
    .addCookies([{ name: "framework", value: "vue", url: "http://localhost" }])
  // No scripts but the inline ones, so React never hydrates.
  await page.route(/\.js(\?|$)/, (route) => route.abort())
  for (const path of ["/", "/docs/core"]) {
    await page.goto(path)
    await expect(page.locator("html")).toHaveAttribute("data-framework", "vue")
  }
  const sections = page.getByRole("navigation", { name: "Sections" }).first()
  await expect(
    sections.getByRole("link", { name: "Components", exact: true })
  ).toHaveAttribute("href", "/docs/components")
})

test("a framework's guides and components share one sidebar", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/docs/frameworks")
  await expect(page).toHaveURL(/\/docs\/react$/)
  const sections = page.getByRole("navigation", { name: "Sections" })
  const docs = page.getByRole("navigation", { name: "Docs" })
  const frameworks = sections.getByRole("button", {
    name: "Frameworks",
    exact: true,
  })
  const components = sections.getByRole("link", {
    name: "Components",
    exact: true,
  })
  await expect(frameworks).toHaveAttribute("data-current", "")
  await expect(components).not.toHaveAttribute("aria-current", "page")
  await expect(
    docs.getByText("Using Components", { exact: true })
  ).toBeVisible()
  await expect(
    docs.getByRole("link", { name: "Parts and Composition", exact: true })
  ).toBeVisible()
  await expect(
    docs.getByRole("link", { name: "Button", exact: true })
  ).toBeVisible()

  await components.click()
  await expect(page).toHaveURL(/\/docs\/react\/components$/)
  await expect(components).toHaveAttribute("aria-current", "page")
  await expect(frameworks).not.toHaveAttribute("data-current")
  await expect(
    docs.getByRole("link", { name: "Parts and Composition", exact: true })
  ).toBeVisible()

  await frameworks.click()
  await page.getByRole("link", { name: "Vue", exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/vue\/components$/)
  await expect(page.locator("html")).toHaveAttribute("data-framework", "vue")
  await page.goto("/docs/frameworks")
  await expect(page).toHaveURL(/\/docs\/vue$/)
})

test("the beta notice sits beside the docs, with no banner anywhere", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1600 })
  await page.goto("/docs/core/changelog")
  await expect(
    page
      .getByRole("navigation", { name: "On this page" })
      .getByText(/UI SDK is in beta/)
  ).toBeVisible()
  // The sidebar doesn't stretch a short page past the window.
  expect(
    await page.evaluate(() => document.scrollingElement!.scrollHeight)
  ).toBe(1600)
  await page.goto("/")
  await expect(page.getByText(/UI SDK is in beta/)).toHaveCount(0)
})

test("install commands keep the reader's package manager after a reload", async ({
  page,
}) => {
  await page.goto("/docs/svelte/installation")
  const managers = page
    .getByRole("combobox", { name: "Package manager" })
    .first()
  await managers.click()
  await page.getByRole("option", { name: "pnpm", exact: true }).click()
  await expect(page.locator("html")).toHaveAttribute(
    "data-package-manager",
    "pnpm"
  )
  await page.reload()
  await expect(managers).toHaveText("pnpm")
  await expect(
    page.getByText("pnpm add @ui-sdk/svelte @ui-sdk/core")
  ).toBeVisible()
  expect(
    await page.evaluate(() => localStorage.getItem("tabs:package-manager"))
  ).toBe("pnpm")
})
