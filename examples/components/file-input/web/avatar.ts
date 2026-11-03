import "@ui-sdk/web/file-input"
import { createElement, User } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-file-input accept="image/*" max-size="5000000">
      <ui-file-input-dropzone data-variant="avatar">
        ${createElement(User, { "aria-hidden": "true" }).outerHTML}
      </ui-file-input-dropzone>
      <div data-slot="stack">
        <div data-slot="row">
          <ui-file-input-trigger><button>Upload photo</button></ui-file-input-trigger>
          <button type="button" hidden>Remove</button>
        </div>
        <p data-slot="hint">Or drop an image on the avatar. Up to 5 MB.</p>
      </div>
    </ui-file-input>
  `
  const input = root.querySelector("ui-file-input")!
  const avatar = input.querySelector("ui-file-input-dropzone")!
  const [trigger, remove] = input.querySelectorAll("button")
  let url: string | null = null

  input.addEventListener("valuechange", (event) => {
    const [file] = event.detail.value
    if (url) URL.revokeObjectURL(url)
    url = file ? URL.createObjectURL(file) : null
    avatar.replaceChildren(
      url
        ? Object.assign(document.createElement("img"), {
            src: url,
            alt: "",
          })
        : createElement(User, { "aria-hidden": "true" }),
    )
    trigger.textContent = url ? "Change photo" : "Upload photo"
    remove.hidden = !url
  })
  remove.addEventListener("click", () => {
    input.value = []
  })

  return () => {
    if (url) URL.revokeObjectURL(url)
  }
}
