import { Component, signal } from "@angular/core"
import { useLog } from "../../../shared/angular/log"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPage,
} from "@ui-sdk/angular/command"

@Component({
  imports: [Command, CommandInput, CommandItem, CommandList, CommandPage],
  template: `
    <div
      uiCommand
      [(value)]="value"
      [(query)]="query"
      [(pages)]="pages"
      (beforeValueChange)="
        log(
          'Highlighted ' +
            ($event.value ?? 'nothing') +
            ' (' +
            $event.reason +
            ')'
        )
      "
      (beforeQueryChange)="
        log('Query “' + $event.value + '” (' + $event.reason + ')')
      "
      (beforePagesChange)="
        log('Pages [' + $event.value.join(', ') + '] (' + $event.reason + ')')
      "
      (action)="log('Ran ' + $event.value)"
    >
      <input
        uiCommandInput
        aria-label="Search themes"
        placeholder="Search themes…"
      />
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
  `,
})
class Example {
  readonly themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]

  readonly log = useLog()

  readonly value = signal<string | null>("dark")

  readonly query = signal("")

  readonly pages = signal(["theme"])
}

export { Example }
