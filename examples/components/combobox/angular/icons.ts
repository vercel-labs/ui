import { Component } from "@angular/core"
import {
  LucideArrowRight,
  LucideCheck,
  LucideChevronDown,
  LucideCircle,
  LucideCircleCheck,
  LucideCircleX,
} from "@lucide/angular"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIcon,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValueIcon,
} from "@ui-sdk/angular/combobox"

@Component({
  imports: [
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIcon,
    ComboboxItemIndicator,
    ComboboxItemText,
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValueIcon,
    LucideArrowRight,
    LucideCheck,
    LucideChevronDown,
    LucideCircle,
    LucideCircleCheck,
    LucideCircleX,
  ],
  template: `
    <ng-container uiCombobox>
      <div data-slot="stack">
        <label uiComboboxLabel>Status</label>
        <div #field data-slot="row">
          <span uiComboboxValueIcon></span>
          <input uiComboboxInput placeholder="Select a status" />
          <button uiComboboxTrigger aria-label="Show statuses">
            <svg lucideChevronDown></svg>
          </button>
        </div>
      </div>
      <div *uiComboboxContent="{ anchor: field }">
        <div uiComboboxEmpty>No statuses found.</div>
        <div uiComboboxList>
          <div uiComboboxItem value="backlog" label="Backlog">
            <span uiComboboxItemIcon>
              <svg lucideCircle></svg>
            </span>
            <span uiComboboxItemText></span>
            <span *uiComboboxItemIndicator>
              <svg lucideCheck></svg>
            </span>
          </div>
          <div uiComboboxItem value="in-progress" label="In progress">
            <span uiComboboxItemIcon mirror>
              <svg lucideArrowRight></svg>
            </span>
            <span uiComboboxItemText></span>
            <span *uiComboboxItemIndicator>
              <svg lucideCheck></svg>
            </span>
          </div>
          <div uiComboboxItem value="done" label="Done">
            <span uiComboboxItemIcon>
              <svg lucideCircleCheck></svg>
            </span>
            <span uiComboboxItemText></span>
            <span *uiComboboxItemIndicator>
              <svg lucideCheck></svg>
            </span>
          </div>
          <div uiComboboxItem value="canceled" label="Canceled">
            <span uiComboboxItemIcon>
              <svg lucideCircleX></svg>
            </span>
            <span uiComboboxItemText></span>
            <span *uiComboboxItemIndicator>
              <svg lucideCheck></svg>
            </span>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
class Example {}

export { Example }
