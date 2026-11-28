import { Component, signal } from "@angular/core"
import { LucideCheck } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/angular/dialog"

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    LucideCheck,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <label data-slot="label">
          <button
            uiCheckbox
            [checked]="open()"
            (beforeCheckedChange)="open.set($event.value === true)"
          >
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          Open
        </label>
      </div>
      <ng-container
        uiDialog
        [(open)]="open"
        (beforeOpenChange)="
          log(($event.value ? 'Opened' : 'Closed') + ' (' + $event.reason + ')')
        "
        (openChangeComplete)="
          log($event ? 'Finished opening' : 'Finished closing')
        "
      >
        <button uiDialogTrigger>Notification Settings</button>
        <div *uiDialogBackdrop></div>
        <div *uiDialogContent>
          <div data-slot="stack">
            <h2 uiDialogTitle>Notification settings</h2>
            <p uiDialogDescription>Choose what we email you about.</p>
          </div>
          <div data-slot="stack">
            @for (topic of topics; track topic.label) {
              <label data-slot="label">
                <button uiCheckbox [defaultChecked]="topic.checked">
                  <span uiCheckboxIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </button>
                {{ topic.label }}
              </label>
            }
          </div>
          <div data-slot="row">
            <button uiDialogClose data-variant="solid">Done</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly topics = [
    { label: "Product updates", checked: true },
    { label: "Security alerts", checked: true },
    { label: "Weekly digest", checked: false },
  ]

  readonly log = useLog()

  readonly open = signal(false)
}

export { Example }
