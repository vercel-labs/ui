import { Component } from "@angular/core"
import { Button } from "@ui-sdk/angular/button"

@Component({
  imports: [Button],
  template: `
    <button
      uiButton
      (action)="$event.waitUntil(wait(1500))"
      pendingAnnouncement="Saving"
    >
      Save
    </button>
  `,
})
class Example {
  wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export { Example }
