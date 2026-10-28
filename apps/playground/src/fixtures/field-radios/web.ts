import { fieldRadiosFixture as f } from "tests/fixtures/field.ts"

async function mount(root: HTMLElement) {
  await Promise.all([import("@ui-sdk/web/field"), import("@ui-sdk/web/radio")])
  const sizes = f.sizes
    .map(
      (size) => `
        <ui-field class="row">
          <ui-radio class="radio" value="${size.value}"><ui-radio-indicator class="radio-indicator"></ui-radio-indicator></ui-radio>
          <ui-field-label>${size.label}</ui-field-label>
        </ui-field>`,
    )
    .join("")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-field>
        <ui-field-label>${f.label}</ui-field-label>
        <ui-radio-group class="form" name="${f.name}">${sizes}</ui-radio-group>
      </ui-field>
      <button>After</button>
    </div>`
}

export { mount }
