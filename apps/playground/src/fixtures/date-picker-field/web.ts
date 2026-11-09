import {
  datePickerFieldFixture as f,
  datePickerFieldOptions,
  datePickerFixture,
} from "tests/fixtures/date-picker.ts"

async function mount(root: HTMLElement) {
  await Promise.all([
    import("@ui-sdk/web/field"),
    import("@ui-sdk/web/date-picker"),
  ])
  const { required, disabled } = datePickerFieldOptions()
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <form>
        <ui-field class="field" name="${datePickerFixture.name}"${disabled ? " disabled" : ""}>
          <ui-field-label>${f.label}</ui-field-label>
          <ui-date-picker class="date-picker" today="${datePickerFixture.today}"${required ? " required" : ""}>
            <ui-date-picker-input></ui-date-picker-input>
            <ui-date-picker-trigger></ui-date-picker-trigger>
            <ui-date-picker-hint class="date-picker-hint"></ui-date-picker-hint>
            <ui-date-picker-content class="date-picker-content"></ui-date-picker-content>
          </ui-date-picker>
          <ui-field-description>${f.description}</ui-field-description>
          <ui-field-error class="field-error"></ui-field-error>
        </ui-field>
        <button type="submit">Submit</button>
        <button type="button" class="remove">Remove date picker</button>
      </form>
      <output role="status" aria-label="Submitted"></output>
    </div>`
  const form = root.querySelector("form")!
  const submitted = root.querySelector("output")!
  root
    .querySelector(".remove")!
    .addEventListener("click", () =>
      root.querySelector("ui-date-picker")?.remove()
    )
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    submitted.textContent = JSON.stringify([...new FormData(form)])
  })
}

export { mount }
