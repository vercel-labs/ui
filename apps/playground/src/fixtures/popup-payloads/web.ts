import {
  contentFor,
  describeChange,
  payloadOf,
  popupPayloadsFixture as fixture,
} from "tests/fixtures/popup-payloads.ts"

type ChangeEvent = CustomEvent<{ value: unknown; event?: Event }>
type Popup = HTMLElement & {
  api?: { open: (options: { payload: unknown }) => unknown }
}

const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-menu>
      <ui-menu-content class="popup">
        <ui-menu-group>
          <ui-menu-group-label></ui-menu-group-label>
          <ui-menu-item class="item" value="open">${fixture.menu.item}</ui-menu-item>
        </ui-menu-group>
      </ui-menu-content>
    </ui-menu>
    <ui-popover>
      <ui-popover-content class="popup"><span></span><button>${fixture.popover.show.label}</button></ui-popover-content>
    </ui-popover>
    <ui-dialog modal="false">
      <ui-dialog-content class="dialog"></ui-dialog-content>
    </ui-dialog>
    <ui-drawer modal="false">
      <ui-drawer-content class="drawer"></ui-drawer-content>
    </ui-drawer>
    <output role="status" aria-label="Last open"></output>
    <output role="status" aria-label="Last payload"></output>
  </div>
`

// A trigger with its payload, set before it connects, which is when it reads it.
function trigger(tag: string, label: string) {
  const el = Object.assign(document.createElement(tag), {
    payload: payloadOf(label),
  })
  el.innerHTML = `<button>${label}</button>`
  return el
}

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/menu")
  await import("@ui-sdk/web/popover")
  await import("@ui-sdk/web/dialog")
  await import("@ui-sdk/web/drawer")
  root.innerHTML = markup
  const [lastOpen, lastPayload] = root.querySelectorAll("output")

  const popups = [
    { name: "menu", tag: "ui-menu", content: "ui-menu-group-label" },
    {
      name: "popover",
      tag: "ui-popover",
      content: "ui-popover-content > span",
    },
    { name: "dialog", tag: "ui-dialog", content: "ui-dialog-content" },
    { name: "drawer", tag: "ui-drawer", content: "ui-drawer-content" },
  ] as const
  for (const { name, tag, content } of popups) {
    const popup = root.querySelector(tag)!
    popup.prepend(
      ...fixture[name].triggers.map((label) => trigger(`${tag}-trigger`, label))
    )
    const target = popup.querySelector(content)!
    popup.addEventListener("openchange", (event) => {
      const { value, event: cause } = (event as ChangeEvent).detail
      if (value) {
        lastOpen.textContent = describeChange(name, "open", cause)
      }
    })
    // The content renders from the event, which also fires when another trigger takes it over.
    popup.addEventListener("payloadchange", (event) => {
      const { value, event: cause } = (event as ChangeEvent).detail
      target.textContent = contentFor(value)
      lastPayload.textContent = describeChange(name, `payload ${value}`, cause)
    })
  }

  // A web component's `api` has its controller's methods.
  const popover = root.querySelector<Popup>("ui-popover")!
  popover
    .querySelector("ui-popover-content > button")!
    .addEventListener("click", () =>
      popover.api!.open({ payload: fixture.popover.show.payload })
    )
}

export { mount }
