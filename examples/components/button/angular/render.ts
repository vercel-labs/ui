import { Component } from "@angular/core"
import { Button } from "@ui-sdk/angular/button"
import { useLog } from "../../../shared/angular/log"

@Component({
  imports: [Button],
  template: `
    <div data-slot="stack">
      <button uiButton #button="uiButton" (action)="$event.waitUntil(save())">
        {{
          button.state().pending
            ? "Saving…"
            : button.state().error
              ? "Try Again"
              : "Save Changes"
        }}
      </button>
    </div>
  `,
})
class Example {
  readonly log = useLog()

  async save() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    this.log("Couldn't save. Check your connection and try again.")
    throw new Error("Couldn't save")
  }
}

export { Example }
