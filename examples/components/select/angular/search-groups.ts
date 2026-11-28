import { Component } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectList,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"

@Component({
  imports: [
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectEmpty,
    SelectGroup,
    SelectGroupLabel,
    SelectInput,
    SelectItem,
    SelectItemIndicator,
    SelectItemText,
    SelectList,
    SelectTrigger,
    SelectValue,
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Country</label>
      <ng-container uiSelect placeholder="Select a country">
        <button uiSelectTrigger>
          <span uiSelectValue></span>
          <svg lucideChevronDown></svg>
        </button>
        <div *uiSelectContent>
          <input
            uiSelectInput
            aria-label="Search countries"
            placeholder="Search countries…"
          />
          <div uiSelectEmpty>No countries found.</div>
          <div uiSelectList>
            @for (group of regions; track group.label) {
              <div uiSelectGroup>
                <div uiSelectGroupLabel>{{ group.label }}</div>
                @for (item of group.items; track item.value) {
                  <div uiSelectItem [value]="item.value" [label]="item.label">
                    <span uiSelectItemText #selectItemText="uiSelectItemText">
                      @for (
                        segment of selectItemText.state().segments;
                        track index;
                        let index = $index
                      ) {
                        @if (segment.match) {
                          <b>{{ segment.text }}</b>
                        } @else {
                          <span>{{ segment.text }}</span>
                        }
                      }
                    </span>
                    <span *uiSelectItemIndicator>
                      <svg lucideCheck></svg>
                    </span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly regions = [
    {
      label: "Americas",
      items: [
        { value: "br", label: "Brazil" },
        { value: "ca", label: "Canada" },
        { value: "mx", label: "Mexico" },
      ],
    },
    {
      label: "Europe",
      items: [
        { value: "fr", label: "France" },
        { value: "de", label: "Germany" },
        { value: "es", label: "Spain" },
      ],
    },
    {
      label: "Asia Pacific",
      items: [
        { value: "au", label: "Australia" },
        { value: "jp", label: "Japan" },
        { value: "sg", label: "Singapore" },
      ],
    },
  ]
}

export { Example }
