import { Component, signal } from "@angular/core"
import { shortcuts, useShortcut } from "@ui-sdk/angular/shortcuts"

@Component({
  template: `
    <div data-slot="stack">
      <textarea
        #note
        [value]="text()"
        aria-label="Note"
        placeholder="Write a note…"
        (input)="text.set(note.value)"
        (focus)="shortcuts.setScope('note', true)"
        (blur)="shortcuts.setScope('note', false)"
      ></textarea>
      <output data-slot="output">{{ status() }}</output>
    </div>
  `,
})
class Example {
  readonly shortcuts = shortcuts

  readonly text = signal("")

  readonly status = signal("Focus the note to turn on its shortcuts.")

  constructor() {
    useShortcut(
      "mod+enter",
      () => this.status.set(`Characters saved: ${this.text().trim().length}`),
      {
        scope: "note",
        when: () => this.text().trim() !== "",
        description: "Save the note",
      }
    )
    useShortcut(
      "escape",
      () => {
        this.text.set("")
        this.status.set("Cleared")
      },
      { scope: "note", allowInInput: true, description: "Clear the note" }
    )
  }
}

export { Example }
