import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import { confirm } from "@ui-sdk/angular/alert-dialog"
import { OverlayHost } from "@ui-sdk/angular/overlays"

@Component({
  imports: [OverlayHost],
  template: `
    <button type="button" (click)="archive()">Archive Project</button>
    <div uiOverlayHost></div>
  `,
})
class Example {
  readonly log = useLog()

  async archive() {
    const yes = await confirm({
      title: "Archive this project?",
      description: "It moves to Archived, and you can restore it anytime.",
      confirmLabel: "Archive",
    })
    this.log(yes ? "Archived the project" : "Kept the project")
  }
}

export { Example }
