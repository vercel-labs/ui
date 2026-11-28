import { Component, signal } from "@angular/core"
import {
  LucideChevronRight,
  LucideFile,
  LucideFolder,
  LucideLink,
  LucideMail,
  LucideShare,
  LucideTrash,
} from "@lucide/angular"
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
    LucideFile,
    LucideFolder,
    LucideLink,
    LucideMail,
    LucideShare,
    LucideTrash,
  ],
  template: `
    <div dir="rtl" data-slot="stack">
      <ng-container uiMenu (action)="action.set($event.value)">
        <button uiMenuTrigger>ملف</button>
        <div *uiMenuContent>
          <div uiMenuItem value="new" shortcut="mod+n">
            <svg lucideFile></svg>
            جديد
          </div>
          <div uiMenuItem value="open" shortcut="mod+o">
            <svg lucideFolder></svg>
            فتح…
          </div>
          <div uiMenuSeparator></div>
          <ng-container uiMenuSub>
            <div uiMenuSubTrigger>
              <svg lucideShare></svg>
              مشاركة
              <svg lucideChevronRight></svg>
            </div>
            <div *uiMenuSubContent>
              <div uiMenuItem value="email">
                <svg lucideMail></svg>
                البريد الإلكتروني
              </div>
              <div uiMenuItem value="copy-link">
                <svg lucideLink></svg>
                نسخ الرابط
              </div>
            </div>
          </ng-container>
          <div uiMenuSeparator></div>
          <div uiMenuItem value="delete">
            <svg lucideTrash></svg>
            حذف
          </div>
        </div>
      </ng-container>
      <output data-slot="output">{{
        action() ? "نُفّذ: " + action() : "اختر عنصرًا"
      }}</output>
    </div>
  `,
})
class Example {
  readonly action = signal("")
}

export { Example }
