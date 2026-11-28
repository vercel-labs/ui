import { Component } from "@angular/core"
import { LucideCheck, LucideSlidersHorizontal } from "@lucide/angular"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/angular/popover"

@Component({
  imports: [
    Checkbox,
    CheckboxIndicator,
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverDescription,
    PopoverTitle,
    PopoverTrigger,
    LucideCheck,
    LucideSlidersHorizontal,
  ],
  template: `
    <div data-slot="row">
      <input
        #anchor
        type="search"
        placeholder="Search files…"
        aria-label="Search files"
      />
      <ng-container uiPopover>
        <button uiPopoverTrigger aria-label="Search filters">
          <svg lucideSlidersHorizontal></svg>
        </button>
        <div
          *uiPopoverContent="{ anchor: anchor, align: 'start', sideOffset: 8 }"
        >
          <h2 uiPopoverTitle>Filters</h2>
          <p uiPopoverDescription>Show only these kinds of files.</p>
          <div data-slot="stack">
            @for (type of types; track type.label) {
              <label data-slot="label">
                <button uiCheckbox [defaultChecked]="type.checked">
                  <span uiCheckboxIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </button>
                {{ type.label }}
              </label>
            }
          </div>
          <div data-slot="row">
            <button uiPopoverClose>Cancel</button>
            <button uiPopoverClose data-variant="solid">Apply</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly types = [
    { label: "Documents", checked: true },
    { label: "Images", checked: false },
    { label: "Shared with me", checked: true },
  ]
}

export { Example }
