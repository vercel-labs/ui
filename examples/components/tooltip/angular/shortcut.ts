import { Component, effect } from "@angular/core"
import { LucideSave } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Tooltip,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
} from "@ui-sdk/angular/tooltip"
import { registerShortcut } from "@ui-sdk/core/shortcuts"

@Component({
  imports: [
    Tooltip,
    TooltipContent,
    TooltipShortcut,
    TooltipTrigger,
    LucideSave,
  ],
  template: `
    <div data-slot="row">
      <ng-container uiTooltip shortcut="mod+s">
        <button uiTooltipTrigger aria-label="Save" (click)="log('Saved')">
          <svg lucideSave></svg>
        </button>
        <div *uiTooltipContent>
          Save
          <kbd uiTooltipShortcut></kbd>
        </div>
      </ng-container>
      <ng-container uiTooltip shortcut="mod+shift+e">
        <button uiTooltipTrigger (click)="log('Shared')">Share</button>
        <div *uiTooltipContent>
          Share with your team
          <kbd uiTooltipShortcut></kbd>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  constructor() {
    effect((onCleanup) => {
      const offSave = registerShortcut("mod+s", () => this.log("Saved"))
      const offShare = registerShortcut("mod+shift+e", () => this.log("Shared"))
      onCleanup(() => {
        offSave()
        offShare()
      })
    })
  }
}

export { Example }
