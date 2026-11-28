import { Component } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPage,
  createCommandController,
} from "@ui-sdk/angular/command"

@Component({
  imports: [Command, CommandInput, CommandItem, CommandList, CommandPage],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button type="button" (click)="palette.push('theme')">
          Open Themes
        </button>
        <button type="button" (click)="palette.pop()">Back</button>
        <button type="button" (click)="palette.setValue('dark')">
          Highlight Dark
        </button>
        <button type="button" (click)="palette.setQuery('li')">
          Search “li”
        </button>
        <button type="button" (click)="palette.run()">Run Highlighted</button>
        <button type="button" (click)="palette.focus()">Focus</button>
      </div>
      <div
        uiCommand
        [controller]="palette"
        (action)="log('Ran ' + $event.value)"
      >
        <input uiCommandInput aria-label="Search commands" />
        <div uiCommandList>
          <ng-container *uiCommandPage>
            <div uiCommandItem value="theme" page="theme">Change theme…</div>
          </ng-container>
          <ng-container *uiCommandPage="'theme'">
            @for (theme of themes; track theme.value) {
              <div uiCommandItem [value]="theme.value">
                {{ theme.label }}
              </div>
            }
          </ng-container>
        </div>
      </div>
    </div>
  `,
})
class Example {
  readonly themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]

  readonly palette = createCommandController()

  readonly log = useLog()
}

export { Example }
