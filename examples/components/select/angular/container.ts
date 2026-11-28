import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
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
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Font</label>
        <ng-container uiSelect [container]="container" defaultValue="inter">
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (font of fonts; track font.value) {
              <div uiSelectItem [value]="font.value">
                {{ font.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
      </div>
      <div #container data-slot="card"></div>
    </div>
  `,
})
class Example {
  readonly fonts = [
    { value: "inter", label: "Inter" },
    { value: "geist", label: "Geist" },
    { value: "source-serif", label: "Source Serif" },
    { value: "geist-mono", label: "Geist Mono" },
  ]
}

export { Example }
