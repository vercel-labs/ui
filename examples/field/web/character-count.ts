import "@ui-sdk/web/field"

const limit = 280

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <ui-field-label>Bio</ui-field-label>
      <textarea rows="4" name="bio" maxlength="${limit}">Designer and engineer. I build tools for people who make things on the web.</textarea>
      <ui-field-description>
        <span>Shown on your public profile.</span>
        <span></span>
      </ui-field-description>
    </ui-field>
  `
  const bio = root.querySelector("textarea")!
  const counter = root.querySelector<HTMLElement>("ui-field-description span:last-child")!
  const update = () => {
    counter.textContent = `${bio.value.length} / ${limit}`
  }
  bio.addEventListener("input", update)
  update()
}
