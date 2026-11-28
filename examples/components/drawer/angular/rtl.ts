import { Component } from "@angular/core"
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/angular/drawer"

@Component({
  imports: [
    Drawer,
    DrawerBackdrop,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
  ],
  template: `
    <div dir="rtl">
      <ng-container uiDrawer side="start">
        <button uiDrawerTrigger>القائمة</button>
        <div *uiDrawerBackdrop></div>
        <div *uiDrawerContent>
          <div data-slot="stack">
            <h2 uiDrawerTitle>القائمة</h2>
            <p uiDrawerDescription>اسحبها نحو حافتها لإغلاقها.</p>
          </div>
          <nav aria-label="الأقسام">
            <ul>
              @for (link of links; track link) {
                <li>
                  <a href="https://example.com">
                    {{ link }}
                  </a>
                </li>
              }
            </ul>
          </nav>
          <button uiDrawerClose data-variant="solid">إغلاق</button>
        </div>
      </ng-container>
    </div>
  `,
})
class Example {
  readonly links = ["الرئيسية", "الطلبات", "المنتجات", "العملاء", "الإعدادات"]
}

export { Example }
