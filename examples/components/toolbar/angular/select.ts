import { Component, computed, signal } from "@angular/core"
import {
  LucideCheck,
  LucideChevronsUpDown,
  LucideZoomIn,
  LucideZoomOut,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/angular/select"
import { Toolbar, ToolbarButton } from "@ui-sdk/angular/toolbar"

@Component({
  imports: [
    Select,
    SelectContent,
    SelectItem,
    SelectItemIndicator,
    SelectTrigger,
    SelectValue,
    Toolbar,
    ToolbarButton,
    LucideCheck,
    LucideChevronsUpDown,
    LucideZoomIn,
    LucideZoomOut,
  ],
  template: `
    <div uiToolbar aria-label="View">
      <button
        uiToolbarButton
        aria-label="Zoom out"
        [disabled]="index() === 0"
        (click)="change(zooms[index() - 1])"
      >
        <svg lucideZoomOut></svg>
      </button>
      <ng-container
        uiSelect
        [value]="zoom()"
        (beforeValueChange)="$event.value && change($event.value)"
      >
        <button uiSelectTrigger uiToolbarButton aria-label="Zoom">
          <span uiSelectValue></span>
          <svg lucideChevronsUpDown></svg>
        </button>
        <div *uiSelectContent>
          @for (zoom of zooms; track zoom) {
            <div uiSelectItem [value]="zoom">
              {{ zoom }}
              <span *uiSelectItemIndicator>
                <svg lucideCheck></svg>
              </span>
            </div>
          }
        </div>
      </ng-container>
      <button
        uiToolbarButton
        aria-label="Zoom in"
        [disabled]="index() === zooms.length - 1"
        (click)="change(zooms[index() + 1])"
      >
        <svg lucideZoomIn></svg>
      </button>
    </div>
  `,
})
class Example {
  readonly zooms = ["50%", "75%", "100%", "150%", "200%"]

  readonly log = useLog()

  readonly zoom = signal("100%")

  readonly index = computed(() => this.zooms.indexOf(this.zoom()))

  change(value: string) {
    this.zoom.set(value)
    this.log(`Zoom ${value}`)
  }
}

export { Example }
