import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
  type SelectValueChange,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Languages</label>
      <ng-container
        uiSelect
        multiple
        [defaultValue]="['en', 'ja']"
        placeholder="Select languages"
        (beforeValueChange)="onValueChange($event)"
      >
        <button uiSelectTrigger>
          <span uiSelectValue #selectValue="uiSelectValue">
            {{
              selectValue.state().placeholder
                ? "Select languages"
                : selectValue.state().labels.length > 2
                  ? selectValue.state().labels[0] +
                    " and " +
                    (selectValue.state().labels.length - 1) +
                    " more"
                  : selectValue.state().label
            }}
          </span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          @for (language of languages; track language.value) {
            <div uiSelectItem [value]="language.value">
              {{ language.label }}
              <span *uiSelectItemIndicator>
                <svg lucideCheck></svg>
              </span>
            </div>
          }
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly languages = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
    { value: "pt", label: "Portuguese" },
    { value: "es", label: "Spanish" },
  ]

  readonly log = useLog()

  onValueChange(change: SelectValueChange) {
    this.log(`value: ${JSON.stringify(change.value)}`)
  }
}

export { Example }
