import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Custom elements built the way frameworks and scripts build them: properties
// set before connecting or upgrading, children that arrive or change later,
// shadow roots, reconnecting, and native boolean attributes.
test.beforeEach(async ({ framework, open }) => {
  test.skip(framework !== "web", "Custom elements only.")
  await open("web-lifecycle")
})

type Toggle = HTMLElement & { pressed: boolean }

test("a state property set before connecting is where the element starts", async ({ page }) => {
  const result = await page.evaluate(() => {
    const toggle = document.createElement("ui-toggle") as Toggle
    toggle.append(Object.assign(document.createElement("button"), { textContent: "Bold" }))
    toggle.pressed = true
    document.querySelector("#stage")!.append(toggle)
    return { property: toggle.pressed }
  })
  expect(result).toEqual({ property: true })
  await expect(page.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true")
  await page.getByRole("button", { name: "Bold" }).click()
  await expect(page.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "false")
})

test("a state property set before upgrading is where the element starts", async ({ page }) => {
  const result = await page.evaluate(() => {
    // An element from a document without the definitions isn't upgraded yet.
    const toggle = document.implementation.createHTMLDocument().createElement("ui-toggle") as Toggle
    toggle.innerHTML = "<button>Italic</button>"
    toggle.pressed = true
    document.querySelector("#stage")!.append(document.adoptNode(toggle))
    return { own: Object.prototype.hasOwnProperty.call(toggle, "pressed"), property: toggle.pressed }
  })
  expect(result).toEqual({ own: false, property: true })
  await expect(page.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "true")
})

const tabs = `
  <ui-tabs default-value="a">
    <ui-tabs-list aria-label="Settings">
      <ui-tabs-tab value="a"><button>A</button></ui-tabs-tab>
    </ui-tabs-list>
    <ui-tabs-panel value="a">A panel</ui-tabs-panel>
    <ui-tabs-panel value="b">B panel</ui-tabs-panel>
  </ui-tabs>`

test("a part whose button arrives later binds it", async ({ page }) => {
  await page.evaluate((markup) => {
    document.querySelector("#stage")!.innerHTML = markup
    const tab = document.createElement("ui-tabs-tab")
    tab.setAttribute("value", "b")
    document.querySelector("ui-tabs-list")!.append(tab)
    tab.append(Object.assign(document.createElement("button"), { textContent: "B" }))
  }, tabs)
  await expect(page.getByRole("tab", { name: "B" })).toBeVisible()
  await page.getByRole("tab", { name: "B" }).click()
  await expect(page.getByRole("tabpanel")).toHaveText("B panel")
})

test("a part whose button is replaced binds the new one", async ({ page }) => {
  await page.evaluate((markup) => {
    document.querySelector("#stage")!.innerHTML = markup.replace(
      "</ui-tabs-list>",
      '<ui-tabs-tab value="b"><button>Old</button></ui-tabs-tab></ui-tabs-list>',
    )
  }, tabs)
  await expect(page.getByRole("tab", { name: "Old" })).toBeVisible()
  await page.evaluate(() => {
    const tab = document.querySelector('ui-tabs-tab[value="b"]')!
    tab.replaceChildren(Object.assign(document.createElement("button"), { textContent: "B" }))
  })
  await page.getByRole("tab", { name: "B" }).click()
  await expect(page.getByRole("tabpanel")).toHaveText("B panel")
})

test("a button moved out of its tab is a plain button again", async ({ page }) => {
  await page.evaluate((markup) => {
    document.querySelector("#stage")!.innerHTML = markup
      .replace("</ui-tabs-list>", '<ui-tabs-tab value="b"><button>B</button></ui-tabs-tab></ui-tabs-list>')
      .replace('<ui-tabs-panel value="b">', '<ui-tabs-panel value="b" keep-mounted>')
  }, tabs)
  const tab = page.getByRole("tab", { name: "B" })
  await expect(tab).toHaveAttribute("tabindex", "-1")
  await expect(tab).toHaveAttribute("aria-controls", /-panel-b$/)
  await tab.evaluate((el) => document.querySelector("#stage")!.append(el))
  const button = page.locator("#stage > button")
  await expect(button).toHaveText("B")
  await expect(button).not.toHaveAttribute("role")
  await expect(button).not.toHaveAttribute("tabindex")
  await expect(button).not.toHaveAttribute("aria-controls")
})

test("inside a shadow root, hidden parts stay hidden, `for` finds its owner and events reach the host", async ({
  page,
}) => {
  await page.evaluate((markup) => {
    const host = document.createElement("div")
    host.id = "host"
    document.querySelector("#stage")!.append(host)
    const shadow = host.attachShadow({ mode: "open" })
    shadow.innerHTML = `
      <style>ui-tabs-panel { display: block }</style>
      ${markup}
      <ui-popover id="local"><ui-popover-content>Popup</ui-popover-content></ui-popover>
      <ui-popover-trigger for="local"><button>Open</button></ui-popover-trigger>
      <ui-toggle><button>Mute</button></ui-toggle>`
    ;(window as unknown as { heard: string[] }).heard = []
    host.addEventListener("pressedchange", (event) =>
      (window as unknown as { heard: string[] }).heard.push(String((event as CustomEvent).detail.value)),
    )
  }, tabs)
  await expect(page.getByText("B panel")).toBeHidden()
  await page.getByRole("button", { name: "Open" }).click()
  await expect(page.getByRole("button", { name: "Open" })).toHaveAttribute("aria-expanded", "true")
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Mute" }).click()
  expect(await page.evaluate(() => (window as unknown as { heard: string[] }).heard)).toEqual(["true"])
})

for (const [change, target] of [
  ["names no popover", "missing"],
  ["is removed", null],
] as const) {
  test(`a trigger whose \`for\` ${change} lets go of its popover`, async ({ page }) => {
    await page.evaluate(() => {
      document.querySelector("#stage")!.innerHTML = `
        <ui-popover id="profile"><ui-popover-content>Popup</ui-popover-content></ui-popover>
        <ui-popover-trigger for="profile"><button>Open</button></ui-popover-trigger>`
    })
    const button = page.getByRole("button", { name: "Open" })
    await expect(button).toHaveAttribute("aria-expanded", "false")
    await page.evaluate((target) => {
      const trigger = document.querySelector("ui-popover-trigger")!
      if (target) trigger.setAttribute("for", target)
      else trigger.removeAttribute("for")
    }, target)
    await expect(button).not.toHaveAttribute("aria-expanded")
    await button.click()
    await expect(page.getByText("Popup")).toBeHidden()
  })
}

test("a popover in a shadow root stays open when focus moves into it from outside", async ({ page }) => {
  await page.evaluate(() => {
    const host = document.querySelector("#stage")!.appendChild(document.createElement("div"))
    host.attachShadow({ mode: "open" }).innerHTML = `
      <ui-popover>
        <ui-popover-trigger><button>Open</button></ui-popover-trigger>
        <ui-popover-content>Popup</ui-popover-content>
      </ui-popover>`
  })
  // A click event alone leaves focus on the body, as a click in Safari does.
  await page.getByRole("button", { name: "Open" }).dispatchEvent("click")
  await expect(page.getByRole("dialog")).toBeFocused()
  await expect(page.getByRole("button", { name: "Open" })).toHaveAttribute("aria-expanded", "true")
})

// Like Lit, which replaces a root's sheets when its styles change, or a page
// that changes them in place.
for (const change of ["replaces its shadow root's sheets", "changes its shadow root's sheets in place"]) {
  test(`a closed popup is hidden again at its next change after the page ${change}`, async ({ page }) => {
    await page.evaluate(() => {
      const host = document.querySelector("#stage")!.appendChild(document.createElement("div"))
      host.attachShadow({ mode: "open" }).innerHTML = `
        <ui-popover>
          <ui-popover-trigger><button>Open</button></ui-popover-trigger>
          <ui-popover-content class="popup">Popup</ui-popover-content>
        </ui-popover>`
    })
    await expect(page.getByText("Popup")).toBeHidden()
    const readBack = await page.evaluate((change) => {
      const root = document.querySelector("#stage > div")!.shadowRoot!
      const styles = new CSSStyleSheet()
      styles.replaceSync(".popup { display: block }")
      if (change.startsWith("replaces")) root.adoptedStyleSheets = [styles]
      else root.adoptedStyleSheets.splice(0, root.adoptedStyleSheets.length, styles)
      return root.adoptedStyleSheets.length === 1 && root.adoptedStyleSheets[0] === styles
    }, change)
    // What the page sets is what it reads back.
    expect(readBack).toBe(true)
    await page.getByRole("button", { name: "Open" }).click()
    await expect(page.getByText("Popup")).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(page.getByText("Popup")).toBeHidden()
  })
}

test("an element moved into a shadow root or an iframe in one task keeps its default display", async ({
  page,
}) => {
  const display = await page.evaluate(() => {
    const stage = document.querySelector("#stage")!
    const toggle = document.createElement("ui-toggle")
    toggle.innerHTML = "<button>Bold</button>"
    stage.append(toggle)
    const host = stage.appendChild(document.createElement("div"))
    host.attachShadow({ mode: "open" }).append(toggle)
    const inShadowRoot = getComputedStyle(toggle).display
    const frame = stage.appendChild(document.createElement("iframe"))
    frame.contentDocument!.body.append(toggle)
    return { inShadowRoot, inFrame: frame.contentWindow!.getComputedStyle(toggle).display }
  })
  expect(display).toEqual({ inShadowRoot: "contents", inFrame: "contents" })
})

test("an element moved into a shadow root in an iframe keeps its default display", async ({ page }) => {
  const display = await page.evaluate(async () => {
    const frame = document.querySelector("#stage")!.appendChild(document.createElement("iframe"))
    const doc = frame.contentDocument!
    const root = doc.body.appendChild(doc.createElement("div")).attachShadow({ mode: "open" })
    const toggle = document.createElement("ui-toggle")
    toggle.innerHTML = "<button>Bold</button>"
    root.append(toggle)
    return frame.contentWindow!.getComputedStyle(toggle).display
  })
  expect(display).toBe("contents")
})

test("a popover moved into an iframe closes on Escape there", async ({ page }) => {
  await page.evaluate(() => {
    const frame = document.querySelector("#stage")!.appendChild(document.createElement("iframe"))
    // Built in this document, where the elements are defined.
    const holder = document.createElement("div")
    holder.innerHTML = `
      <ui-popover>
        <ui-popover-trigger><button>Open</button></ui-popover-trigger>
        <ui-popover-content>Popup</ui-popover-content>
      </ui-popover>`
    frame.contentDocument!.body.append(holder)
  })
  const frame = page.frameLocator("#stage iframe")
  await frame.getByRole("button", { name: "Open" }).click()
  await expect(frame.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(frame.getByRole("dialog")).toBeHidden()
})

test("Escape closes the topmost layer of the document it was pressed in", async ({ page }) => {
  await page.evaluate(() => {
    // Pinned top left: unstyled popover content sits at its static position,
    // which WebKit and Firefox resolve over the iframe's button.
    const dialog = (name: string) => `
      <ui-dialog modal="false">
        <ui-dialog-trigger><button>Open ${name}</button></ui-dialog-trigger>
        <ui-dialog-content style="position: fixed; top: 0; left: 0">
          <ui-dialog-title>${name}</ui-dialog-title>
          <button>In ${name}</button>
        </ui-dialog-content>
      </ui-dialog>`
    const stage = document.querySelector("#stage")!
    stage.innerHTML = dialog("Page")
    const frame = stage.appendChild(document.createElement("iframe"))
    // Built in this document, where the elements are defined.
    const holder = document.createElement("div")
    holder.innerHTML = dialog("Frame")
    frame.contentDocument!.body.append(holder)
  })
  const frame = page.frameLocator("#stage iframe")
  await page.getByRole("button", { name: "Open Page" }).click()
  await expect(page.getByRole("dialog", { name: "Page" })).toBeVisible()
  await frame.getByRole("button", { name: "Open Frame" }).click()
  await expect(frame.getByRole("dialog", { name: "Frame" })).toBeVisible()
  await page.getByRole("button", { name: "In Page" }).focus()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog", { name: "Page" })).toBeHidden()
  await expect(frame.getByRole("dialog", { name: "Frame" })).toBeVisible()
})

test("reconnecting keeps a checkbox's reset default", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const form = document.createElement("form")
    form.innerHTML = `<ui-checkbox name="custom"></ui-checkbox><input type="checkbox" name="native">`
    document.querySelector("#stage")!.append(form)
    await new Promise((done) => setTimeout(done))
    const custom = form.querySelector("ui-checkbox") as HTMLElement & { checked: boolean }
    const native = form.querySelector("input")!
    custom.checked = true
    native.checked = true
    form.remove()
    await Promise.resolve()
    document.querySelector("#stage")!.append(form)
    await new Promise((done) => setTimeout(done))
    const connected = { custom: custom.checked, native: native.checked }
    form.reset()
    await new Promise((done) => setTimeout(done))
    return { connected, reset: { custom: custom.checked, native: native.checked } }
  })
  expect(result).toEqual({
    connected: { custom: true, native: true },
    reset: { custom: false, native: false },
  })
})

test("a checkbox and a radio group put back on the page fire no input or change events", async ({ page }) => {
  await page.evaluate(() => {
    document.querySelector("#stage")!.innerHTML = `
      <form>
        <label><ui-checkbox name="terms"></ui-checkbox> Terms</label>
        <ui-radio-group name="plan" aria-label="Plan">
          <label><ui-radio value="free"></ui-radio> Free</label>
          <label><ui-radio value="pro"></ui-radio> Pro</label>
        </ui-radio-group>
        <label><input type="checkbox" name="native" /> Native</label>
      </form>`
  })
  await page.getByRole("checkbox", { name: "Terms" }).click()
  await page.getByRole("radio", { name: "Pro" }).click()
  await page.getByRole("checkbox", { name: "Native" }).click()
  const heard = await page.evaluate(async () => {
    const tick = () => new Promise((done) => setTimeout(done))
    const stage = document.querySelector("#stage")!
    const form = stage.querySelector("form")!
    const heard: string[] = []
    for (const type of ["input", "change"])
      form.addEventListener(type, (event) => heard.push(`${type} ${(event.target as Element).localName}`))
    await tick()
    form.remove()
    await tick()
    stage.append(form)
    await tick()
    return heard
  })
  expect(heard).toEqual([])
  await expect(page.getByRole("checkbox", { name: "Terms" })).toBeChecked()
  await expect(page.getByRole("radio", { name: "Pro" })).toBeChecked()
})

test("state set from script fires no input or change events, like a native control's, and the api still does", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const tick = () => new Promise((done) => setTimeout(done))
    const form = document.createElement("form")
    form.innerHTML = `
      <ui-checkbox name="terms" aria-label="Terms"></ui-checkbox>
      <ui-select name="fruit" aria-label="Fruit">
        <ui-select-trigger><button></button></ui-select-trigger>
        <ui-select-content>
          <ui-select-item value="apple">Apple</ui-select-item>
          <ui-select-item value="banana">Banana</ui-select-item>
        </ui-select-content>
      </ui-select>
      <ui-input><input name="note" aria-label="Note" /></ui-input>
      <input type="checkbox" name="native" />`
    document.querySelector("#stage")!.append(form)
    await tick()
    const checkbox = form.querySelector("ui-checkbox") as HTMLElement & {
      checked: boolean
      api: { toggle: () => void }
    }
    const select = form.querySelector("ui-select") as HTMLElement & { value: string }
    const note = form.querySelector("ui-input") as HTMLElement & { value: string }
    const heard: string[] = []
    for (const type of ["input", "change"])
      form.addEventListener(type, (event) => heard.push(`${type} ${(event.target as Element).localName}`))
    checkbox.checked = true
    select.value = "banana"
    select.setAttribute("value", "apple")
    note.value = "Leave at the door"
    form.querySelector<HTMLInputElement>("input[type=checkbox]")!.checked = true
    await tick()
    const quiet = [...heard]
    const data = [...new FormData(form)]
    checkbox.api.toggle()
    await tick()
    return { quiet, data, api: heard.slice(quiet.length) }
  })
  expect(result).toEqual({
    quiet: [],
    data: [
      ["terms", "on"],
      ["fruit", "apple"],
      ["note", "Leave at the door"],
      ["native", "on"],
    ],
    api: ["input ui-checkbox", "change ui-checkbox"],
  })
})

// Writes `markup` into the stage, when given, then sets properties on the
// element there. Names in `files` become a `value` of files.
async function set(page: Page, properties: Record<string, unknown>, markup?: string) {
  await page.evaluate(
    ({ properties: { files, ...properties }, markup }) => {
      const stage = document.querySelector("#stage")!
      if (markup) stage.innerHTML = markup
      const el = stage.firstElementChild!
      Object.assign(el, properties)
      if (files) Object.assign(el, { value: (files as string[]).map((name) => new File([name], name)) })
    },
    { properties, markup },
  )
}

// Takes the element on the stage out until it lets go of its instance, then puts it back.
async function reconnect(page: Page) {
  await page.evaluate(async () => {
    const stage = document.querySelector("#stage")!
    const el = stage.firstElementChild!
    el.remove()
    await new Promise((done) => setTimeout(done))
    stage.append(el)
  })
}

const fruits = ["Apple", "Banana"]

// Elements that render content from their state: what `start` sets once,
// then a change before they leave the page and one after they're back, and
// what each change shows.
const rendering = [
  {
    name: "combobox",
    markup: `<ui-combobox><ui-combobox-input><input aria-label="Fruit" /></ui-combobox-input></ui-combobox>`,
    shown: "ui-combobox-item",
    start: { items: fruits },
    changes: [{ query: "App" }, { query: "Ban" }],
    shows: [["Apple"], ["Banana"]],
  },
  {
    name: "autocomplete",
    markup: `<ui-autocomplete><ui-autocomplete-input><input aria-label="Fruit" /></ui-autocomplete-input></ui-autocomplete>`,
    shown: "ui-autocomplete-item",
    start: { items: fruits },
    changes: [{ value: "App" }, { value: "Ban" }],
    shows: [["Apple"], ["Banana"]],
  },
  {
    name: "command",
    markup: `<ui-command><ui-command-input><input aria-label="Search" /></ui-command-input></ui-command>`,
    shown: "ui-command-item",
    start: { items: fruits },
    changes: [{ query: "App" }, { query: "Ban" }],
    shows: [["Apple"], ["Banana"]],
  },
  {
    name: "select",
    markup: `<ui-select aria-label="Fruit"><ui-select-trigger><button></button></ui-select-trigger><ui-select-content><ui-select-input><input aria-label="Search" /></ui-select-input><ui-select-list></ui-select-list></ui-select-content></ui-select>`,
    shown: "ui-select-item",
    start: { items: fruits },
    changes: [
      { open: true, query: "App" },
      { open: true, query: "Ban" },
    ],
    shows: [["Apple"], ["Banana"]],
  },
  {
    name: "otp input",
    markup: `<ui-otp-input max-length="3" aria-label="Code">${"<ui-otp-input-slot></ui-otp-input-slot>".repeat(3)}</ui-otp-input>`,
    shown: "ui-otp-input-slot",
    start: {},
    changes: [{ value: "123" }, { value: "456" }],
    shows: [
      ["1", "2", "3"],
      ["4", "5", "6"],
    ],
  },
  {
    name: "file input",
    markup: `<ui-file-input><ui-file-input-list></ui-file-input-list></ui-file-input>`,
    shown: '[data-file="name"]',
    start: {},
    changes: [{ files: ["first.txt"] }, { files: ["second.txt"] }],
    shows: [["first.txt"], ["second.txt"]],
  },
  {
    name: "token input",
    markup: `<ui-token-input><ui-token-input-editor aria-label="Prompt"></ui-token-input-editor><template><span class="token" data-token-label></span></template></ui-token-input>`,
    shown: ".token",
    start: {},
    changes: [{ value: "[@a.ts](file:a.ts)" }, { value: "[@b.ts](file:b.ts)" }],
    shows: [["a.ts"], ["b.ts"]],
  },
]

for (const { name, markup, shown, start, changes, shows } of rendering)
  test(`a ${name} put back on the page renders from its state again`, async ({ page }) => {
    const warnings: string[] = []
    page.on("console", (message) => message.type() === "warning" && warnings.push(message.text()))
    const content = page.locator(`#stage ${shown}`)
    await set(page, start, markup)
    await set(page, changes[0])
    await expect(content).toHaveText(shows[0])
    await reconnect(page)
    await set(page, changes[1])
    await expect(content).toHaveText(shows[1])
    // Its parts find it again, so none warns that it's missing.
    expect(warnings.filter((text) => text.includes("must be inside"))).toEqual([])
  })

test("a checked property set while detached isn't a checkbox's reset default", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const tick = () => new Promise((done) => setTimeout(done))
    const stage = document.querySelector("#stage")!
    const form = document.createElement("form")
    const custom = Object.assign(document.createElement("ui-checkbox"), { checked: true })
    const native = Object.assign(document.createElement("input"), { type: "checkbox", checked: true })
    const checked = () => [custom.checked, native.checked]
    form.append(custom, native)
    stage.append(form)
    await tick()
    const connected = checked()
    form.reset()
    await tick()
    const reset = checked()
    form.remove()
    await tick()
    custom.checked = true
    native.checked = true
    stage.append(form)
    await tick()
    const reconnected = checked()
    form.reset()
    await tick()
    return { connected, reset, reconnected, resetAgain: checked() }
  })
  expect(result).toEqual({
    connected: [true, true],
    reset: [false, false],
    reconnected: [true, true],
    resetAgain: [false, false],
  })
})

test("a custom validity message stays through connecting and resets, like a native one", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const tick = () => new Promise((done) => setTimeout(done))
    const stage = document.querySelector("#stage")!
    const form = document.createElement("form")
    const custom = document.createElement("ui-checkbox") as HTMLElement & {
      validationMessage: string
      setCustomValidity: (message: string) => void
    }
    const native = Object.assign(document.createElement("input"), { type: "checkbox" })
    const messages = () => [custom.validationMessage, native.validationMessage]
    custom.setCustomValidity("No")
    native.setCustomValidity("No")
    form.append(custom, native)
    stage.append(form)
    await tick()
    const connected = messages()
    form.reset()
    await tick()
    const reset = messages()
    form.remove()
    await tick()
    stage.append(form)
    await tick()
    return { connected, reset, reconnected: messages() }
  })
  expect(result).toEqual({ connected: ["No", "No"], reset: ["No", "No"], reconnected: ["No", "No"] })
})

test('disabled="false" disables and required="false" requires, like on native controls', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const form = document.createElement("form")
    form.innerHTML = `
      <ui-checkbox name="custom" value="yes" default-checked disabled="false"></ui-checkbox>
      <ui-checkbox name="terms" required="false"></ui-checkbox>`
    document.querySelector("#stage")!.append(form)
    await new Promise((done) => setTimeout(done))
    const checkbox = form.querySelector("ui-checkbox")!
    return {
      ariaDisabled: checkbox.getAttribute("aria-disabled"),
      matches: checkbox.matches(":disabled"),
      value: new FormData(form).get("custom"),
      valid: form.checkValidity(),
    }
  })
  expect(result).toEqual({ ariaDisabled: "true", matches: true, value: null, valid: false })
})

test("a checkbox group disabled at the start and enabled later enables its checkboxes", async ({ page }) => {
  const result = await page.evaluate(async () => {
    const form = document.createElement("form")
    form.innerHTML = `
      <ui-checkbox-group name="toppings" aria-label="Toppings" disabled>
        <ui-checkbox value="cheese" aria-label="Cheese" disabled="disabled"></ui-checkbox>
        <ui-checkbox value="olives" aria-label="Olives"></ui-checkbox>
      </ui-checkbox-group>`
    document.querySelector("#stage")!.append(form)
    const tick = () => new Promise((done) => setTimeout(done))
    const boxes = [...form.querySelectorAll("ui-checkbox")]
    const disabled = () => boxes.map((box) => [box.getAttribute("aria-disabled"), box.matches(":disabled")])
    await tick()
    const start = disabled()
    form.querySelector("ui-checkbox-group")!.removeAttribute("disabled")
    await tick()
    const enabled = disabled()
    boxes[0].removeAttribute("disabled")
    await tick()
    return { start, enabled, author: disabled() }
  })
  expect(result).toEqual({
    start: [
      ["true", true],
      ["true", true],
    ],
    enabled: [
      ["true", true],
      [null, false],
    ],
    author: [
      [null, false],
      [null, false],
    ],
  })
  await page.getByRole("checkbox", { name: "Olives" }).click()
  await expect(page.getByRole("checkbox", { name: "Olives" })).toBeChecked()
})
