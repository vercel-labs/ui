import { Component } from "@angular/core"
import {
  LucideChevronRight,
  LucideDownload,
  LucideLink,
  LucideShare,
  LucideTrash,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/angular/menu"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuItem,
    MenuSeparator,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
    LucideChevronRight,
    LucideDownload,
    LucideLink,
    LucideShare,
    LucideTrash,
  ],
  template: `
    <ng-container
      uiMenu
      presentation="sheet"
      (action)="log('Chose ' + $event.value)"
    >
      <button uiMenuTrigger>Options</button>
      <div *uiMenuContent>
        <div uiMenuItem value="share">
          <svg lucideShare></svg>
          Share
        </div>
        <div uiMenuItem value="copy-link">
          <svg lucideLink></svg>
          Copy link
        </div>
        <ng-container uiMenuSub>
          <div uiMenuSubTrigger>
            <svg lucideDownload></svg>
            Move to
            <svg lucideChevronRight></svg>
          </div>
          <div *uiMenuSubContent>
            <div uiMenuItem value="inbox">Inbox</div>
            <div uiMenuItem value="archive">Archive</div>
          </div>
        </ng-container>
        <div uiMenuSeparator></div>
        <div uiMenuItem value="delete" destructive>
          <svg lucideTrash></svg>
          Delete
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
