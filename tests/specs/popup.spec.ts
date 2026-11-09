import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// The popup layer's page-wide side effects, checked in a real browser against
// the core module itself. They don't depend on the framework, so they run once
// per browser.
test.beforeEach(async ({ framework, open }) => {
  test.skip(framework !== "react", "Framework independent.")
  await open("popover")
})

// Loads one of core's modules, the instance the page's own code uses.
function core(page: Page, name: string, run: string) {
  return page.evaluate(
    async ({ name, run }) => {
      const { loadCoreModule } = window as unknown as {
        loadCoreModule: (name: string) => Promise<unknown>
      }
      const module = await loadCoreModule(name)
      return new Function("module", `return (async () => { ${run} })()`)(module)
    },
    { name, run }
  )
}

test.describe("inert outside", () => {
  test("a popup inside a shadow root makes the page around its host inert, and restores it", async ({
    page,
  }) => {
    const result = await core(
      page,
      "modal",
      `
      const host = document.createElement("div")
      document.body.append(host)
      const root = host.attachShadow({ mode: "open" })
      root.innerHTML = "<div id='popup'></div><button id='inside'>Inside</button>"
      const outside = document.querySelector(".fixture button")
      const restore = module.inertOutside([root.getElementById("popup")])
      const during = [!!outside.closest("[inert]"), root.getElementById("inside").inert, host.inert]
      restore()
      const after = [!!outside.closest("[inert]"), root.getElementById("inside").inert]
      host.remove()
      return { during, after }
    `
    )
    expect(result).toEqual({
      during: [true, true, false],
      after: [false, false],
    })
  })

  test("an element kept later becomes usable, and inert again on release", async ({
    page,
  }) => {
    const result = await core(
      page,
      "modal",
      `
      const container = document.createElement("div")
      const child = document.createElement("div")
      container.append(child)
      document.body.append(container)
      const restore = module.inertOutside([document.querySelector(".fixture")])
      const before = container.inert
      const release = restore.keep(child)
      const kept = container.inert
      release()
      const released = container.inert
      restore()
      container.remove()
      return [before, kept, released, container.inert]
    `
    )
    expect(result).toEqual([true, false, true, false])
  })
})

test.describe("scroll lock", () => {
  test("releasing restores only what the lock set", async ({ page }) => {
    const result = await core(
      page,
      "modal",
      `
      const html = document.documentElement
      html.style.setProperty("--theme", "light")
      const release = module.lockScroll()
      const locked = getComputedStyle(html).overflowY
      // Another library styles the root while the lock is held.
      html.style.color = "red"
      release()
      return { locked, overflow: html.style.overflow, color: html.style.color, theme: html.style.getPropertyValue("--theme") }
    `
    )
    expect(result).toEqual({
      locked: "hidden",
      overflow: "",
      color: "red",
      theme: "light",
    })
  })

  test("a page that scrolls its body gets its body locked", async ({
    page,
  }) => {
    const result = await core(
      page,
      "modal",
      `
      const style = document.createElement("style")
      style.textContent = "html { overflow: hidden; height: 100% } body { overflow: auto; height: 100% }"
      document.head.append(style)
      const release = module.lockScroll()
      const locked = getComputedStyle(document.body).overflowY
      release()
      const after = getComputedStyle(document.body).overflowY
      style.remove()
      return [locked, after]
    `
    )
    expect(result).toEqual(["hidden", "auto"])
  })
})

test.describe("presence", () => {
  test("an exit waits for a transition on the ::backdrop", async ({ page }) => {
    const elapsed = await core(
      page,
      "presence",
      `
      const style = document.createElement("style")
      style.textContent = "#fading::backdrop { background: black; opacity: 0.5; transition: opacity 400ms } #fading[data-ending-style]::backdrop { opacity: 0 }"
      document.head.append(style)
      const el = document.createElement("div")
      el.id = "fading"
      el.popover = "manual"
      el.textContent = "Fading"
      document.body.append(el)
      el.showPopover()
      await new Promise((frame) => requestAnimationFrame(() => requestAnimationFrame(frame)))
      const start = performance.now()
      await new Promise((done) => module.animateOut(el, done))
      const elapsed = performance.now() - start
      el.remove()
      style.remove()
      return elapsed
    `
    )
    expect(elapsed).toBeGreaterThan(300)
  })
})
