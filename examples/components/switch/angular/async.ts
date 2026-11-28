import { Component, signal } from "@angular/core"
import { LucideLoaderCircle } from "@lucide/angular"
import { createSwitchController } from "@ui-sdk/core/switch"
import {
  Switch,
  SwitchThumb,
  type SwitchCheckedChange,
} from "@ui-sdk/angular/switch"
import { useLog } from "../../../shared/angular/log"

@Component({
  imports: [Switch, SwitchThumb, LucideLoaderCircle],
  template: `
    <label data-slot="label">
      Automatic backups
      <button
        uiSwitch
        [controller]="backups"
        [attr.aria-busy]="saving()"
        (beforeCheckedChange)="onCheckedChange($event)"
      >
        <span uiSwitchThumb>
          @if (saving()) {
            <svg lucideLoaderCircle data-slot="spinner"></svg>
          }
        </span>
      </button>
    </label>
  `,
})
class Example {
  readonly log = useLog()
  readonly backups = createSwitchController()
  readonly saving = signal(false)

  onCheckedChange(change: SwitchCheckedChange) {
    if (change.reason === "imperative") {
      return
    }
    change.cancel()
    if (this.saving()) {
      return
    }
    this.saving.set(true)
    this.log("Saving…")
    const next = change.value
    setTimeout(() => {
      this.backups.setChecked(next, { reason: "imperative" })
      this.saving.set(false)
      this.log(`Saved: ${next ? "on" : "off"}`)
    }, 800)
  }
}

export { Example }
