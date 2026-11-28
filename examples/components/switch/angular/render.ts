import { Component } from "@angular/core"
import { LucideMoon, LucideSun } from "@lucide/angular"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"

@Component({
  imports: [Switch, SwitchThumb, LucideMoon, LucideSun],
  template: `
    <label data-slot="label">
      Dark mode
      <button uiSwitch #darkMode="uiSwitch">
        <span uiSwitchThumb>
          @if (darkMode.state().checked) {
            <svg lucideMoon></svg>
          } @else {
            <svg lucideSun></svg>
          }
        </span>
      </button>
    </label>
  `,
})
class Example {}

export { Example }
