import { Component } from "@angular/core"
import { LucideCheck, LucideChevronRight } from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { Menubar } from "@ui-sdk/angular/menubar"

@Component({
  imports: [
    Menu,
    MenuCheckboxItem,
    MenuContent,
    MenuGroupLabel,
    MenuItem,
    MenuItemIndicator,
    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
    Menubar,
    LucideCheck,
    LucideChevronRight,
  ],
  template: `
    <div uiMenubar>
      <ng-container uiMenu (action)="chose($event.value)">
        <button uiMenuTrigger>File</button>
        <div *uiMenuContent>
          <div uiMenuItem value="New document" shortcut="mod+n">
            New Document
          </div>
          <div uiMenuItem value="Open" shortcut="mod+o">Open…</div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger>
              Open Recent
              <svg lucideChevronRight></svg>
            </div>
            <div *uiMenuSubContent>
              @for (name of recent; track name) {
                <div uiMenuItem [value]="name">{{ name }}</div>
              }
            </div>
          </ng-container>
          <div uiMenuSeparator></div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger>
              Export
              <svg lucideChevronRight></svg>
            </div>
            <div *uiMenuSubContent>
              @for (format of formats; track format) {
                <div uiMenuItem [value]="\`Export as \${format}\`">
                  {{ format }}
                </div>
              }
            </div>
          </ng-container>
          <div uiMenuItem value="Print" shortcut="mod+p">Print…</div>
        </div>
      </ng-container>
      <ng-container uiMenu (action)="chose($event.value)">
        <button uiMenuTrigger>Edit</button>
        <div *uiMenuContent>
          <div uiMenuItem value="Undo" shortcut="mod+z" disabled>Undo</div>
          <div uiMenuItem value="Redo" shortcut="mod+shift+z">Redo</div>
          <div uiMenuSeparator></div>
          <div uiMenuItem value="Cut" shortcut="mod+x">Cut</div>
          <div uiMenuItem value="Copy" shortcut="mod+c">Copy</div>
          <div uiMenuItem value="Paste" shortcut="mod+v">Paste</div>
          <div uiMenuSeparator></div>
          <div uiMenuItem value="Find" shortcut="mod+f">Find…</div>
        </div>
      </ng-container>
      <ng-container
        uiMenu
        (checkedChange)="
          log($event.value + ' ' + ($event.checked ? 'on' : 'off'))
        "
        (valueChange)="log($event.value + ' appearance')"
      >
        <button uiMenuTrigger>View</button>
        <div *uiMenuContent>
          <div uiMenuCheckboxItem value="Ruler">
            <span *uiMenuItemIndicator>
              <svg lucideCheck></svg>
            </span>
            Show Ruler
          </div>
          <div uiMenuCheckboxItem value="Word count" defaultChecked>
            <span *uiMenuItemIndicator>
              <svg lucideCheck></svg>
            </span>
            Show Word Count
          </div>
          <div uiMenuSeparator></div>
          <div uiMenuRadioGroup defaultValue="System">
            <div uiMenuGroupLabel>Appearance</div>
            @for (appearance of appearances; track appearance) {
              <div uiMenuRadioItem [value]="appearance">
                <span *uiMenuItemIndicator></span>
                {{ appearance }}
              </div>
            }
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly recent = ["Q3 roadmap", "Launch checklist", "Offsite notes"]

  readonly formats = ["PDF", "Markdown", "HTML"]

  readonly appearances = ["Light", "Dark", "System"]

  readonly log = useLog()

  readonly chose = (value: string) => this.log(`Chose ${value}`)
}

export { Example }
