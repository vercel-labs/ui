import "@ui-sdk/web/resizable"
import type { UiResizableElement } from "@ui-sdk/web"
import { formatLayout, resizableFixture as f, resizableOptions } from "tests/fixtures/resizable.ts"

const { sidebar, main, preview } = f.editor.panels
const { code, terminal } = f.main.panels

// URL options go in as attributes, never as markup, so a crafted URL can't add elements.
function setAttributes(el: Element, attributes: Record<string, string | number | boolean | undefined>) {
  for (const [name, value] of Object.entries(attributes)) {
    if (value === undefined || value === false) continue
    el.setAttribute(name, value === true ? "" : String(value))
  }
}

function markup(options: ReturnType<typeof resizableOptions>) {
  return `
    <div class="fixture">
      <button>Before</button>
      <ui-resizable id="${f.editor.id}" class="resizable">
        <ui-resizable-panel id="${sidebar.id}" default-size="${sidebar.defaultSize}" min-size="${sidebar.minSize}" max-size="${sidebar.maxSize}" collapsible class="resizable-panel" role="group" aria-label="${sidebar.label}">
          <button>Sidebar action</button>
        </ui-resizable-panel>
        <ui-resizable-handle class="resizable-handle" aria-label="${f.editor.handles[0]}"${options.locked ? " disabled" : ""}></ui-resizable-handle>
        <ui-resizable-panel id="${main.id}" min-size="${main.minSize}" class="resizable-panel" role="group" aria-label="${main.label}">
          <ui-resizable id="${f.main.id}" class="resizable-nested" orientation="vertical">
            <ui-resizable-panel id="${code.id}" default-size="${code.defaultSize}" min-size="${code.minSize}" class="resizable-panel" role="group" aria-label="${code.label}"></ui-resizable-panel>
            <ui-resizable-handle class="resizable-handle" aria-label="${f.main.handle}"></ui-resizable-handle>
            <ui-resizable-panel id="${terminal.id}" min-size="${terminal.minSize}" collapsible class="resizable-panel" role="group" aria-label="${terminal.label}"></ui-resizable-panel>
          </ui-resizable>
        </ui-resizable-panel>
        <ui-resizable-handle class="resizable-handle" aria-label="${f.editor.handles[1]}"></ui-resizable-handle>
        <ui-resizable-panel id="${preview.id}" default-size="${preview.defaultSize}" min-size="${preview.minSize}" class="resizable-panel" role="group" aria-label="${preview.label}"></ui-resizable-panel>
      </ui-resizable>
      <div class="row">
        <button data-action="collapse">${f.buttons.collapse}</button>
        <button data-action="expand">${f.buttons.expand}</button>
        <button data-action="resize">${f.buttons.resize}</button>
      </div>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Committed"></output>
    </div>
  `
}

function mount(root: HTMLElement) {
  const options = resizableOptions()
  const template = document.createElement("template")
  template.innerHTML = markup(options)
  // Set before the element reaches the page, so it starts with these options.
  setAttributes(template.content.querySelector(`#${f.editor.id}`)!, {
    orientation: options.orientation,
    disabled: options.disabled,
    step: options.step,
    "large-step": options.largeStep,
    "auto-save-id": options.autoSaveId,
    "default-layout": options.defaultLayout?.join(","),
    layout: options.controlled ? "25,50,25" : undefined,
  })
  root.replaceChildren(template.content)
  const editor = root.querySelector<UiResizableElement>(`#${f.editor.id}`)!
  const action = root.querySelector<HTMLOutputElement>('output[aria-label="Last action"]')!
  const committed = root.querySelector<HTMLOutputElement>('output[aria-label="Committed"]')!

  // The element's api is its controller.
  root
    .querySelector('[data-action="collapse"]')!
    .addEventListener("click", () => editor.api.collapse(sidebar.id))
  root.querySelector('[data-action="expand"]')!.addEventListener("click", () => editor.api.expand(sidebar.id))
  root
    .querySelector('[data-action="resize"]')!
    .addEventListener("click", () => editor.api.resize(preview.id, f.previewSize))

  // Callbacks are DOM events: layoutchange while it moves, layoutcommit when it settles.
  root.addEventListener(
    "layoutchange",
    (event) => {
      const group = (event.target as HTMLElement).id
      const { value, reason } = (event as CustomEvent<{ value: number[]; reason: string }>).detail
      if (group === f.editor.id && options.cancel) return event.preventDefault()
      action.textContent = formatLayout(group, value, reason)
      // A controlled group takes the layout back, like a framework passing it down.
      if (group === f.editor.id && options.controlled && !options.ignore)
        editor.setAttribute("layout", value.join(","))
    },
    { capture: true },
  )
  root.addEventListener(
    "layoutcommit",
    (event) => {
      const { value, reason } = (event as CustomEvent<{ value: number[]; reason: string }>).detail
      const group = (event.target as HTMLElement).id
      committed.textContent = [committed.textContent, formatLayout(group, value, reason)]
        .filter(Boolean)
        .join(" ")
    },
    { capture: true },
  )
}

export { mount }
