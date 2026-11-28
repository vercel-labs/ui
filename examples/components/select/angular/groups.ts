import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectGroup,
    SelectGroupLabel,
    SelectItem,
    SelectItemIndicator,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Font</label>
      <ng-container uiSelect placeholder="Select a font">
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          @for (group of fonts; track group.label; let index = $index) {
            @if (index > 0) {
              <div uiSelectSeparator></div>
            }
            <div uiSelectGroup>
              <div uiSelectGroupLabel>{{ group.label }}</div>
              @for (item of group.items; track item.value) {
                <div uiSelectItem [value]="item.value">
                  {{ item.label }}
                  <span *uiSelectItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            </div>
          }
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly fonts = [
    {
      label: "Sans serif",
      items: [
        { value: "inter", label: "Inter" },
        { value: "geist", label: "Geist" },
      ],
    },
    {
      label: "Serif",
      items: [
        { value: "source-serif", label: "Source Serif" },
        { value: "lora", label: "Lora" },
      ],
    },
    {
      label: "Monospace",
      items: [
        { value: "geist-mono", label: "Geist Mono" },
        { value: "jetbrains-mono", label: "JetBrains Mono" },
      ],
    },
  ]
}

export { Example }
