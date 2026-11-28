import { Component, computed, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"
import { Textarea } from "@ui-sdk/angular/textarea"

type Mode = "false" | "trap-focus" | "true"

@Component({
  imports: [
    Field,
    FieldLabel,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Textarea,
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
      </div>
      <ng-container uiPopover [modal]="modal()">
        <button uiPopoverTrigger>Add Comment</button>
        <div *uiPopoverContent>
          <h2 uiPopoverTitle>Add a comment</h2>
          <p uiPopoverDescription>{{ notes[mode()] }}</p>
          <div uiField>
            <label uiFieldLabel>Comment</label>
            <textarea uiTextarea defaultValue="Looks good to me."></textarea>
          </div>
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button uiPopoverClose data-variant="solid">Comment</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly modes = [
    { value: "false", label: "Non-modal" },
    { value: "trap-focus", label: "Trap focus" },
    { value: "true", label: "Modal" },
  ]

  readonly notes = {
    false: "Tab can leave, and focus leaving closes it.",
    "trap-focus": "Tab stays inside. The page still scrolls and takes clicks.",
    true: "Tab stays inside. The page is inert and doesn't scroll.",
  }

  readonly mode = signal<Mode>("false")

  readonly modal = computed(() =>
    this.mode() === "true"
      ? true
      : this.mode() === "false"
        ? false
        : "trap-focus"
  )
}

export { Example }
