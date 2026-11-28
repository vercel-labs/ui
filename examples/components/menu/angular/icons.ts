import { Component } from "@angular/core"
import {
  LucideCode,
  LucideDownload,
  LucideLink,
  LucideMail,
  LucideReply,
  LucideShare,
} from "@lucide/angular"
import { useLog } from "../../../shared/angular/log"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/angular/menu"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuItem,
    MenuItemIcon,
    MenuSeparator,
    MenuTrigger,
    LucideCode,
    LucideDownload,
    LucideLink,
    LucideMail,
    LucideReply,
    LucideShare,
  ],
  template: `
    <ng-container uiMenu (action)="log('Chose ' + $event.value)">
      <button uiMenuTrigger>
        <svg lucideShare></svg>
        Share
      </button>
      <div *uiMenuContent>
        <div uiMenuItem value="copy-link">
          <span uiMenuItemIcon>
            <svg lucideLink></svg>
          </span>
          Copy link
        </div>
        <div uiMenuItem value="email">
          <span uiMenuItemIcon>
            <svg lucideMail></svg>
          </span>
          Email
        </div>
        <div uiMenuItem value="reply">
          <span uiMenuItemIcon mirror>
            <svg lucideReply></svg>
          </span>
          Reply
        </div>
        <div uiMenuSeparator></div>
        <div uiMenuItem value="download">
          <span uiMenuItemIcon>
            <svg lucideDownload></svg>
          </span>
          Download
        </div>
        <div uiMenuItem value="embed">
          <span uiMenuItemIcon>
            <svg lucideCode></svg>
          </span>
          Embed
        </div>
      </div>
    </ng-container>
  `,
})
class Example {
  readonly log = useLog()
}

export { Example }
