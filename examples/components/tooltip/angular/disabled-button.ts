import { Component, computed, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [Field, FieldLabel, Input, Tooltip, TooltipContent, TooltipTrigger],
  template: `
    <div data-slot="stack">
      <div uiField>
        <label uiFieldLabel>Post title</label>
        <input uiInput [(value)]="title" />
      </div>
      <ng-container uiTooltip [disabled]="!blocked()">
        <button
          uiTooltipTrigger
          data-variant="solid"
          [attr.aria-disabled]="blocked() || null"
          (click)="publish()"
        >
          Publish
        </button>
        <div *uiTooltipContent="{ side: 'right' }">Add a title to publish</div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly title = signal("")

  readonly blocked = computed(() => !this.title().trim())

  publish() {
    if (!this.blocked()) {
      this.log(`Published “${this.title().trim()}”`)
    }
  }
}

export { Example }
