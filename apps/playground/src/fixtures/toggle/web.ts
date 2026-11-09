import type { ButtonEvents, UiToggleGroupElement } from "@ui-sdk/web"
import { changedValue, toggleOptions } from "tests/fixtures/page.ts"
import { toggleAction, toggleFixture, type ToggleFixtureItem } from "tests/fixtures/toggle.ts"

const toggles = (items: ToggleFixtureItem[]) =>
  items
    .map(
      (item) =>
        `<ui-toggle value="${item.value}"${item.disabled ? " disabled" : ""}><button class="toggle">${item.label}</button></ui-toggle>`,
    )
    .join("")

function markup() {
  const { form, docs, changelog } = toggleFixture
  return `
    <div class="fixture">
      <button>Before</button>
      <ui-toggle id="bookmark"><button class="toggle">${toggleFixture.toggle.label}</button></ui-toggle>
      <ui-toggle-group class="toggle-group" name="alignment" aria-label="${toggleFixture.alignment.label}">
        ${toggles(toggleFixture.alignment.items)}
      </ui-toggle-group>
      <ui-separator class="rule" orientation="vertical"></ui-separator>
      <ui-toggle-group class="toggle-group" name="formatting" aria-label="${toggleFixture.formatting.label}" multiple default-value="${toggleFixture.formatting.defaultValue}">
        ${toggles(toggleFixture.formatting.items)}
      </ui-toggle-group>
      <form aria-label="${form.label}">
        <label>${form.field} <input name="name" value="${form.defaultName}"></label>
        <ui-button id="submit"><button class="button" type="submit">Submit</button></ui-button>
        <ui-button><button class="button" type="reset">Reset</button></ui-button>
        <ui-button disabled data-action="delete"><button class="button">Delete</button></ui-button>
        <ui-button disabled focusable-when-disabled data-action="archive"><button class="button" type="submit">Archive</button></ui-button>
      </form>
      <ui-button data-action="save"><button class="button">Save</button></ui-button>
      <ui-button id="publish"><button class="button">Publish</button></ui-button>
      <button id="clear">Clear formatting</button>
      <button id="finish-saving">Finish saving</button>
      <button id="finish-publishing">Finish publishing</button>
      <button id="fail-publishing">Fail publishing</button>
      <ui-button><a class="button" href="${docs.href}">${docs.label}</a></ui-button>
      <ui-button disabled><a class="button" href="${changelog.href}">${changelog.label}</a></ui-button>
      <ui-separator class="rule"></ui-separator>
      <ui-separator class="rule" decorative></ui-separator>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output aria-label="Submissions">0</output>
      <output aria-label="Pressed with"></output>
    </div>
  `
}

// A Promise and the buttons that settle it.
function gate() {
  let settle: { resolve: () => void; reject: (reason: Error) => void } | undefined
  return {
    wait: () => new Promise<void>((resolve, reject) => (settle = { resolve, reject })),
    resolve: () => settle?.resolve(),
    reject: () => settle?.reject(new Error("Offline")),
  }
}

async function mount(root: HTMLElement) {
  const { cancel, defaultPressed, disabled, alignment, orientation, deselectable, loop } = toggleOptions()
  root.innerHTML = markup()
  const output = root.querySelector('output[aria-label="Last action"]')!
  const say = (text: string) => (output.textContent = text)

  const bookmark = root.querySelector("#bookmark")!
  if (defaultPressed) bookmark.setAttribute("default-pressed", "")
  for (const group of root.querySelectorAll("ui-toggle-group")) {
    if (orientation) group.setAttribute("orientation", orientation)
    if (!deselectable) group.setAttribute("deselectable", "false")
    if (!loop) group.setAttribute("loop", "false")
  }
  // URL options go in as attributes, never as markup, so a crafted URL can't add elements.
  root
    .querySelector('[name="alignment"]')!
    .setAttribute("default-value", alignment || toggleFixture.alignment.defaultValue.join(","))
  const formatting = root.querySelector<UiToggleGroupElement>('[name="formatting"]')!
  if (disabled) formatting.setAttribute("disabled", "")

  await import("@ui-sdk/web/toggle")
  await import("@ui-sdk/web/button")
  await import("@ui-sdk/web/separator")

  bookmark.addEventListener("pressedchange", (event) => {
    if (cancel === toggleFixture.toggle.value) return event.preventDefault()
    say(toggleAction.toggle((event as CustomEvent<{ value: boolean }>).detail.value))
  })
  root.addEventListener(
    "valuechange",
    (event) => {
      const group = event.target as UiToggleGroupElement
      const value = (event as CustomEvent<{ value: string[] }>).detail.value
      if (cancel && changedValue(group.value, value) === cancel) return event.preventDefault()
      say(toggleAction.group(group.getAttribute("name")!, value))
    },
    { capture: true },
  )

  const saving = gate()
  const publishing = gate()
  root.addEventListener(
    "action",
    (event) => {
      const button = event.target as HTMLElement
      const { source, waitUntil } = (event as ButtonEvents["action"]).detail
      if (button.dataset.action) say(button.dataset.action)
      if (button.dataset.action === "save")
        root.querySelector('output[aria-label="Pressed with"]')!.textContent = source
      if (button.id === "submit") waitUntil(saving.wait())
      if (button.id === "publish") {
        say("publishing")
        waitUntil(publishing.wait().then(() => say("published")))
      }
    },
    { capture: true },
  )
  root.querySelector("#clear")!.addEventListener("click", () => formatting.api.setValue([]))
  root.querySelector("#finish-saving")!.addEventListener("click", saving.resolve)
  root.querySelector("#finish-publishing")!.addEventListener("click", publishing.resolve)
  root.querySelector("#fail-publishing")!.addEventListener("click", publishing.reject)
  root.querySelector("form")!.addEventListener("submit", (event) => {
    event.preventDefault()
    const count = root.querySelector('output[aria-label="Submissions"]')!
    count.textContent = String(Number(count.textContent) + 1)
  })
}

export { mount }
