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
} from "@ui-sdk/angular/select"

type Side = "top" | "right" | "bottom" | "left"

type Align = "start" | "center" | "end"

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
        <ng-container
          uiSelect
          [items]="sides"
          [value]="side()"
          (beforeValueChange)="$event.value && side.set($event.value)"
        >
          <div uiSelectLabel>Side</div>
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (option of sides; track option.value) {
              <div uiSelectItem [value]="option.value">
                {{ option.label }}
                <span *uiSelectItemIndicator>
                  <svg lucideCheck></svg>
                </span>
              </div>
            }
          </div>
        </ng-container>
        <ng-container
          uiSelect
          [items]="aligns"
          [value]="align()"
          (beforeValueChange)="$event.value && align.set($event.value)"
        >
          <div uiSelectLabel>Align</div>
          <button uiSelectTrigger>
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div *uiSelectContent>
            @for (option of aligns; track option.value) {
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
      <ng-container uiPopover>
        <button uiPopoverTrigger>Delivery</button>
        <div
          *uiPopoverContent="{ side: side(), align: align(), sideOffset: 8 }"
        >
          <h2 uiPopoverTitle>Delivery window</h2>
          <p uiPopoverDescription>Arrives Tuesday between 9 AM and noon.</p>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly sides = [
    { value: "top", label: "Top" },
    { value: "right", label: "Right" },
    { value: "bottom", label: "Bottom" },
    { value: "left", label: "Left" },
  ]

  readonly aligns = [
    { value: "start", label: "Start" },
    { value: "center", label: "Center" },
    { value: "end", label: "End" },
  ]

  readonly side = signal<Side>("bottom")

  readonly align = signal<Align>("center")
}

export { Example }
