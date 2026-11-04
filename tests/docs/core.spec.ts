import { expect, test } from "@playwright/test"
import { frameworks } from "./docs-helpers"

// Behaviors and Agents are one section each, for every framework.
const pages = [
  ["/behaviors/build-a-component", "Build a Component"],
  ["/behaviors/compose-behaviors", "Compose Behaviors"],
  ["/behaviors/define-a-primitive", "Define a Primitive"],
  ["/behaviors/state-and-changes", "State and Changes"],
  ["/behaviors/platform", "Platform"],
  ["/behaviors/storage", "Storage"],
  ["/behaviors/reference", "Reference"],
  ["/behaviors", "All Behaviors"],
  ["/behaviors/focus", "Focus and Keys"],
  ["/behaviors/selection", "Selection"],
  ["/behaviors/drag-and-drop", "Drag and Drop"],
  ["/behaviors/direct-manipulation", "Dragging and Resizing"],
  ["/behaviors/lists", "Lists"],
  ["/behaviors/trees", "Trees"],
  ["/behaviors/motion", "Transitions and Gestures"],
  ["/behaviors/popups", "Popups and Layers"],
  ["/behaviors/preferences", "Preferences"],
  ["/behaviors/canvas", "Canvas"],
  ["/behaviors/date", "Dates"],
  ["/behaviors/testing", "Testing"],
  ["/behaviors/observe", "Observe"],
  ["/react/custom-parts", "Custom Parts"],
  ["/react/hooks/async-options", "Async Options"],
  ["/react/hooks/shortcuts", "Shortcuts"],
  ["/agents", "Built for Agents"],
  ["/agents/connect-an-agent", "Connect an Agent"],
  ["/agents/guide", "Guide"],
  ["/agents/your-components", "Your Own Components"],
  ["/agents/permissions", "Permissions"],
  ["/agents/observe-changes", "Observe Changes"],
  ["/agents/history-and-undo", "History and Undo"],
  ["/agents/webmcp", "WebMCP"],
  ["/agents/reference", "Reference"],
  ...frameworks.map((framework) => [`/${framework}/rendering`, "Rendering Primitives"]),
  ...frameworks.map((framework) => [`/${framework}/how-it-works`, "How It Works"]),
  ...frameworks.map((framework) => [`/${framework}/build-with-an-agent`, "Build with an Agent"]),
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
  await expect(page.getByRole("heading", { name: "Write a Part by Hand" })).toBeVisible()
  await expect(page.getByText("usePrimitive", { exact: true }).first()).toBeVisible()
  await page.goto("/docs/web-components/rendering")
  await expect(page.getByRole("heading", { name: "Define the Elements" })).toBeVisible()
  await expect(page.getByText("createParts", { exact: true }).first()).toBeVisible()
})

test("Observe lives in Behaviors and old framework URLs redirect", async ({ page }) => {
  for (const framework of frameworks) {
    const folder = framework === "react" ? "hooks" : "utilities"
    await page.goto(`/docs/${framework}/${folder}/observe`)
    await expect(page).toHaveURL(/\/docs\/behaviors\/observe$/)
  }
  await page.goto("/docs/utilities/observe")
  await expect(page).toHaveURL(/\/docs\/behaviors\/observe$/)
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
  await expect(page).toHaveURL(/\/docs\/behaviors$/)
  await page.goto("/docs/vue/core/popups")
  await expect(page).toHaveURL(/\/docs\/behaviors\/popups$/)
  await page.goto("/docs/vue/utilities/building-blocks")
  await expect(page).toHaveURL(/\/docs\/behaviors$/)
  await page.goto("/docs/core/building-blocks")
  await expect(page).toHaveURL(/\/docs\/behaviors$/)
  await page.goto("/docs/svelte/agents")
  await expect(page).toHaveURL(/\/docs\/agents$/)
  await page.goto("/docs/agents/create-agent")
  await expect(page).toHaveURL(/\/docs\/agents\/connect-an-agent$/)
  await page.goto("/docs/agents/webmcp")
  await expect(page).toHaveURL(/\/docs\/agents\/webmcp$/)
  await page.goto("/docs/react/utilities/shortcuts")
  await expect(page).toHaveURL(/\/docs\/react\/hooks\/shortcuts$/)
})

test("pages that moved in the foundation docs redirect", async ({ page }) => {
  await page.goto("/docs/core/get-started")
  await expect(page).toHaveURL(/\/docs\/behaviors\/build-a-component$/)
  await page.goto("/docs/core/trees")
  await expect(page).toHaveURL(/\/docs\/behaviors\/trees$/)
  await page.goto("/docs/core/behaviors/date")
  await expect(page).toHaveURL(/\/docs\/behaviors\/date$/)
  await page.goto("/docs/core/primitives")
  await expect(page).toHaveURL(/\/docs\/behaviors\/define-a-primitive$/)
  await page.goto("/docs/core/behaviors/state-and-events")
  await expect(page).toHaveURL(/\/docs\/behaviors\/state-and-changes$/)
  await page.goto("/docs/core/kernel/state-and-events")
  await expect(page).toHaveURL(/\/docs\/behaviors\/state-and-changes$/)
  await page.goto("/docs/vue/primitives")
  await expect(page).toHaveURL(/\/docs\/vue\/rendering$/)
})

test("Core became Behaviors, and building with an agent moved to each framework", async ({ page }) => {
  await page.goto("/docs")
  await expect(page).toHaveURL(/\/docs\/react$/)
  await page.goto("/docs/core")
  await expect(page).toHaveURL(/\/docs\/behaviors$/)
  await page.goto("/docs/core/behaviors/focus")
  await expect(page).toHaveURL(/\/docs\/behaviors\/focus$/)
  await page.goto("/docs/core/kernel/define-a-primitive")
  await expect(page).toHaveURL(/\/docs\/behaviors\/define-a-primitive$/)
  await page.goto("/docs/core/testing")
  await expect(page).toHaveURL(/\/docs\/behaviors\/testing$/)
  await page.goto("/docs/agents/connect-an-agent/webmcp")
  await expect(page).toHaveURL(/\/docs\/agents\/webmcp$/)
  await page.goto("/docs/vue")
  await expect
    .poll(async () => (await page.context().cookies()).find((cookie) => cookie.name === "framework")?.value)
    .toBe("vue")
  await page.goto("/docs/agents/build-with-an-agent")
  await expect(page).toHaveURL(/\/docs\/vue\/build-with-an-agent$/)
  await page.goto("/docs/agents/skills")
  await expect(page).toHaveURL(/\/docs\/vue\/build-with-an-agent#add-the-skill$/)
})

test("links from Core go to the framework read last", async ({ page }) => {
  await page.goto("/docs/components/field")
  await expect(page).toHaveURL(/\/docs\/react\/components\/field$/)
  await page.goto("/docs/vue/components/menu")
  await expect
    .poll(async () => (await page.context().cookies()).find((cookie) => cookie.name === "framework")?.value)
    .toBe("vue")
  await page.goto("/docs/behaviors/popups")
  await page.getByRole("link", { name: "Popover", exact: true }).first().click()
  await expect(page).toHaveURL(/\/docs\/vue\/components\/popover$/)
  await page.goto("/docs/utilities/shortcuts")
  await expect(page).toHaveURL(/\/docs\/vue\/utilities\/shortcuts$/)
})

test("the picker keeps the page in another framework", async ({ page }) => {
  await page.goto("/docs/react/hooks/shortcuts")
  await page.getByRole("combobox", { name: "Framework", exact: true }).click()
  await page.getByRole("option", { name: "Vue", exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/vue\/utilities\/shortcuts$/)
})

test("Core's snippets follow the framework docs visited last", async ({ page }) => {
  await page.goto("/docs/svelte")
  await expect
    .poll(async () => (await page.context().cookies()).find((cookie) => cookie.name === "framework")?.value)
    .toBe("svelte")
  await page.goto("/docs/behaviors/build-a-component")
  await expect(page.getByRole("main")).toContainText("npm install @ui-sdk/svelte")

  await page.goto("/docs/solid")
  await expect
    .poll(async () => (await page.context().cookies()).find((cookie) => cookie.name === "framework")?.value)
    .toBe("solid")
  await page.goto("/docs/behaviors/build-a-component")
  await expect(page.getByRole("main")).toContainText("npm install @ui-sdk/solid")
})

test("the reference points to focused guides", async ({ page }) => {
  await page.goto("/docs/behaviors/reference")
  for (const [name, href] of [
    ["Define a Primitive", "/docs/behaviors/define-a-primitive"],
    ["State and Changes", "/docs/behaviors/state-and-changes"],
    ["Focus and Keys", "/docs/behaviors/focus#roving-focus"],
    ["Selection", "/docs/behaviors/selection"],
    ["Popups and Layers", "/docs/behaviors/popups"],
    ["Platform", "/docs/behaviors/platform"],
    ["Text", "/docs/behaviors/text"],
    ["Testing", "/docs/behaviors/testing"],
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
  expect(agents).toContain("# Connect an Agent")
  expect(agents).toContain("# Guide")
  expect(agents).toContain("# Permissions")
  expect(agents).toContain("# Observe Changes")
  expect(agents).toContain("# History and Undo")
  expect(agents).toContain("@ui-sdk/vue/agent")
  const old = await request.get("/docs/vue/core.md")
  expect(old.url()).toMatch(/\/docs\/core\.md$/)
})
