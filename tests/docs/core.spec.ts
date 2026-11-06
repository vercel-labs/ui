import { expect } from "@playwright/test"
import { test } from "./docs-test"
import { frameworks } from "./docs-helpers"

// Core and Agents are one section each, for every framework.
const pages = [
  ["/core", "Introduction"],
  ["/core/build-a-component", "Build a Component"],
  ["/core/compose-behaviors", "Compose Behaviors"],
  ["/core/kernel/define-a-primitive", "Define a Primitive"],
  ["/core/kernel/render-a-primitive", "Render a Primitive"],
  ["/core/kernel/style-a-component", "Style a Component"],
  ["/core/kernel/handle-changes", "Handle Changes"],
  ["/core/platform", "Platform"],
  ["/core/storage", "Storage"],
  ["/core/reference", "Reference"],
  ["/core/behaviors", "All Behaviors"],
  ["/core/behaviors/focus", "Focus and Keys"],
  ["/core/behaviors/selection", "Selection"],
  ["/core/behaviors/drag-and-drop", "Drag and Drop"],
  ["/core/behaviors/direct-manipulation", "Dragging and Resizing"],
  ["/core/behaviors/lists", "Lists"],
  ["/core/behaviors/trees", "Trees"],
  ["/core/behaviors/motion", "Transitions and Gestures"],
  ["/core/behaviors/popups", "Popups and Layers"],
  ["/core/behaviors/preferences", "Preferences"],
  ["/core/behaviors/canvas", "Canvas"],
  ["/core/date", "Dates"],
  ["/core/color", "Colors"],
  ["/core/image", "Images"],
  ["/core/testing", "Testing"],
  ["/core/observe", "Observe"],
  ["/react/custom-parts", "Custom Parts"],
  ["/react/hooks/async-options", "Async Options"],
  ["/react/hooks/shortcuts", "Shortcuts"],
  ["/agents", "Built for Agents"],
  ["/agents/build-with-an-agent", "Build with an Agent"],
  ["/agents/connect-an-agent", "Get Started"],
  ["/agents/connect-an-agent/guide", "Guide"],
  ["/agents/connect-an-agent/your-components", "Your Own Components"],
  ["/agents/connect-an-agent/permissions", "Permissions"],
  ["/agents/connect-an-agent/observe-changes", "Observe Changes"],
  ["/agents/connect-an-agent/history-and-undo", "History and Undo"],
  ["/agents/connect-an-agent/webmcp", "WebMCP"],
  ["/agents/connect-an-agent/reference", "Reference"],
  ["/agents/skills", "Skills"],
  ...frameworks.map((framework) => [`/${framework}/rendering`, "Rendering Primitives"]),
]

for (const [slug, title] of pages) {
  test(`the ${slug} page renders`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs${slug}`)
    await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible()
    expect(errors).toEqual([])
  })
}

test("each framework's rendering guide explains its helpers", async ({ page }) => {
  await page.goto("/docs/react/custom-parts")
  await expect(page.getByRole("heading", { name: "Write a Root Part" })).toBeVisible()
  await expect(page.getByText("usePrimitive", { exact: true }).first()).toBeVisible()
  await page.goto("/docs/web-components/rendering")
  await expect(page.getByRole("heading", { name: "Define the Elements" })).toBeVisible()
  await expect(page.getByText("createParts", { exact: true }).first()).toBeVisible()
})

test("Observe lives in Core Tools and old framework URLs redirect", async ({ page }) => {
  for (const framework of frameworks) {
    const folder = framework === "react" ? "hooks" : "utilities"
    await page.goto(`/docs/${framework}/${folder}/observe`)
    await expect(page).toHaveURL(/\/docs\/core\/observe$/)
  }
  await page.goto("/docs/utilities/observe")
  await expect(page).toHaveURL(/\/docs\/core\/observe$/)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Observe")
  await page.goto("/docs/react/hooks/shortcuts")
  await expect(
    page.getByRole("navigation", { name: "Docs" }).getByRole("link", { name: "Observe", exact: true }),
  ).toHaveCount(0)
})

test("removed Why docs lead back to their framework introduction", async ({ page }) => {
  for (const framework of frameworks) {
    await page.goto(`/docs/${framework}/why`)
    await expect(page).toHaveURL(new RegExp(`/docs/${framework}$`))
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Introduction")
  }
})

test("old framework copies of Core and Agents redirect", async ({ page }) => {
  await page.goto("/docs/react/core")
  await expect(page).toHaveURL(/\/docs\/core$/)
  await page.goto("/docs/vue/core/popups")
  await expect(page).toHaveURL(/\/docs\/core\/behaviors\/popups$/)
  await page.goto("/docs/vue/utilities/building-blocks")
  await expect(page).toHaveURL(/\/docs\/core\/behaviors$/)
  await page.goto("/docs/core/building-blocks")
  await expect(page).toHaveURL(/\/docs\/core\/behaviors$/)
  await page.goto("/docs/svelte/agents")
  await expect(page).toHaveURL(/\/docs\/agents$/)
  await page.goto("/docs/agents/create-agent")
  await expect(page).toHaveURL(/\/docs\/agents\/connect-an-agent$/)
  await page.goto("/docs/agents/webmcp")
  await expect(page).toHaveURL(/\/docs\/agents\/connect-an-agent\/webmcp$/)
  await page.goto("/docs/react/utilities/shortcuts")
  await expect(page).toHaveURL(/\/docs\/react\/hooks\/shortcuts$/)
})

test("pages that moved in the foundation docs redirect", async ({ page }) => {
  await page.goto("/docs/core/get-started")
  await expect(page).toHaveURL(/\/docs\/core\/build-a-component$/)
  await page.goto("/docs/behaviors/focus")
  await expect(page).toHaveURL(/\/docs\/core\/behaviors\/focus$/)
  await page.goto("/docs/core/trees")
  await expect(page).toHaveURL(/\/docs\/core\/behaviors\/trees$/)
  await page.goto("/docs/core/behaviors/date")
  await expect(page).toHaveURL(/\/docs\/core\/date$/)
  await page.goto("/docs/behaviors/date")
  await expect(page).toHaveURL(/\/docs\/core\/date$/)
  await page.goto("/docs/core/primitives")
  await expect(page).toHaveURL(/\/docs\/core\/kernel\/define-a-primitive$/)
  await page.goto("/docs/core/behaviors/state-and-events")
  await expect(page).toHaveURL(/\/docs\/core\/kernel\/handle-changes$/)
  await page.goto("/docs/core/kernel/state-and-changes")
  await expect(page).toHaveURL(/\/docs\/core\/kernel\/handle-changes$/)
  await page.goto("/docs/vue/primitives")
  await expect(page).toHaveURL(/\/docs\/vue\/rendering$/)
})

test("links from Core go to the framework read last", async ({ page }) => {
  await page.goto("/docs/components/field")
  await expect(page).toHaveURL(/\/docs\/react\/components\/field$/)
  await page.goto("/docs/vue/components/menu")
  await expect
    .poll(async () => (await page.context().cookies()).find((cookie) => cookie.name === "framework")?.value)
    .toBe("vue")
  await page.goto("/docs/core/behaviors/popups")
  await page.getByRole("link", { name: "Popover", exact: true }).first().click()
  await expect(page).toHaveURL(/\/docs\/vue\/components\/popover$/)
  await page.goto("/docs/utilities/shortcuts")
  await expect(page).toHaveURL(/\/docs\/vue\/utilities\/shortcuts$/)
})

test("Components opens the framework read last, and the Frameworks menu keeps the page", async ({ page }) => {
  await page.goto("/docs/vue")
  await expect
    .poll(async () => (await page.context().cookies()).find((cookie) => cookie.name === "framework")?.value)
    .toBe("vue")
  await page.goto("/docs/core")
  const sections = page.getByRole("navigation", { name: "Sections" }).first()
  await sections.getByRole("link", { name: "Components", exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/vue\/components$/)
  await expect(sections.getByRole("link", { name: "Components", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  )

  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/docs/react/hooks/shortcuts")
  await page.getByRole("button", { name: "Frameworks", exact: true }).click()
  await page.getByRole("link", { name: "Vue", exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/vue\/utilities\/shortcuts$/)
})

test("Core's snippets follow the framework docs visited last", async ({ page }) => {
  await page.goto("/docs/svelte")
  await expect
    .poll(async () => (await page.context().cookies()).find((cookie) => cookie.name === "framework")?.value)
    .toBe("svelte")
  await page.goto("/docs/core/build-a-component")
  await expect(page.getByRole("main")).toContainText("npm install @ui-sdk/svelte")

  await page.goto("/docs/solid")
  await expect
    .poll(async () => (await page.context().cookies()).find((cookie) => cookie.name === "framework")?.value)
    .toBe("solid")
  await page.goto("/docs/core/build-a-component")
  await expect(page.getByRole("main")).toContainText("npm install @ui-sdk/solid")
})

test("the reference points to focused guides", async ({ page }) => {
  await page.goto("/docs/core/reference")
  for (const [name, href] of [
    ["Define a Primitive", "/docs/core/kernel/define-a-primitive"],
    ["Handle Changes", "/docs/core/kernel/handle-changes"],
    ["Focus and Keys", "/docs/core/behaviors/focus#roving-focus"],
    ["Selection", "/docs/core/behaviors/selection"],
    ["Popups and Layers", "/docs/core/behaviors/popups"],
    ["Platform", "/docs/core/platform"],
    ["Text", "/docs/core/text"],
    ["Testing", "/docs/core/testing"],
  ]) {
    const link = page.getByRole("main").getByRole("link", { name, exact: true }).first()
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute("href", href)
  }
  await expect(page.getByRole("heading", { name: "Full API", exact: true })).toHaveCount(0)
})

test("Core and Agents Markdown preserves the reference and every framework's examples", async ({
  request,
}) => {
  const core = await request.get("/docs/core.md")
  expect(core.headers()["content-type"]).toContain("text/markdown")
  const text = await core.text()
  expect(text).toContain("# Build a Component")
  expect(text).toContain("# Compose Behaviors")
  expect(text).toContain("# Drag and Drop")
  expect(text).toContain("createRovingFocus(context, {")
  expect(text).toContain("createPopup(context, { preset: popoverPreset })")
  expect(text).not.toContain("<CoreExports")
  expect(text).not.toContain("<Collapsible")
  expect(text).not.toContain("</Collapsible")
  // Every table becomes a list, whatever quotes its attributes use.
  expect(text).not.toContain("<TypeTable")
  expect(text).toContain('addDays("2026-12-24", 3)')
  for (const [label, entry] of [
    ["React", "@ui-sdk/react/primitive"],
    ["Vue", "@ui-sdk/vue/primitive"],
    ["Svelte", "@ui-sdk/svelte/primitive"],
    ["Solid", "@ui-sdk/solid/primitive"],
    ["Web Components", "@ui-sdk/web"],
  ]) {
    expect(text).toContain(`**${label}**`)
    expect(text).toContain(`from "${entry}"`)
  }
  expect(text).not.toContain("<FrameworkGuide")
  expect(text).not.toContain("<FrameworkContent")
  const agents = await (await request.get("/docs/agents.md")).text()
  expect(agents).toContain("# Get Started")
  expect(agents).toContain("# Guide")
  expect(agents).toContain("# Permissions")
  expect(agents).toContain("# Observe Changes")
  expect(agents).toContain("# History and Undo")
  expect(agents).toContain("@ui-sdk/vue/agent")
  const old = await request.get("/docs/vue/core.md")
  expect(old.url()).toMatch(/\/docs\/core\.md$/)
})
