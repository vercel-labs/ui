import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"
import { createSwitchController } from "@ui-sdk/core/switch"

@Component({
  imports: [Switch, SwitchThumb],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="wifi.toggle()">Toggle</button>
      </div>
      <label data-slot="label">
        Wi-Fi
        <button
          uiSwitch
          [(checked)]="checked"
          (beforeCheckedChange)="
            log(($event.value ? 'On' : 'Off') + ' (' + $event.reason + ')')
          "
          [controller]="wifi"
        >
          <span uiSwitchThumb></span>
        </button>
      </label>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  readonly wifi = createSwitchController()

  readonly checked = signal(true)
}

export { Example }
