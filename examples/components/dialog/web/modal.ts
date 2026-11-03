import "@ui-sdk/web/dialog"

const notes = {
  true: "The rest of the page is inert and doesn't scroll.",
  "trap-focus": "Tab stays inside, and the page still scrolls and takes clicks.",
  false: "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside.",
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <fieldset data-slot="row">
        <legend>modal</legend>
        <label data-slot="label"><input type="radio" name="modal" value="true" />Modal</label>
        <label data-slot="label"><input type="radio" name="modal" value="trap-focus" />Trap focus</label>
        <label data-slot="label"><input type="radio" name="modal" value="false" checked />Non-modal</label>
        <label data-slot="label"><input type="checkbox" data-outside />closeOnOutsidePress</label>
      </fieldset>
      <ui-dialog modal="false" close-on-outside-press="false">
        <ui-dialog-trigger><button>Open notes</button></ui-dialog-trigger>
        <ui-dialog-content>
          <div data-slot="stack">
            <ui-dialog-title>Notes</ui-dialog-title>
            <ui-dialog-description>${notes.false}</ui-dialog-description>
          </div>
          <textarea aria-label="Notes">Call the printer about the proofs.</textarea>
          <ui-dialog-close><button>Done</button></ui-dialog-close>
        </ui-dialog-content>
      </ui-dialog>
    </div>
  `
  const dialog = root.querySelector("ui-dialog")!
  const backdrop = document.createElement("ui-dialog-backdrop")
  const description = root.querySelector("ui-dialog-description")!
  root.querySelectorAll<HTMLInputElement>('input[name="modal"]').forEach((input) =>
    input.addEventListener("change", () => {
      dialog.setAttribute("modal", input.value)
      if (input.value === "true") root.querySelector("ui-dialog-trigger")!.after(backdrop)
      else backdrop.remove()
      description.textContent = notes[input.value as keyof typeof notes]
    }),
  )
  root
    .querySelector<HTMLInputElement>("[data-outside]")!
    .addEventListener("change", (event) =>
      dialog.setAttribute("close-on-outside-press", String((event.target as HTMLInputElement).checked)),
    )
}

export { mount }
