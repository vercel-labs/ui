import { Component } from "@angular/core"
import {
  LucideArchive,
  LucideArrowRight,
  LucideDynamicIcon,
  LucideMail,
  LucidePencil,
  LucideStar,
} from "@lucide/angular"
import { Listbox, ListboxItem, ListboxItemIcon } from "@ui-sdk/angular/listbox"

@Component({
  imports: [Listbox, ListboxItem, ListboxItemIcon, LucideDynamicIcon],
  template: `
    <div uiListbox defaultValue="inbox" aria-label="Mailbox">
      @for (view of views; track view.value) {
        <div uiListboxItem [value]="view.value">
          <span uiListboxItemIcon [mirror]="view.icon === arrowRight">
            <svg [lucideIcon]="view.icon"></svg>
          </span>
          {{ view.label }}
        </div>
      }
    </div>
  `,
})
class Example {
  readonly views = [
    { value: "inbox", label: "Inbox", icon: LucideMail },
    { value: "starred", label: "Starred", icon: LucideStar },
    { value: "drafts", label: "Drafts", icon: LucidePencil },
    { value: "archive", label: "Archive", icon: LucideArchive },
    { value: "next", label: "Next page", icon: LucideArrowRight },
  ]

  readonly arrowRight = LucideArrowRight
}

export { Example }
