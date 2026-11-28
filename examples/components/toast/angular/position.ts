import { Component, DestroyRef, inject, signal } from "@angular/core"
import { LucideCheck, LucideChevronDown } from "@lucide/angular"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"
import {
  Toast,
  ToastDescription,
  ToastRegion,
  ToastTitle,
  createToaster,
} from "@ui-sdk/angular/toast"

type Side = "top" | "bottom"

type Align = "start" | "center" | "end"

@Component({
  imports: [
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    Toast,
    ToastDescription,
    ToastRegion,
    ToastTitle,
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
      <button
        (click)="
          toast('Event created', { description: 'Friday, June 12 at 10:00 AM' })
        "
      >
        Create Event
      </button>
      <section
        uiToastRegion
        #region="uiToastRegion"
        [toaster]="toast"
        [side]="side()"
        [align]="align()"
      >
        @for (item of region.state().toasts; track item.toast.id) {
          <li [uiToast]="item.toast">
            <div data-slot="stack">
              <div uiToastTitle></div>
              <div uiToastDescription></div>
            </div>
          </li>
        }
      </section>
    </div>
  `,
})
class Example {
  readonly sides = [
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
  ]

  readonly aligns = [
    { value: "start", label: "Start" },
    { value: "center", label: "Center" },
    { value: "end", label: "End" },
  ]

  readonly toast = createToaster()

  readonly side = signal<Side>("bottom")

  readonly align = signal<Align>("end")

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.toast.dismiss()
    })
  }
}

export { Example }
