import {
  toolbarFixture as f,
  toolbarLocked,
  toolbarOptions,
} from "tests/fixtures/toolbar.ts"

const group = (
  { label, defaultValue, items }: typeof f.style,
  multiple: boolean
) => `
  <ui-toggle-group class="toggle-group" aria-label="${label}" ${multiple ? "multiple" : ""} default-value="${defaultValue.join(",")}">
    ${items
      .map(
        (item) =>
          `<ui-toggle value="${item.value}" ${"disabled" in item && item.disabled ? "disabled" : ""}><button class="toggle">${item.label}</button></ui-toggle>`
      )
      .join("")}
  </ui-toggle-group>
  <ui-toolbar-separator></ui-toolbar-separator>`

// For ?locked: a disabled group around an item, until Unlock.
const lock = (label: string, item: string) =>
  toolbarLocked()
    ? `<ui-toolbar-group class="locked" aria-label="${label}" disabled>${item}</ui-toolbar-group>`
    : item

const markup = () => `
  <div class="fixture">
    <button>Before</button>
    <ui-toolbar class="toolbar" aria-label="${f.label}">
      ${lock("Locked style", group(f.style, true))}
      ${group(f.alignment, false)}
      <ui-menu>
        <ui-toolbar-button><ui-menu-trigger><button>${f.font.trigger}</button></ui-menu-trigger></ui-toolbar-button>
        <ui-menu-content class="popup">
          ${f.font.items.map((item) => `<ui-menu-item class="item" value="${item}">${item}</ui-menu-item>`).join("")}
        </ui-menu-content>
      </ui-menu>
      <ui-number-input id="size" default-value="${f.size.defaultValue}">
        <ui-toolbar-input><ui-number-input-control><input aria-label="${f.size.label}" /></ui-number-input-control></ui-toolbar-input>
      </ui-number-input>
      <ui-toolbar-input><input aria-label="${f.comment.label}" value="${f.comment.defaultValue}" /></ui-toolbar-input>
      <ui-toolbar-group class="toolbar-group ${toolbarLocked() ? "locked" : ""}" aria-label="${f.history.label}" ${toolbarLocked() ? "disabled" : ""}>
        ${f.history.items
          .map(
            (item) =>
              `<ui-toolbar-button ${"disabled" in item && item.disabled ? "disabled" : ""}><button data-action="${item.label.toLowerCase()}">${item.label}</button></ui-toolbar-button>`
          )
          .join("")}
      </ui-toolbar-group>
      ${lock("Locked proofing", `<ui-toggle id="spellcheck"><button class="toggle">${f.spellcheck.label}</button></ui-toggle>`)}
      ${lock("Locked help", `<ui-toolbar-link><a href="${f.help.href}">${f.help.label}</a></ui-toolbar-link>`)}
    </ui-toolbar>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
    <button id="focus">Focus toolbar</button>
    <button id="unlock">Unlock</button>
  </div>
`

async function mount(root: HTMLElement) {
  root.innerHTML = markup()
  const toolbar = root.querySelector("ui-toolbar")!
  const options = toolbarOptions()
  if (options.orientation) {
    toolbar.setAttribute("orientation", options.orientation)
  }
  if (options.loop === false) {
    toolbar.setAttribute("loop", "false")
  }
  if (options.disabled) {
    toolbar.setAttribute("disabled", "")
  }
  await import("@ui-sdk/web/toolbar")
  await import("@ui-sdk/web/toggle")
  await import("@ui-sdk/web/menu")
  await import("@ui-sdk/web/number-input")
  const output = root.querySelector("output")!
  root
    .querySelector("#focus")!
    .addEventListener("click", () => toolbar.api.focus())
  root.querySelector("#unlock")!.addEventListener("click", () => {
    for (const group of root.querySelectorAll(".locked")) {
      group.removeAttribute("disabled")
    }
  })
  root.addEventListener(
    "valuechange",
    (event) => {
      const target = event.target as HTMLElement
      const value = (event as CustomEvent<{ value: unknown }>).detail.value
      if (target.id === "size") {
        output.textContent = `size: ${value}`
      } else if (Array.isArray(value)) {
        output.textContent = `${target.getAttribute("aria-label")}: ${value.join(", ") || "none"}`
      }
    },
    { capture: true }
  )
  root
    .querySelector("#spellcheck")!
    .addEventListener("pressedchange", (event) => {
      output.textContent = `spellcheck: ${(event as CustomEvent<{ value: boolean }>).detail.value ? "on" : "off"}`
    })
  root.addEventListener(
    "action",
    (event) => {
      output.textContent = `font: ${(event as CustomEvent<{ value: string }>).detail.value}`
    },
    { capture: true }
  )
  root.addEventListener("click", (event) => {
    const action = (event.target as HTMLElement)
      .closest("[data-action]")
      ?.getAttribute("data-action")
    if (action) {
      output.textContent = action
    }
  })
}

export { mount }
