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

test("form controls get their values back after going back, with no events, like native ones", async ({
  page,
}) => {
  await page.goto("/form.html")
  await page.getByRole("textbox", { name: "Note" }).fill("Leave at the door")
  await page.getByRole("checkbox", { name: "Gift wrap" }).click()
  await page.getByRole("radio", { name: "Express" }).click()
  await page.getByRole("checkbox", { name: "Olives" }).click()
  await page.getByRole("combobox", { name: "Size" }).click()
  await page.getByRole("option", { name: "Large" }).click()
  await page.addInitScript(() => {
    const heard: string[] = []
    Object.assign(window, { heard })
    for (const type of ["input", "change", "checkedchange", "valuechange"])
      document.addEventListener(
        type,
        (event) => heard.push(`${type} ${(event.target as Element).localName}`),
        true,
      )
  })
  await page.goto("/tabs.html")
  await page.goBack()
  await expect(page.getByRole("textbox", { name: "Note" })).toHaveValue("Leave at the door")
  await expect(page.getByRole("checkbox", { name: "Gift wrap" })).toBeChecked()
  await expect(page.getByRole("radio", { name: "Express" })).toBeChecked()
  await expect(page.getByRole("checkbox", { name: "Olives" })).toBeChecked()
  await expect(page.getByRole("combobox", { name: "Size" })).toHaveText("Large")
  expect(
    await page.evaluate(() => Object.fromEntries(new FormData(document.querySelector("form")!))),
  ).toEqual({ note: "Leave at the door", gift: "on", shipping: "express", toppings: "olives", size: "large" })
  const heard = await page.evaluate(
    () => new Promise((done) => setTimeout(() => done((window as unknown as { heard: string[] }).heard))),
  )
  expect(heard).toEqual([])
})

// Runs `write` on the page as soon as `customElements.define` returns for `tag`,
// before a restore the browser hands over can land.
async function afterDefine(page: Page, tag: string, write: string) {
  await page.addInitScript(
    ({ tag, write }) => {
      const define = customElements.define.bind(customElements)
      customElements.define = (name, constructor, options) => {
        define(name, constructor, options)
        if (name === tag) new Function(write)()
      }
    },
    { tag, write },
  )
}

for (const [what, write] of [
  ["a script write", `document.querySelector("ui-checkbox[name=gift]").checked = false`],
  ["a form reset", `document.querySelector("form").reset()`],
])
  test(`${what} right after the elements are defined wins over the value going back restores`, async ({
    page,
  }) => {
    await page.goto("/form.html")
    await page.getByRole("checkbox", { name: "Gift wrap" }).click()
    await afterDefine(page, "ui-checkbox", write)
    await page.goto("/tabs.html")
    await page.goBack()
    await expect(page.getByRole("radio", { name: "Express" })).toBeVisible()
    await expect(page.getByRole("checkbox", { name: "Gift wrap" })).not.toBeChecked()
  })

test("a disabled control gets its value back after going back, like a native one", async ({ page }) => {
  await page.goto("/form.html")
  const insured = page.locator("ui-checkbox[name=insured]")
  await insured.evaluate((el) => el.removeAttribute("disabled"))
  await page.getByRole("checkbox", { name: "Insured" }).click()
  await insured.evaluate((el) => el.setAttribute("disabled", ""))
  await page.goto("/tabs.html")
  await page.goBack()
  await expect(page.getByRole("checkbox", { name: "Insured" })).toBeChecked()
  await expect(page.getByRole("checkbox", { name: "Insured" })).toBeDisabled()
})

test("closed popups stay hidden before the scripts run", async ({ page }) => {
  await page.route(/\.js$/, (route) => route.abort())
  await page.goto("/settings.html")
  await expect(page.getByText("Dimensions")).toBeHidden()
  await expect(page.locator("ui-dialog-content")).toBeHidden()
  await expect(page.getByRole("button", { name: "Open popover" })).toBeVisible()
})
