import { Component, computed, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

type Mode = "true" | "trap-focus" | "false"

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
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <ng-container
          uiSelect
          [items]="modes"
          [value]="mode()"
          (beforeValueChange)="$event.value && mode.set($event.value)"
        >
          <div uiSelectLabel>Modal</div>
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (option of modes; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
        <label data-slot="label">
          <button
            uiCheckbox
            [checked]="outside()"
            (beforeCheckedChange)="outside.set($event.value === true)"
          >
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          Close on outside press
        </label>
      </div>
      <ng-container
        uiDialog
        [modal]="modal()"
        [closeOnOutsidePress]="outside()"
      >
        <button uiDialogTrigger>Open Notes</button>
        @if (modal() === true) {
          <div *uiDialogBackdrop></div>
        }
        <div *uiDialogContent>
          <div data-slot="stack">
            <h2 uiDialogTitle>Notes</h2>
            <p uiDialogDescription>{{ notes[mode()] }}</p>
          </div>
          <textarea
            aria-label="Notes"
            value="Call the printer about the proofs."
          ></textarea>
          <div data-slot="row">
            <button uiDialogClose data-variant="solid">Done</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly modes = [
    { value: "true", label: "Modal" },
    { value: "trap-focus", label: "Trap focus" },
    { value: "false", label: "Non-modal" },
  ]

  readonly notes = {
    true: "The rest of the page is inert and doesn't scroll.",
    "trap-focus":
      "Tab stays inside, and the page still scrolls and takes clicks.",
    false:
      "The page stays usable. Tab leaves the notes, and Escape closes them while focus is inside.",
  }

  readonly mode = signal<Mode>("false")

  readonly outside = signal(false)

  readonly modal = computed(() =>
    this.mode() === "true"
      ? true
      : this.mode() === "false"
        ? false
        : "trap-focus"
  )
}

export { Example }
