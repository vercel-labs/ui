import { Component } from "@angular/core"
import { LucideEllipsis } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  createMenuController,
  Menu,
  MenuContent,
  type MenuContentState,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/angular/menu"

type File = { name: string; size: string }

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuGroup,
    MenuGroupLabel,
    MenuItem,
    MenuSeparator,
    MenuTrigger,
    LucideEllipsis,
  ],
  template: `
    <div data-slot="stack">
      <div data-slot="controls">
        <button (click)="openFirst($event)">
          Open {{ files[0].name }} Actions
        </button>
      </div>
      <ul data-slot="list">
        @for (file of files; track file.name) {
          <li data-slot="row">
            {{ file.name }}
            <span data-slot="hint">{{ file.size }}</span>
            <button
              uiMenuTrigger
              [controller]="menu"
              [payload]="file"
              [attr.aria-label]="\`Actions for \${file.name}\`"
              data-variant="ghost"
              data-size="sm"
            >
              <svg lucideEllipsis></svg>
            </button>
          </li>
        }
      </ul>
      <ng-container
        uiMenu
        [controller]="menu"
        (action)="log($event.value + ' ' + menu.getPayload()?.name)"
      >
        <div *uiMenuContent="{ align: 'end' }; let content">
          <div uiMenuGroup>
            <div uiMenuGroupLabel>{{ payloadOf(content)?.name }}</div>
            <div uiMenuItem value="open">Open</div>
            <div uiMenuItem value="rename">Rename</div>
            <div uiMenuItem value="duplicate">Duplicate</div>
          </div>
          <div uiMenuSeparator></div>
          <div uiMenuItem value="delete">Delete</div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly files: File[] = [
    { name: "Roadmap.pdf", size: "2.4 MB" },
    { name: "Budget.xlsx", size: "860 KB" },
    { name: "Team photo.jpg", size: "5.1 MB" },
  ]

  readonly menu = createMenuController<File>()

  readonly log = useLog()

  async openFirst(event: MouseEvent) {
    const result = await this.menu.open({
      payload: this.files[0],
      anchor: event.currentTarget as HTMLElement,
    })
    this.log(`Closed with ${result.reason}`)
  }

  payloadOf(state: { payload?: unknown }) {
    return state.payload as File | undefined
  }
}

export { Example }
