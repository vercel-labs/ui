import { expect, test, type Page } from "@playwright/test"

// The entries a page fetched, like `tabs`, from the files server.
function fetchedEntries(page: Page) {
  const entries: string[] = []
  page.on("request", (request) => {
    const entry = new URL(request.url()).pathname.match(/^\/web\/([\w-]+)\.js$/)?.[1]
    if (entry) entries.push(entry)
  })
  return entries
}

test("web.js defines only the components on the page", async ({ page }) => {
  const entries = fetchedEntries(page)
  await page.goto("/settings.html")
  await expect(page.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true")
  await expect(page.getByRole("button", { name: "Edit profile" })).toHaveAttribute("aria-haspopup", "dialog")
  await expect(page.getByRole("button", { name: "Open popover" })).toHaveAttribute("aria-expanded", "false")
  expect(entries.sort()).toEqual(["dialog", "popover", "tabs"])
})

test("components loaded by web.js work with the keyboard", async ({ page }) => {
  await page.goto("/settings.html")
  const account = page.getByRole("tab", { name: "Account" })
  await account.focus()
  await page.keyboard.press("ArrowRight")
  await expect(page.getByRole("tab", { name: "Password" })).toBeFocused()
  await expect(page.getByRole("tab", { name: "Password" })).toHaveAttribute("data-selected")
  await expect(page.getByRole("tabpanel")).toHaveText("Password settings")

  const trigger = page.getByRole("button", { name: "Edit profile" })
  await trigger.click()
  await expect(page.getByRole("dialog", { name: "Edit profile" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("web.js defines components added after the page loads", async ({ page }) => {
  const entries = fetchedEntries(page)
  await page.goto("/settings.html")
  await expect(page.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true")
  await page.evaluate(() =>
    document.body.insertAdjacentHTML("beforeend", "<ui-toggle><button>Bold</button></ui-toggle>"),
  )
  const bold = page.getByRole("button", { name: "Bold" })
  await expect(bold).toHaveAttribute("aria-pressed", "false")
  await bold.click()
  await expect(bold).toHaveAttribute("aria-pressed", "true")
  expect(entries).toContain("toggle")
})

test("web.js defines components inside shadow roots", async ({ page }) => {
  await page.goto("/shadow.html")
  await expect(page.getByRole("switch", { name: "Notifications" })).toHaveAttribute("aria-checked", "false")
  await page.evaluate(() => {
    const host = document.createElement("toolbar-card")
    const shadowRoot = host.attachShadow({ mode: "open" })
    document.body.append(host)
    setTimeout(() => (shadowRoot.innerHTML = "<ui-toggle><button>Bold</button></ui-toggle>"))
  })
  await expect(page.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "false")
})

test("a component's own file defines it without web.js", async ({ page }) => {
  const entries = fetchedEntries(page)
  await page.goto("/tabs.html")
  await expect(page.getByRole("tab", { name: "Account" })).toHaveAttribute("aria-selected", "true")
  expect(entries).toEqual(["tabs"])
})

test("closed popups stay hidden before the scripts run", async ({ page }) => {
  await page.route(/\.js$/, (route) => route.abort())
  await page.goto("/settings.html")
  await expect(page.getByText("Dimensions")).toBeHidden()
  await expect(page.locator("ui-dialog-content")).toBeHidden()
  await expect(page.getByRole("button", { name: "Open popover" })).toBeVisible()
})
