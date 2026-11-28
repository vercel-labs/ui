import { Component, ElementRef, signal, viewChild } from "@angular/core"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  createConfirm,
} from "@ui-sdk/angular/alert-dialog"
import { type DialogContentState } from "@ui-sdk/angular/dialog"

@Component({
  imports: [
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button
          type="button"
          #reset
          (click)="projects.set(['Acme', 'Globex', 'Initech'])"
        >
          Reset Projects
        </button>
      </div>
      <ul data-slot="list" aria-label="Projects">
        @for (name of projects(); track name) {
          <li data-slot="row">
            {{ name }}
            <button
              type="button"
              data-size="sm"
              [attr.aria-label]="\`Delete \${name}\`"
              #button
              (click)="remove(name, button)"
            >
              Delete
            </button>
          </li>
        } @empty {
          <li data-slot="row">All projects deleted.</li>
        }
      </ul>
      <ng-container uiAlertDialog [controller]="confirm.controller">
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent="let content">
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>Delete {{ payloadOf(content)?.name }}?</h2>
            <p uiAlertDialogDescription>
              The project and its files will be deleted for everyone on your
              team.
            </p>
          </div>
          <div data-slot="row">
            <button uiAlertDialogClose>Cancel</button>
            <button uiAlertDialogClose data-variant="solid" value="confirm">
              Delete
            </button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly confirm = createConfirm<{ name: string }>()

  readonly projects = signal(["Acme", "Globex", "Initech"])

  readonly reset = viewChild<ElementRef<HTMLButtonElement>>("reset")

  async remove(name: string, button: HTMLButtonElement) {
    if (!(await this.confirm({ name }))) {
      return
    }
    const row = button.closest("li")
    const next = (
      row?.nextElementSibling ?? row?.previousElementSibling
    )?.querySelector("button")
    const target = next ?? this.reset()?.nativeElement
    target?.focus()
    this.projects.set(this.projects().filter((project) => project !== name))
  }

  payloadOf(state: { payload?: unknown }) {
    return state.payload as { name: string } | undefined
  }
}

export { Example }
