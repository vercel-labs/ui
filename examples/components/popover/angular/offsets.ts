import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  Popover,
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
  type SelectValueChange,
} from "@ui-sdk/angular/select"

const choices = {
  sideOffset: { label: "Side offset", values: ["4", "8", "16", "24"] },
  alignOffset: { label: "Align offset", values: ["-16", "0", "16"] },
  collisionPadding: { label: "Collision padding", values: ["8", "24", "48"] },
}

type Name = keyof typeof choices

@Component({
  imports: [
    Popover,
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
    LucideCheck,
    LucideChevronDown,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        @for (name of names; track name) {
          <ng-container
            uiSelect
            [items]="choices[name].values"
            [value]="offsets()[name]"
            (beforeValueChange)="setOffset(name, $event)"
          >
            <div uiSelectLabel>{{ choices[name].label }}</div>
            <button uiSelectTrigger>
              <span uiSelectValue></span>
              <svg lucideChevronDown></svg>
            </button>
            <div *uiSelectContent>
              @for (value of choices[name].values; track value) {
                <div uiSelectItem [value]="value">
                  {{ value }}px
                  <span *uiSelectItemIndicator>
                    <svg lucideCheck></svg>
                  </span>
                </div>
              }
            </div>
          </ng-container>
        }
      </div>
      <ng-container uiPopover>
        <button uiPopoverTrigger>Delivery</button>
        <div
          *uiPopoverContent="{
            align: 'start',
            sideOffset: +offsets().sideOffset,
            alignOffset: +offsets().alignOffset,
            collisionPadding: +offsets().collisionPadding,
          }"
        >
          <h2 uiPopoverTitle>Delivery window</h2>
          <p uiPopoverDescription>Arrives Tuesday between 9 AM and noon.</p>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly choices = choices
  readonly names = Object.keys(choices) as Name[]
  readonly offsets = signal<Record<Name, string>>({
    sideOffset: "8",
    alignOffset: "0",
    collisionPadding: "8",
  })

  setOffset(name: Name, change: SelectValueChange) {
    const next = change.value
    if (next) {
      this.offsets.update((offsets) => ({ ...offsets, [name]: next }))
    }
  }
}

export { Example }
