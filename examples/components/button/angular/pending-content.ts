import { Component } from "@angular/core"
import { LucideArrowDownToLine, LucideLoaderCircle } from "@lucide/angular"
import { Button } from "@ui-sdk/angular/button"

@Component({
  imports: [Button, LucideArrowDownToLine, LucideLoaderCircle],
  template: `
    <button
      uiButton
      (action)="$event.waitUntil(wait(1500))"
      pendingAnnouncement="Saving"
    >
      <svg lucideArrowDownToLine data-show="idle"></svg>
      <svg lucideLoaderCircle data-show="pending" data-slot="spinner"></svg>
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
