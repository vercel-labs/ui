import { Component } from "@angular/core"
import { LucideLoaderCircle } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui-sdk/angular/command"

@Component({
  imports: [
    Command,
    CommandInput,
    CommandItem,
    CommandList,
    LucideLoaderCircle,
  ],
  template: `
    <div data-slot="stack">
      <div uiCommand>
        <input
          uiCommandInput
          aria-label="Search actions"
          placeholder="Search actions…"
        />
        <div uiCommandList>
          <div
            uiCommandItem
            #commandItem2="uiCommandItem"
            value="deploy"
            (select)="$event.waitUntil(deploy())"
          >
            Deploy to production
            @if (commandItem2.state().pending) {
              <svg lucideLoaderCircle data-slot="spinner"></svg>
            }
          </div>
          <div
            uiCommandItem
            #commandItem="uiCommandItem"
            value="sync"
            (select)="$event.waitUntil(sync())"
          >
            Sync with server
            @if (commandItem.state().pending) {
              <svg lucideLoaderCircle data-slot="spinner"></svg>
            } @else if (commandItem.state().error !== undefined) {
              <span data-slot="hint">Failed, try again</span>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly wait = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms))

  readonly log = useLog()

  async deploy() {
    await this.wait(1200)
    this.log("Deployed to production")
  }

  async sync() {
    await this.wait(600)
    this.log("Couldn't sync: offline")
    throw new Error("Offline")
  }
}

export { Example }
