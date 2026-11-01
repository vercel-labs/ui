import "@ui-sdk/web/field"
import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-field>
        <ui-field-label>Display name</ui-field-label>
        <ui-input>
          <input value="Ada" />
        </ui-input>
        <ui-field-description>Type to change it.</ui-field-description>
      </ui-field>
      <ui-field>
        <ui-field-label>Profile URL</ui-field-label>
        <ui-input>
          <input readonly value="example.com/ada" />
        </ui-input>
      </ui-field>
    </div>
  `
  const description = root.querySelector("ui-field-description")!
  const profile = root.querySelector<HTMLInputElement>("input[readonly]")!
  root.querySelector("ui-input")!.addEventListener("valuechange", (event) => {
    const { value, reason } = event.detail
    profile.value = `example.com/${value.toLowerCase()}`
    description.textContent = `Changed by ${reason}.`
  })
}
