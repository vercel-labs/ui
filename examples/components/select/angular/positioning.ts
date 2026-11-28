import { Component, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import { Checkbox, CheckboxIndicator } from "@ui-sdk/angular/checkbox"
import {
  Select,
  SelectArrow,
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
    Checkbox,
    CheckboxIndicator,
    Select,
    SelectArrow,
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
        <label data-slot="label">
          <button
            uiCheckbox
            [checked]="anchored()"
            (beforeCheckedChange)="anchored.set($event.value === true)"
          >
            <span uiCheckboxIndicator>
              <svg lucideCheck></svg>
            </span>
          </button>
          Anchor to the box
        </label>
      </div>
      <div #box data-slot="card">
        <ng-container uiSelect defaultValue="inter">
          <button uiSelectTrigger aria-label="Font">
            <span uiSelectValue></span>
            <svg lucideChevronDown></svg>
          </button>
          <div
            *uiSelectContent="{
              side: side(),
              align: align(),
              sideOffset: 10,
              alignOffset: 0,
              collisionPadding: 16,
              anchor: anchored() ? box : null,
            }"
          >
            <div uiSelectArrow></div>
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

  readonly align = signal<Align>("start")

  readonly anchored = signal(false)
}

export { Example }
