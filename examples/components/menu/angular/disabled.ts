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
    LucideCheck,
    LucideChevronRight,
  ],
  template: `
    <div data-slot="row">
      <ng-container uiMenu (action)="log('Chose ' + $event.value)">
        <button uiMenuTrigger>Document</button>
        <div *uiMenuContent>
          <div uiMenuItem value="undo" shortcut="mod+z" disabled>Undo</div>
          <div uiMenuItem value="redo" shortcut="mod+shift+z">Redo</div>
          <div uiMenuSeparator></div>
          <div uiMenuCheckboxItem value="autosave" defaultChecked disabled>
            <span *uiMenuItemIndicator>
              <svg lucideCheck></svg>
            </span>
            Autosave
          </div>
          <div uiMenuSeparator></div>
          <div uiMenuRadioGroup defaultValue="pdf">
            <div uiMenuGroupLabel>Export as</div>
            <div uiMenuRadioItem value="pdf">
              <span *uiMenuItemIndicator>
                <svg lucideCheck></svg>
              </span>
              PDF
            </div>
            <div uiMenuRadioItem value="docx" disabled>
              <span *uiMenuItemIndicator>
                <svg lucideCheck></svg>
              </span>
              Word
            </div>
            <div uiMenuRadioItem value="markdown">
              <span *uiMenuItemIndicator>
                <svg lucideCheck></svg>
              </span>
              Markdown
            </div>
          </div>
          <div uiMenuSeparator></div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger disabled>
              Move to
              <svg lucideChevronRight></svg>
            </div>
            <div *uiMenuSubContent>
              <div uiMenuItem>Archive</div>
            </div>
          </ng-container>
        </div>
      </ng-container>
      <ng-container uiMenu>
        <button uiMenuTrigger disabled>Locked</button>
        <div *uiMenuContent>
          <div uiMenuItem>Unlock</div>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
