import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { FieldLegend, FieldSet } from "@ui-sdk/angular/field"
import { Switch, SwitchThumb } from "@ui-sdk/angular/switch"

@Component({
  imports: [FieldLegend, FieldSet, Switch, SwitchThumb],
  template: `
    <form data-slot="stack" (submit)="onSubmit($event)">
      <fieldset uiFieldSet>
        <legend uiFieldLegend>Email notifications</legend>
        <label data-slot="label">
          Product updates
          <button uiSwitch name="updates">
            <span uiSwitchThumb></span>
          </button>
        </label>
        <label data-slot="label">
          Security alerts
          <button uiSwitch name="security" defaultChecked>
            <span uiSwitchThumb></span>
          </button>
        </label>
        <label data-slot="label">
          Weekly digest
          <button uiSwitch name="digest" value="weekly" defaultChecked>
            <span uiSwitchThumb></span>
          </button>
        </label>
      </fieldset>
      <div data-slot="row">
        <button type="submit" data-variant="solid">Save</button>
        <button type="reset">Reset</button>
      </div>
    </form>
  `,
})
class Example {
  readonly log = useLog()

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    const entries = [
      ...new FormData(event.currentTarget as HTMLFormElement),
    ].map(([name, value]) => `${name}=${value}`)
    this.log(
      entries.length ? `Submitted ${entries.join("&")}` : "Submitted nothing"
    )
  }
}

export { Example }
