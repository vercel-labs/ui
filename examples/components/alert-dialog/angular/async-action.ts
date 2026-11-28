import { Component } from "@angular/core"
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/angular/alert-dialog"

@Component({
  imports: [
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
  ],
  template: `
    <div data-slot="stack">
      <ng-container uiAlertDialog pendingAnnouncement="Deleting project">
        <button uiAlertDialogTrigger>Delete Project</button>
        <div *uiAlertDialogBackdrop></div>
        <div *uiAlertDialogContent>
          <div data-slot="stack">
            <h2 uiAlertDialogTitle>Delete project?</h2>
            <p uiAlertDialogDescription>
              This permanently deletes the project, its files and its deployment
              history for everyone on your team.
            </p>
          </div>
          <div data-slot="stack">
            <p data-slot="hint" role="alert">
              {{ messageOf(alertDialogClose.state().error) }}
            </p>
            <div data-slot="row">
              <button uiAlertDialogClose>Cancel</button>
              <button
                uiAlertDialogClose
                #alertDialogClose="uiAlertDialogClose"
                data-variant="solid"
                value="confirm"
                (action)="$event.waitUntil(deleteProject())"
              >
                {{
                  alertDialogClose.state().pending
                    ? "Deleting…"
                    : alertDialogClose.state().error
                      ? "Try Again"
                      : "Delete"
                }}
              </button>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  attempts = 0

  async deleteProject() {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    if (this.attempts++ === 0) {
      throw new Error("Couldn't delete the project.")
    }
  }

  messageOf(error: unknown) {
    return error instanceof Error ? error.message : ""
  }
}

export { Example }
