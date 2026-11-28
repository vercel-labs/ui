import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { Button } from "@ui-sdk/angular/button"

@Component({
  imports: [Button],
  template: ` <button uiButton (click)="log('Pressed')">Button</button> `,
})
class Example {
  readonly log = useLog()
}

export { Example }
