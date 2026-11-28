import { Component } from "@angular/core"
import { LucideInfo } from "@lucide/angular"
import { Field, FieldLabel } from "@ui-sdk/angular/field"
import { Input } from "@ui-sdk/angular/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"

@Component({
  imports: [
    Field,
    FieldLabel,
    Input,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    LucideInfo,
  ],
  template: `
    <div uiField>
      <label uiFieldLabel>Webhook URL</label>
      <div data-slot="row" #field>
        <input uiInput placeholder="https://" />
        <ng-container uiTooltip>
          <button uiTooltipTrigger aria-label="About webhooks">
            <svg lucideInfo></svg>
          </button>
          <div
            *uiTooltipContent="{
              anchor: field,
              side: 'bottom',
              align: 'start',
            }"
          >
            We send a POST request here for every new order.
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
