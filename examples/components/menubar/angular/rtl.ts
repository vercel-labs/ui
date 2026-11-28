import { Component } from "@angular/core"
import { LucideChevronRight } from "@lucide/angular"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/angular/menu"
import { Menubar } from "@ui-sdk/angular/menubar"

@Component({
  imports: [
    Menu,
    MenuContent,
    MenuItem,
    MenuSub,
    MenuSubContent,
    MenuSubTrigger,
    MenuTrigger,
    Menubar,
    LucideChevronRight,
  ],
  template: `
    <div dir="rtl">
      <div uiMenubar>
        <ng-container uiMenu>
          <button uiMenuTrigger>ملف</button>
          <div *uiMenuContent>
            <div uiMenuItem>علامة تبويب جديدة</div>
            <ng-container uiMenuSub>
              <div uiMenuSubTrigger>
                مشاركة
                <svg lucideChevronRight></svg>
              </div>
              <div *uiMenuSubContent>
                <div uiMenuItem>البريد الإلكتروني</div>
                <div uiMenuItem>الرسائل</div>
              </div>
            </ng-container>
          </div>
        </ng-container>
        <ng-container uiMenu>
          <button uiMenuTrigger>تحرير</button>
          <div *uiMenuContent>
            <div uiMenuItem>تراجع</div>
            <div uiMenuItem>إعادة</div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
