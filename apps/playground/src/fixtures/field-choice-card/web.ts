import { fieldChoiceCardFixture as f, fieldChoiceCardOptions } from "tests/fixtures/field.ts"

async function mount(root: HTMLElement) {
  await Promise.all([import("@ui-sdk/web/field"), import("@ui-sdk/web/checkbox")])
  const { alone } = fieldChoiceCardOptions()
  const cards = f.cards
    .map(
      (card) => `
        <ui-field-label as-child>
          <label class="choice-card">
            <ui-field>
              <ui-checkbox class="checkbox" name="${card.name}"><ui-checkbox-indicator class="checkbox-indicator"></ui-checkbox-indicator></ui-checkbox>
              <span>${card.title}</span>
              <ui-field-description>${card.description}</ui-field-description>
            </ui-field>
          </label>
        </ui-field-label>`,
    )
    .join("")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      ${cards}
      ${alone ? `<ui-field-label>${f.alone}</ui-field-label>` : ""}
      <button>After</button>
    </div>`
}

export { mount }
