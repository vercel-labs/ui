import { accordionFixture, describeValue } from "tests/fixtures/accordion.ts"
import { accordionOptions } from "tests/fixtures/page.ts"

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")

function markup() {
  const items = accordionFixture.items
    .map(
      (item) => `
        <ui-accordion-item class="accordion-item" value="${item.value}"${item.disabled ? " disabled" : ""}>
          <ui-accordion-header>
            <h3 class="accordion-header"><ui-accordion-trigger><button class="accordion-trigger">${escape(item.label)}</button></ui-accordion-trigger></h3>
          </ui-accordion-header>
          <ui-accordion-panel class="accordion-panel">${escape(item.content)}${
            item.field ? `<label> ${escape(item.field)} <input></label>` : ""
          }${item.close ? `<button data-close="${item.value}">${escape(item.close)}</button>` : ""}</ui-accordion-panel>
        </ui-accordion-item>`
    )
    .join("")
  return `
    <div class="fixture">
      <button>Before</button>
      <ui-accordion class="accordion">${items}</ui-accordion>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output aria-label="Last completed"></output>
      <button id="controller">Show support</button>
      <button id="toggle-warranty">Toggle warranty</button>
    </div>
  `
}

type AccordionElement = HTMLElement & {
  api?: {
    open: (value: string) => void
    close: (value: string) => void
    getValue: () => string[]
  }
}

async function mount(root: HTMLElement) {
  const { cancel, defaultValue, ...options } = accordionOptions()
  root.innerHTML = markup()
  const accordion = root.querySelector<AccordionElement>("ui-accordion")!
  if (defaultValue) {
    accordion.setAttribute("default-value", defaultValue.join(","))
  }
  for (const [name, value] of Object.entries({
    multiple: options.multiple,
    disabled: options.disabled,
    "keep-mounted": options.keepMounted,
    "hidden-until-found": options.hiddenUntilFound,
  })) {
    if (value) {
      accordion.setAttribute(name, "")
    }
  }
  if (options.collapsible === false) {
    accordion.setAttribute("collapsible", "false")
  }
  await import("@ui-sdk/web/accordion")
  root
    .querySelector("#controller")!
    .addEventListener("click", () => accordion.api?.open("support"))
  root
    .querySelector("#toggle-warranty")!
    .addEventListener("click", () =>
      root.querySelector('[value="warranty"]')!.toggleAttribute("disabled")
    )
  for (const button of root.querySelectorAll<HTMLElement>("[data-close]")) {
    button.addEventListener("click", () =>
      accordion.api?.close(button.dataset.close!)
    )
  }
  root.addEventListener(
    "openchangecomplete",
    (event) => {
      const item = (event.target as HTMLElement).getAttribute("value")
      const open = (event as CustomEvent<{ value: boolean }>).detail.value
      root.querySelector('output[aria-label="Last completed"]')!.textContent =
        `${item} ${open ? "open" : "closed"}`
    },
    { capture: true }
  )
  root.addEventListener(
    "valuechange",
    (event) => {
      const detail = (event as CustomEvent<{ value: string[] }>).detail
      if (
        cancel &&
        detail.value.includes(cancel) &&
        !accordion.api?.getValue().includes(cancel)
      ) {
        return event.preventDefault()
      }
      root.querySelector("output")!.textContent = describeValue(detail.value)
    },
    { capture: true }
  )
}

export { mount }
