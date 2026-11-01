// @vitest-environment jsdom
// checkPattern on our primitives, mounted from markup, and on hand-made
// markup broken the ways APG patterns break.
import { afterEach, describe, expect, test } from "vitest"
import { accordion } from "../src/components/accordion/accordion"
import { checkbox } from "../src/components/checkbox/checkbox"
import { collapsible } from "../src/components/collapsible/collapsible"
import { combobox } from "../src/components/combobox/combobox"
import { alertDialog } from "../src/components/dialog/alert-dialog"
import { dialog } from "../src/components/dialog/dialog"
import { listbox } from "../src/components/listbox/listbox-root"
import { menu } from "../src/components/menu/menu"
import { popover } from "../src/components/popover/popover"
import { radioGroup } from "../src/components/radio/radio"
import { slider } from "../src/components/slider/slider"
import { switchPrimitive } from "../src/components/switch/switch"
import { tabs } from "../src/components/tabs/tabs"
import { toolbar } from "../src/components/toolbar/toolbar"
import { tree } from "../src/components/tree/tree"
import { checkPattern } from "../src/testing/check-pattern"
import { mount } from "../src/testing/mount"

const mounts: { unmount: () => void }[] = []
afterEach(() => {
  mounts.splice(0).forEach((mounted) => mounted.unmount())
  document.body.replaceChildren()
})

function view<V extends { unmount: () => void }>(mounted: V) {
  mounts.push(mounted)
  return mounted
}

describe("our primitives pass", () => {
  const tabsMarkup = (root = "<root>") => `${root}
    <list aria-label="Settings">
      <tab value="a">Account</tab>
      <tab value="b">Password</tab>
      <tab value="c">Billing</tab>
    </list>
    <panel value="a">Account panel</panel>
    <panel value="b">Password panel</panel>
    <panel value="c">Billing panel</panel>
  </root>`

  test("tabs", async () => {
    const tabsView = view(mount(tabs, { defaultValue: "a" }, tabsMarkup()))
    await checkPattern(tabsView.root, "tabs")
    expect(tabsView.state.value).toBe("a")
    expect(document.activeElement).toBe(tabsView.part("tab", "a"))
  })

  test("tabs right to left", async () => {
    const tabsView = view(mount(tabs, { defaultValue: "b" }, tabsMarkup(`<root dir="rtl">`)))
    await checkPattern(tabsView.root, "tabs")
    expect(tabsView.state.value).toBe("b")
  })

  test("vertical tabs with manual activation", async () => {
    const tabsView = view(
      mount(tabs, { defaultValue: "a", orientation: "vertical", activation: "manual" }, tabsMarkup()),
    )
    await checkPattern(tabsView.root, "tabs")
    expect(tabsView.state.value).toBe("a")
  })

  test("listbox", async () => {
    const listView = view(
      mount(
        listbox,
        { defaultValue: "banana" },
        `<root aria-label="Fruit">
          <item value="apple">Apple</item>
          <item value="banana">Banana</item>
          <item value="cherry">Cherry</item>
          <item value="date">Date</item>
        </root>`,
      ),
    )
    await checkPattern(listView.root, "listbox")
    expect(listView.state.value).toBe("banana")
  })

  test("multi-select listbox", async () => {
    const listView = view(
      mount(
        listbox,
        { multiple: true, defaultValue: ["cherry"] },
        `<root aria-label="Toppings">
          <item value="apple">Apple</item>
          <item value="banana">Banana</item>
          <item value="cherry">Cherry</item>
        </root>`,
      ),
    )
    await checkPattern(listView.root, "listbox")
    expect(listView.state.value).toEqual(["cherry"])
  })

  test("menu", async () => {
    const menuView = view(
      mount(
        menu,
        {},
        `<div>
          <trigger>Edit</trigger>
          <content>
            <item>Cut</item>
            <item>Copy</item>
            <item>Paste</item>
          </content>
        </div>`,
      ),
    )
    await menuView.click(menuView.part("trigger")!)
    await checkPattern(menuView.root, "menu")
  })

  test("menu opened from the keyboard", async () => {
    const menuView = view(
      mount(
        menu,
        {},
        `<div><trigger>File</trigger><content><item>New</item><item>Open</item><item>Save</item></content></div>`,
      ),
    )
    ;(menuView.part("trigger") as HTMLElement).focus()
    await menuView.keys("Enter")
    await checkPattern(menuView.root, "menu")
  })

  test("radio group", async () => {
    const radioView = view(
      mount(
        radioGroup,
        { defaultValue: "m" },
        `<group aria-label="Size">
          <root value="s">Small</root>
          <root value="m">Medium</root>
          <root value="l">Large</root>
        </group>`,
      ),
    )
    await checkPattern(radioView.root, "radio-group")
    expect(radioView.state.value).toBe("m")
  })

  test("toolbar", async () => {
    const toolbarView = view(
      mount(
        toolbar,
        {},
        `<root aria-label="Format">
          <button>Bold</button>
          <button>Italic</button>
          <button>Underline</button>
        </root>`,
      ),
    )
    await checkPattern(toolbarView.root, "toolbar")
  })

  test("tree", async () => {
    const treeView = view(
      mount(
        tree,
        {},
        `<root aria-label="Files">
          <item value="src" branch>
            <label>src</label>
            <group>
              <item value="index"><label>index.ts</label></item>
              <item value="util"><label>util.ts</label></item>
            </group>
          </item>
          <item value="docs"><label>docs</label></item>
          <item value="readme"><label>README.md</label></item>
        </root>`,
      ),
    )
    await checkPattern(treeView.root, "tree")
  })

  test("accordion", async () => {
    const accordionView = view(
      mount(
        accordion,
        {},
        `<root>
          <item value="a"><header as="h3"><trigger>Shipping</trigger></header><panel>Ships in a day.</panel></item>
          <item value="b"><header as="h3"><trigger>Returns</trigger></header><panel>Within a month.</panel></item>
        </root>`,
      ),
    )
    await checkPattern(accordionView.root, "accordion")
  })

  test("disclosure", async () => {
    const disclosureView = view(
      mount(collapsible, {}, `<root><trigger>Details</trigger><panel>More about it.</panel></root>`),
    )
    await checkPattern(disclosureView.root, "disclosure")
  })

  test("switch", async () => {
    const switchView = view(mount(switchPrimitive, {}, `<root aria-label="Wi-Fi"><thumb></thumb></root>`))
    await checkPattern(switchView.root, "switch")
    expect(switchView.state.checked).toBe(false)
  })

  test("checkbox", async () => {
    const checkboxView = view(mount(checkbox, {}, `<root aria-label="Accept"><indicator></indicator></root>`))
    await checkPattern(checkboxView.root, "checkbox")
    expect(checkboxView.state.checked).toBe(false)
  })

  test("slider", async () => {
    const sliderView = view(
      mount(
        slider,
        { defaultValue: 30 },
        `<root aria-label="Volume">
          <control><track><indicator></indicator><thumb><thumb-input aria-label="Volume"></thumb-input></thumb></track></control>
        </root>`,
      ),
    )
    await checkPattern(sliderView.root, "slider")
  })

  test("a non-modal popover passes as a dialog without aria-modal", async () => {
    const popoverView = view(
      mount(
        popover,
        { modal: false },
        `<div>
          <trigger>Share</trigger>
          <content><title>Share</title><button>Copy link</button><close>Close</close></content>
          <button>After</button>
        </div>`,
      ),
    )
    await popoverView.click(popoverView.part("trigger")!)
    await checkPattern(popoverView.root, "dialog")
  })

  test("dialog", async () => {
    const dialogView = view(
      mount(
        dialog,
        {},
        `<div>
          <trigger>Open</trigger>
          <content><title>Settings</title><button>Save</button><close>Close</close></content>
        </div>`,
      ),
    )
    await dialogView.click(dialogView.part("trigger")!)
    await checkPattern(dialogView.root, "dialog")
  })

  test("alert dialog", async () => {
    const alertView = view(
      mount(
        alertDialog,
        {},
        `<div>
          <trigger>Delete</trigger>
          <content>
            <title>Delete the file?</title>
            <description>It can't be undone.</description>
            <close>Cancel</close>
          </content>
        </div>`,
      ),
    )
    await alertView.click(alertView.part("trigger")!)
    await checkPattern(alertView.root, "alertdialog")
  })

  // `mount` binds the popup's content while it isn't present, and never again
  // once it is, so after focus settles on the input, ArrowDown sets
  // aria-expanded without opening the popup's layer, and Escape can't close it.
  // An adapter binds the content when it renders. Opened in the same task as
  // the focus, the layer opens, so the rest is checked from there.
  const comboboxMarkup = `<root>
    <label>Fruit</label>
    <input>
    <content><list><item value="Apple">Apple</item><item value="Banana">Banana</item><item value="Cherry">Cherry</item></list></content>
  </root>`

  test("combobox, open", async () => {
    const comboboxView = view(mount(combobox, { items: ["Apple", "Banana", "Cherry"] }, comboboxMarkup))
    ;(comboboxView.part("input") as HTMLElement).focus()
    await comboboxView.keys("ArrowDown")
    await checkPattern(comboboxView.root, "combobox")
  })

  test("combobox, closed", async () => {
    const comboboxView = view(mount(combobox, { items: ["Apple", "Banana", "Cherry"] }, comboboxMarkup))
    await checkPattern(comboboxView.root, "combobox")
  })
})

// Hand-made markup, in the page as is.
function render(markup: string) {
  const container = document.createElement("div")
  container.innerHTML = markup.trim()
  document.body.append(container)
  return container.firstElementChild as HTMLElement
}

// Roving focus done by hand: arrows, Home and End move focus and the tab stop
// among `selector`'s items, wrapping, and `onMove` runs on the item they reach.
function rove(
  container: HTMLElement,
  selector: string,
  {
    next = "ArrowDown",
    previous = "ArrowUp",
    onMove,
  }: { next?: string; previous?: string; onMove?: (item: HTMLElement) => void } = {},
) {
  container.addEventListener("keydown", (event) => {
    const items = [...container.querySelectorAll<HTMLElement>(selector)]
    const index = items.indexOf(document.activeElement as HTMLElement)
    const moves: Record<string, number> = {
      [next]: index + 1,
      [previous]: index - 1,
      Home: 0,
      End: items.length - 1,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    const target = items[(moves[event.key] + items.length) % items.length]
    for (const item of items) item.tabIndex = item === target ? 0 : -1
    target.focus()
    onMove?.(target)
  })
  return container
}

// Selection that follows focus, by aria-selected.
const selectOnly = (selector: string) => (item: HTMLElement) => {
  for (const other of item.closest("[role]")!.parentElement!.querySelectorAll(selector))
    other.setAttribute("aria-selected", String(other === item))
}

// Our menubar composes a menu instance per item, and `mount` renders one primitive.
test("a hand-made menubar passes", async () => {
  const root = render(`
    <div role="menubar" aria-label="App">
      <div role="menuitem" tabindex="0">File</div>
      <div role="menuitem" tabindex="-1">Edit</div>
      <div role="menuitem" tabindex="-1">View</div>
    </div>`)
  rove(root, "[role=menuitem]", { next: "ArrowRight", previous: "ArrowLeft" })
  await checkPattern(root, "menubar")
})

test("a hand-made listbox passes when its styles hide an option, which arrows skip", async () => {
  // Names that start alike, so typeahead has no single target and stays out of it.
  const root = render(`
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="true" tabindex="0">Apple</div>
      <div role="option" aria-selected="false" tabindex="-1" style="display: none">Apricot</div>
      <div role="option" aria-selected="false" tabindex="-1">Avocado</div>
    </div>`)
  rove(root, "[role=option]:not([style])", { onMove: selectOnly("[role=option]") })
  await checkPattern(root, "listbox")
})

test("a hand-made listbox passes when a stylesheet hides the group around options, which arrows skip", async () => {
  const root = render(`
    <div>
    <style>.closed { display: none }</style>
    <div role="listbox" aria-label="Fruit">
      <div role="option" aria-selected="true" tabindex="0">Apple</div>
      <div class="closed"><div role="option" aria-selected="false" tabindex="-1">Apricot</div></div>
      <div role="option" aria-selected="false" tabindex="-1">Avocado</div>
    </div>
    </div>`)
  rove(root, "[role=listbox] > [role=option]", { onMove: selectOnly("[role=option]") })
  await checkPattern(root, "listbox")
})

test("a hand-made toolbar passes when a stylesheet hides a control, which arrows skip", async () => {
  const root = render(`
    <div>
    <style>.closed { display: none }</style>
    <div role="toolbar" aria-label="Format">
      <button tabindex="0">Bold</button>
      <span class="closed"><button tabindex="-1">Italic</button></span>
      <button tabindex="-1">Underline</button>
    </div>
    </div>`)
  rove(root, "[role=toolbar] > button", { next: "ArrowRight", previous: "ArrowLeft" })
  await checkPattern(root, "toolbar")
})

test("a native radio group passes when styles hide its first radio, which Tab skips", async () => {
  const root = render(`
    <div role="radiogroup" aria-label="Size">
      <label style="display: none"><input type="radio" name="size" value="s">Small</label>
      <label><input type="radio" name="size" value="m">Medium</label>
    </div>`)
  await expect(checkPattern(root, "radio-group")).resolves.toBeUndefined()
})

test("a hand-made listbox passes when the slot it renders an option in is hidden", async () => {
  const root = render(`<div role="listbox" aria-label="Fruit">
    <div role="option" aria-selected="true" tabindex="0">Apple</div>
    <div role="option" aria-selected="false" tabindex="-1" slot="closed">Apricot</div>
    <div role="option" aria-selected="false" tabindex="-1">Avocado</div>
  </div>`)
  root.attachShadow({ mode: "open" }).innerHTML =
    `<slot></slot><slot name="closed" style="display: none"></slot>`
  rove(root, "[role=option]:not([slot])", { onMove: selectOnly("[role=option]") })
  await checkPattern(root, "listbox")
})

describe("broken markup fails", () => {
  test("a listbox whose arrows don't move past an option its styles hide", async () => {
    const root = render(`
      <div role="listbox" aria-label="Fruit">
        <div role="option" aria-selected="true" tabindex="0">Apple</div>
        <div role="option" aria-selected="false" tabindex="-1" style="display: none">Apricot</div>
        <div role="option" aria-selected="false" tabindex="-1">Avocado</div>
      </div>`)
    await expect(checkPattern(root, "listbox")).rejects.toThrow(/ArrowDown/)
  })

  test("a tree branch whose group its styles hide, without aria-expanded", async () => {
    const root = render(`
      <div role="tree" aria-label="Files">
        <div role="treeitem" tabindex="0">src
          <div role="group" style="display: none"><div role="treeitem" tabindex="-1">index.ts</div></div>
        </div>
      </div>`)
    await expect(checkPattern(root, "tree")).rejects.toThrow(/has child items but no aria-expanded/)
  })

  test("a dialog that keeps Tab inside without aria-modal", async () => {
    const root = render(`<div>
      <button id="opener" aria-haspopup="dialog" aria-expanded="true" aria-controls="box">Open</button>
      <div id="box" role="dialog" aria-label="Box"><button id="one">One</button><button id="two">Two</button></div>
    </div>`)
    const box = root.querySelector<HTMLElement>("#box")!
    // Tab wraps by hand, the way a modal dialog keeps focus inside.
    box.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return
      event.preventDefault()
      const stops = [...box.querySelectorAll("button")]
      const next =
        stops[
          (stops.indexOf(document.activeElement as HTMLButtonElement) +
            (event.shiftKey ? stops.length - 1 : 1)) %
            stops.length
        ]
      next.focus()
    })
    root.querySelector<HTMLElement>("#one")!.focus()
    await expect(checkPattern(root, "dialog")).rejects.toThrow(/is modal but has no aria-modal="true"/)
  })

  test("a tablist with two tab stops", async () => {
    const root = render(`
      <div>
        <div role="tablist" aria-label="Settings">
          <button role="tab" id="tab-a" aria-selected="true" aria-controls="panel-a" tabindex="0">Account</button>
          <button role="tab" id="tab-b" aria-selected="false" aria-controls="panel-b" tabindex="0">Password</button>
        </div>
        <div role="tabpanel" id="panel-a" aria-labelledby="tab-a">Account panel</div>
        <div role="tabpanel" id="panel-b" aria-labelledby="tab-b" hidden>Password panel</div>
      </div>`)
    rove(root.querySelector("[role=tablist]")!, "[role=tab]", {
      next: "ArrowRight",
      previous: "ArrowLeft",
      onMove: selectOnly("[role=tab]"),
    })
    await expect(checkPattern(root, "tabs")).rejects.toThrow(
      "checkPattern found 1 problem with the tabs pattern:\n- div[role=tablist]: has 2 tab stops (button#tab-a[role=tab], button#tab-b[role=tab]); a composite has one",
    )
  })

  test("a listbox option without aria-selected", async () => {
    // Names that start alike, so typeahead has no single target and stays out of it.
    const root = render(`
      <div role="listbox" aria-label="Fruit">
        <div role="option" id="apple" aria-selected="true" tabindex="0">Apple</div>
        <div role="option" id="apricot" tabindex="-1">Apricot</div>
        <div role="option" id="avocado" aria-selected="false" tabindex="-1">Avocado</div>
      </div>`)
    rove(root, "[role=option]", { onMove: selectOnly("[role=option]") })
    await expect(checkPattern(root, "listbox")).rejects.toThrow(
      `checkPattern found 1 problem with the listbox pattern:\n- div#apricot[role=option]: has no aria-selected`,
    )
  })

  test("an aria-controls that points nowhere", async () => {
    const root = render(`
      <div>
        <button type="button" aria-expanded="true" aria-controls="details">Details</button>
        <div id="detail">More about it.</div>
      </div>`)
    const button = root.querySelector("button")!
    button.addEventListener("click", () =>
      button.setAttribute("aria-expanded", String(button.getAttribute("aria-expanded") !== "true")),
    )
    await expect(checkPattern(root, "disclosure")).rejects.toThrow(
      `checkPattern found 1 problem with the disclosure pattern:\n- button "Details": aria-controls points at "details", which isn't in the page`,
    )
  })

  test("a disclosure button with no name", async () => {
    const button = render(`<button type="button" aria-expanded="false"></button>`)
    button.addEventListener("click", () =>
      button.setAttribute("aria-expanded", String(button.getAttribute("aria-expanded") !== "true")),
    )
    await expect(checkPattern(button, "disclosure")).rejects.toThrow(
      "checkPattern found 1 problem with the disclosure pattern:\n- button: has no accessible name",
    )
  })

  test("arrows that don't move", async () => {
    const root = render(`
      <div role="listbox" aria-label="Fruit">
        <div role="option" id="apple" aria-selected="true" tabindex="0">Apple</div>
        <div role="option" id="banana" aria-selected="false" tabindex="-1">Banana</div>
      </div>`)
    const error = await checkPattern(root, "listbox").catch((caught: Error) => caught)
    expect(String(error)).toContain(
      "div#apple[role=option]: ArrowDown should move focus to the next option, div#banana[role=option], but focus stayed (APG listbox).",
    )
  })

  test("arrows that don't swap right to left", async () => {
    const root = render(`
      <div dir="rtl">
        <div role="tablist" aria-label="Settings">
          <button role="tab" id="tab-a" aria-selected="true" aria-controls="panel" tabindex="0">Account</button>
          <button role="tab" id="tab-b" aria-selected="false" tabindex="-1">Password</button>
          <button role="tab" id="tab-c" aria-selected="false" tabindex="-1">Billing</button>
        </div>
        <div role="tabpanel" id="panel" aria-labelledby="tab-a">Panel</div>
      </div>`)
    rove(root.querySelector("[role=tablist]")!, "[role=tab]", { next: "ArrowRight", previous: "ArrowLeft" })
    const error = await checkPattern(root, "tabs").catch((caught: Error) => caught)
    expect(String(error)).toContain("button#tab-a[role=tab]: ArrowLeft should move focus to the next tab")
  })

  test("a key that drops focus to the body", async () => {
    const root = render(`
      <div role="radiogroup" aria-label="Size">
        <button role="radio" aria-checked="true" tabindex="0">Small</button>
        <button role="radio" aria-checked="false" tabindex="-1">Large</button>
      </div>`)
    root.addEventListener("keydown", (event) => {
      if (event.key.startsWith("Arrow")) (event.target as HTMLElement).remove()
    })
    await expect(checkPattern(root, "radio-group")).rejects.toThrow(
      `- button[role=radio] "Small": after ArrowDown, focus fell to the body`,
    )
  })

  test("one error lists every problem", async () => {
    const root = render(`
      <div role="listbox">
        <div role="option" tabindex="0">Apple</div>
        <button role="option" tabindex="0">Banana</button>
      </div>`)
    const error = await checkPattern(root, "listbox").catch((caught: Error) => caught)
    const message = String(error)
    expect(message).toContain("- div[role=listbox]: has no accessible name")
    expect(message).toContain(`- div[role=option] "Apple": has no aria-selected`)
    expect(message).toContain("- div[role=listbox]: has 2 tab stops")
  })

  test("a pattern it doesn't support yet says which it does", async () => {
    // @ts-expect-error A grid isn't a pattern it checks yet, which its type says too.
    await expect(checkPattern(render(`<div role="grid"></div>`), "grid")).rejects.toThrow(
      'checkPattern doesn\'t support "grid" yet. It supports listbox, menu, menubar, tabs, radio-group',
    )
  })
})
