// @vitest-environment jsdom
// createPopup, its part builders and popupState: a link preview on
// `hoverCardPreset`, a popover on `popoverPreset`, tooltips on
// `tooltipPreset`, and our Popover, Hover Card and Tooltip on them, driven
// the way a person would, with the testing kit.
import { afterEach, describe, expect, test, vi } from "vitest"
import { linkPreview, type LinkPreviewOptions } from "../../../examples/experiments/link-preview"
import type { ChangeDetails } from "../src/foundation/kernel/details"
import { bind } from "../src/foundation/kernel/part"
import { definePrimitive } from "../src/foundation/kernel/primitive"
import { createPopup, popupState } from "../src/foundation/popups/create-popup"
import { tooltipPreset } from "../src/foundation/popups/popup-hover-presets"
import { popoverPreset } from "../src/foundation/popups/popup-presets"
import { popupSlots } from "../src/foundation/popups/popup-slots"
import { hoverCard } from "../src/components/hover-card/hover-card"
import { popover } from "../src/components/popover/popover"
import { tooltip } from "../src/components/tooltip/tooltip"
import type { Modal } from "../src/foundation/popups/popup"
import { checkPattern, checkServer, mount } from "../src/testing"

const mounts: { unmount: () => void }[] = []
afterEach(() => {
  mounts.splice(0).forEach((mounted) => mounted.unmount())
  document.body.replaceChildren()
})

const frame = () => new Promise((done) => requestAnimationFrame(() => setTimeout(done)))

const page = (title: string) =>
  JSON.stringify({ title, description: `About ${title}.`, image: `/${title}.png` })

const previewMarkup = `<div>
  <button>Before</button>
  <p>
    Read about <trigger id="popups" as="a" href="/docs/popups" payload='${page("Popups")}'>popups</trigger>
    and <trigger id="focus" as="a" href="/docs/focus" payload='${page("Focus")}'>focus</trigger>.
  </p>
  <content><image></image><title>Preview</title><a href="/docs">Open</a></content>
  <button>After</button>
</div>`

function preview(options: LinkPreviewOptions = {}) {
  const reasons: string[] = []
  const view = mount(
    linkPreview,
    { delay: 50, ...options, onOpenChange: (_open, details) => reasons.push(details.reason) },
    previewMarkup,
  )
  mounts.push(view)
  const button = (name: string) =>
    [...view.root.querySelectorAll("button")].find((el) => el.textContent === name)!
  // `state` is a getter, so the view gets the extras rather than being copied.
  return Object.assign(view, { reasons, button })
}

describe("a link preview on the hoverCard preset", () => {
  test("opens once the pointer has rested on a link for its delay", async () => {
    // Well past the two frames `hover` waits, even on a busy machine.
    const view = preview({ delay: 500 })
    await view.hover(view.part("trigger", "popups")!)
    expect(view.state.open).toBe(false)
    await vi.waitFor(() => expect(view.state.open).toBe(true), { timeout: 2000 })
    expect(view.part("content")!.isConnected).toBe(true)
    expect(view.part("trigger", "popups")!.hasAttribute("data-open")).toBe(true)
    expect(view.reasons).toEqual(["trigger-hover"])
  })

  test("opens when keyboard focus reaches a link, without taking focus", async () => {
    const view = preview()
    await view.keys("Tab", "Tab")
    expect(document.activeElement).toBe(view.part("trigger", "popups"))
    await vi.waitFor(() => expect(view.state.open).toBe(true))
    expect(document.activeElement).toBe(view.part("trigger", "popups"))
    expect(view.reasons).toEqual(["trigger-focus"])
  })

  test("Escape closes it and focus stays where it was", async () => {
    const view = preview()
    await view.keys("Tab", "Tab")
    await vi.waitFor(() => expect(view.state.open).toBe(true))
    await view.keys("Escape")
    expect(view.state.open).toBe(false)
    expect(document.activeElement).toBe(view.part("trigger", "popups"))
    expect(view.reasons).toEqual(["trigger-focus", "escape-key"])
  })

  test("Escape on one the pointer opened leaves focus on what had it", async () => {
    const view = preview()
    view.button("Before").focus()
    await view.hover(view.part("trigger", "popups")!)
    await vi.waitFor(() => expect(view.state.open).toBe(true))
    await view.keys("Escape")
    expect(view.state.open).toBe(false)
    expect(document.activeElement).toBe(view.button("Before"))
  })

  test("a press outside closes it", async () => {
    const view = preview()
    await view.hover(view.part("trigger", "popups")!)
    await vi.waitFor(() => expect(view.state.open).toBe(true))
    await view.click(view.button("After"))
    expect(view.state.open).toBe(false)
    expect(view.reasons).toEqual(["trigger-hover", "outside-press"])
  })

  test("Tab from the link moves into the preview, and leaving it closes it", async () => {
    const view = preview()
    await view.keys("Tab", "Tab")
    await vi.waitFor(() => expect(view.state.open).toBe(true))
    await view.keys("Tab")
    expect(view.part("content")!.contains(document.activeElement)).toBe(true)
    view.button("After").focus()
    await view.settle()
    expect(view.state.open).toBe(false)
    expect(view.reasons).toEqual(["trigger-focus", "focus-out"])
  })

  test("each link hands the preview its page, and another link takes the open preview over", async () => {
    const payloads: { title: string; reason: string }[] = []
    const view = preview({
      onPayloadChange: (page, details) =>
        payloads.push({ title: (page as { title: string }).title, reason: details.reason }),
    })
    await view.hover(view.part("trigger", "popups")!)
    await vi.waitFor(() => expect(view.state.open).toBe(true))
    expect(view.part("image")!.getAttribute("src")).toBe("/Popups.png")
    await view.hover(view.part("trigger", "focus")!)
    expect(view.state.open).toBe(true)
    expect(view.state.trigger).toBe("focus")
    expect(view.part("image")!.getAttribute("src")).toBe("/Focus.png")
    expect(view.part("trigger", "focus")!.hasAttribute("data-open")).toBe(true)
    expect(view.part("trigger", "popups")!.hasAttribute("data-open")).toBe(false)
    expect(payloads).toEqual([
      { title: "Popups", reason: "trigger-hover" },
      { title: "Focus", reason: "trigger-hover" },
    ])
    // Taking over opens nothing new.
    expect(view.reasons).toEqual(["trigger-hover"])
  })

  test("renders on the server from state alone", () => {
    const closed = checkServer(linkPreview, {}, previewMarkup)
    expect(closed).not.toContain('data-slot="link-preview-content"')
    const open = checkServer(linkPreview, { defaultOpen: true }, previewMarkup)
    expect(open).toContain('data-slot="link-preview-content"')
    expect(open).not.toContain('role="dialog"')
  })
})

type ShareOptions = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, details: ChangeDetails<string>) => void
  modal?: Extract<Modal, boolean | "trap-focus">
  openOnHover?: boolean
}

// A popover as an agent would write it: three names and a controller.
const share = definePrimitive({
  name: "share",
  options: {
    open: "boolean",
    defaultOpen: "boolean",
    onOpenChange: "callback",
    modal: "value",
    openOnHover: "boolean",
  },
  state: (options: ShareOptions) => popupState(options),
  sync: (options) => (options.open === undefined ? {} : { open: options.open }),
  api: (context) => createPopup(context, { preset: popoverPreset }),
  slots: (slot) => popupSlots(slot),
})

const shareMarkup = `<div>
  <trigger>Share</trigger>
  <content><title>Share</title><button>Copy link</button><close>Close</close></content>
  <button>After</button>
</div>`

function sharing(options: ShareOptions = {}) {
  const reasons: string[] = []
  const view = mount(
    share,
    { ...options, onOpenChange: (_open, details) => reasons.push(details.reason) },
    shareMarkup,
  )
  mounts.push(view)
  return Object.assign(view, { reasons })
}

describe("a popover on the popover preset", () => {
  test("a modal one passes the dialog pattern", async () => {
    const view = sharing({ modal: true })
    await view.click(view.part("trigger")!)
    expect(view.part("content")!.getAttribute("aria-modal")).toBe("true")
    await checkPattern(view.root, "dialog")
  })

  test("a non-modal one passes the dialog pattern without aria-modal", async () => {
    const view = sharing()
    await view.click(view.part("trigger")!)
    expect(view.part("content")!.hasAttribute("aria-modal")).toBe(false)
    await checkPattern(view.root, "dialog")
  })

  test("onOpenChange hears why it opened and closed each time", async () => {
    const view = sharing()
    const trigger = view.part("trigger")!
    await view.click(trigger)
    await view.click(trigger)
    await view.click(trigger)
    await view.click(view.part("close")!)
    await view.click(trigger)
    await view.keys("Escape")
    await view.click(trigger)
    await view.click(view.root.lastElementChild!)
    view.api.setOpen(true)
    view.api.close()
    expect(view.reasons).toEqual([
      "trigger-press",
      "trigger-press",
      "trigger-press",
      "close-press",
      "trigger-press",
      "escape-key",
      "trigger-press",
      "outside-press",
      "imperative",
      "imperative",
    ])
  })

  test("onOpenChange hears the details its rules add", async () => {
    type TaggedOptions = {
      defaultOpen?: boolean
      onOpenChange?: (open: boolean, details: ChangeDetails<string> & { tag: string }) => void
    }
    const tagged = definePrimitive({
      name: "tagged",
      options: { defaultOpen: "boolean", onOpenChange: "callback" },
      state: (options: TaggedOptions) => popupState(options),
      api: (context) =>
        createPopup(context, { preset: popoverPreset, rules: () => ({ details: () => ({ tag: "share" }) }) }),
      slots: (slot) => popupSlots(slot),
    })
    const tags: string[] = []
    const view = mount(tagged, { onOpenChange: (_open, details) => tags.push(details.tag) }, shareMarkup)
    mounts.push(view)
    await view.click(view.part("trigger")!)
    await view.keys("Escape")
    expect(tags).toEqual(["share", "share"])
  })

  test("a controlled one opens only when its owner says", async () => {
    const view = sharing({ open: false })
    await view.click(view.part("trigger")!)
    expect(view.reasons).toEqual(["trigger-press"])
    expect(view.state.open).toBe(false)
  })

  test("with openOnHover, resting the pointer opens it and a press keeps it open", async () => {
    const view = mount(share, { openOnHover: true }, shareMarkup)
    mounts.push(view)
    await view.hover(view.part("trigger")!)
    await vi.waitFor(() => expect(view.state.open).toBe(true))
    await view.click(view.part("trigger")!)
    expect(view.state.open).toBe(true)
  })

  test("renders on the server from state alone", () => {
    const html = checkServer(share, { defaultOpen: true, modal: true }, shareMarkup)
    expect(html).toContain('role="dialog"')
    expect(html).toContain('aria-labelledby="server-')
  })
})

// A tooltip as an agent would write it.
const tip = definePrimitive({
  name: "tip",
  options: { open: "boolean", defaultOpen: "boolean", delay: "number" },
  state: (options: { open?: boolean; defaultOpen?: boolean; delay?: number }) => popupState(options),
  sync: (options) => (options.open === undefined ? {} : { open: options.open }),
  api: (context) => createPopup(context, { preset: tooltipPreset }),
  slots: (slot) => popupSlots(slot),
})

const tipMarkup = (label: string) =>
  `<div><trigger as="button">${label}</trigger><content>${label} tip</content></div>`

describe("tooltips on tooltipPreset", () => {
  test("describe their trigger, and the next opens at once while one is open, closing it", async () => {
    const first = mount(tip, { delay: 50 }, tipMarkup("Bold"))
    const second = mount(tip, { delay: 50 }, tipMarkup("Italic"))
    mounts.push(first, second)
    const trigger = first.part("trigger")!
    expect(trigger.getAttribute("aria-describedby")).toBe(first.part("content")!.id)
    await first.hover(trigger)
    await vi.waitFor(() => expect(first.state.open).toBe(true))
    await second.hover(second.part("trigger")!)
    expect(second.state.open).toBe(true)
    expect(first.state.open).toBe(false)
  })
})

describe("our popups on the kit", () => {
  test("Popover passes the dialog pattern and its trigger's shortcut opens it", async () => {
    const view = mount(
      popover,
      {},
      `<div><trigger shortcut="mod+i">Share</trigger><content><title>Share</title><button>Copy link</button><close>Close</close></content><button>After</button></div>`,
    )
    mounts.push(view)
    await view.click(view.part("trigger")!)
    await checkPattern(view.root, "dialog")
    expect(view.part("trigger")!.getAttribute("aria-keyshortcuts")).toBeTruthy()
  })

  test("Popover closing after the trigger that opened it is gone moves focus past it, not to its other trigger", async () => {
    const view = mount(
      popover,
      {},
      `<div><trigger id="ada">Ada</trigger><trigger id="grace">Grace</trigger><button>After</button><content><button>Copy link</button></content></div>`,
    )
    mounts.push(view)
    const grace = view.part("trigger", "grace")!
    grace.focus()
    await view.keys("Enter")
    expect(view.state.open).toBe(true)
    grace.remove()
    await view.keys("Escape")
    expect(view.state.open).toBe(false)
    expect(document.activeElement?.textContent).toBe("After")
  })

  test("Popover whose only trigger renders again while open returns focus to the new one", async () => {
    const instance = popover({ id: "p" })
    const first = Object.assign(document.createElement("button"), { textContent: "Open" })
    const content = document.createElement("div")
    const inside = content.appendChild(
      Object.assign(document.createElement("button"), { textContent: "Inside" }),
    )
    document.body.append(first, content)
    const unbindContent = bind(instance.part("content"), content)
    const unbindFirst = bind(instance.part("trigger", { id: "t1" }), first)
    first.click()
    await frame()
    inside.focus()
    unbindFirst()
    const second = Object.assign(document.createElement("button"), { textContent: "Close" })
    first.replaceWith(second)
    const unbindSecond = bind(instance.part("trigger", { id: "t2" }), second)
    inside.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }))
    await frame()
    expect(instance.get().open).toBe(false)
    expect(document.activeElement).toBe(second)
    unbindSecond()
    unbindContent()
    instance.destroy()
  })

  test("Popover opened from code after the trigger that opened it last is gone returns focus to its other trigger", async () => {
    const view = mount(
      popover,
      {},
      `<div><trigger id="ada">Ada</trigger><trigger id="grace">Grace</trigger><button>After</button><content><button>Copy link</button></content></div>`,
    )
    mounts.push(view)
    await view.click(view.part("trigger", "grace")!)
    view.part("trigger", "grace")!.remove()
    await view.keys("Escape")
    ;(document.activeElement as HTMLElement | null)?.blur()
    view.api.open()
    await view.settle()
    await view.keys("Escape")
    expect(view.state.open).toBe(false)
    expect(document.activeElement?.textContent).toBe("Ada")
  })

  test("Popover opened by its open option after the trigger that opened it last is gone returns focus to its other trigger", async () => {
    let options = { id: "p", open: false, onOpenChange: (open: boolean) => hand(open) }
    const instance = popover(options)
    const hand = (open: boolean) => {
      options = { ...options, open }
      instance.setOptions(options)
    }
    const button = (text: string) => Object.assign(document.createElement("button"), { textContent: text })
    const [ada, grace] = [button("Ada"), button("Grace")]
    const content = document.createElement("div")
    const inside = content.appendChild(button("Copy link"))
    document.body.append(ada, grace, content)
    const unbind = [
      bind(instance.part("content"), content),
      bind(instance.part("trigger", { id: "ada" }), ada),
      bind(instance.part("trigger", { id: "grace" }), grace),
    ]
    grace.click()
    await frame()
    inside.focus()
    grace.remove()
    hand(false)
    await frame()
    hand(true)
    await frame()
    inside.focus()
    hand(false)
    await frame()
    expect(document.activeElement).toBe(ada)
    for (const cleanup of unbind) cleanup()
    instance.destroy()
  })

  test("Hover Card opens on keyboard focus and Escape closes it", async () => {
    const view = mount(
      hoverCard,
      { delay: 0 },
      `<div><trigger as="a" href="/ada">Ada</trigger><content>Wrote the first program.</content></div>`,
    )
    mounts.push(view)
    await view.keys("Tab")
    await vi.waitFor(() => expect(view.state.open).toBe(true))
    await view.keys("Escape")
    expect(view.state.open).toBe(false)
    expect(document.activeElement).toBe(view.part("trigger"))
  })

  test("Tooltip opens at once on keyboard focus, a press closes it, and it renders on the server", async () => {
    const view = mount(tooltip, {}, `<div><trigger>Save</trigger><content>Save</content></div>`)
    mounts.push(view)
    await view.keys("Tab")
    expect(view.state.open).toBe(true)
    await view.click(view.part("trigger")!)
    expect(view.state.open).toBe(false)
    expect(
      checkServer(
        tooltip,
        { defaultOpen: true },
        `<div><trigger>Save</trigger><content>Save</content></div>`,
      ),
    ).toContain('role="tooltip"')
  })
})
