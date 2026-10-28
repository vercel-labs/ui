import { fieldChoiceCardFixture as f, fieldChoiceCardOptions } from "tests/fixtures/field.ts"

const indicator = `<ui-checkbox-indicator class="checkbox-indicator"></ui-checkbox-indicator>`

const card = (item: { name: string; title: string; description: string }) => `
  <label class="choice-card">
    <ui-field>
      <ui-checkbox class="checkbox" name="${item.name}">${indicator}</ui-checkbox>
      <span>${item.title}</span>
      <ui-field-description>${item.description}</ui-field-description>
    </ui-field>
  </label>`

async function mount(root: HTMLElement) {
  await Promise.all([import("@ui-sdk/web/field"), import("@ui-sdk/web/checkbox")])
  const { alone, later } = fieldChoiceCardOptions()
  const cards = f.cards.map((item) => `<ui-field-label as-child>${card(item)}</ui-field-label>`).join("")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      ${cards}
      ${later ? `<ui-field-label as-child id="later"></ui-field-label>` : ""}
      ${alone ? `<ui-field-label>${f.alone}</ui-field-label>` : ""}
      <button>After</button>
    </div>`
  if (later)
    setTimeout(
      () => root.querySelector("#later")!.insertAdjacentHTML("beforeend", card(f.later)),
      f.later.delay,
    )
}

export { mount }
