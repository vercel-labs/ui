import { Component, signal } from "@angular/core"
import { useShortcut, useShortcutHint } from "@ui-sdk/angular/shortcuts"

@Component({
  template: `
    <div data-slot="stack">
      <div data-slot="row">
        <button type="button" aria-keyshortcuts="N" (click)="newNote()">
          New note
          <kbd aria-hidden="true" data-slot="kbd">N</kbd>
        </button>
        <button
          type="button"
          [attr.aria-keyshortcuts]="saveHint.ariaKeyshortcuts()"
          (click)="save()"
        >
          Save
          <kbd aria-hidden="true" data-slot="kbd">{{ saveHint.text() }}</kbd>
        </button>
      </div>
      <output data-slot="output">{{ status() }}</output>
    </div>
  `,
})
class Example {
  readonly status = signal("Press N or the keys to save.")

  readonly saveHint = useShortcutHint("mod+s")

  constructor() {
    useShortcut("n", () => this.newNote(), { description: "New note" })
    useShortcut("mod+s", () => this.save(), { description: "Save" })
  }

  newNote() {
    this.status.set("Note created")
  }

  save() {
    this.status.set("Saved")
  }
}

export { Example }
