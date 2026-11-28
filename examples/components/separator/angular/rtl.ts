import { Component } from "@angular/core"
import { Separator } from "@ui-sdk/angular/separator"

@Component({
  imports: [Separator],
  template: `
    <div data-slot="stack" dir="rtl">
      <div data-slot="stack">
        <h3>الحساب</h3>
        <p data-slot="hint">إدارة ملفك الشخصي وتفضيلاتك.</p>
      </div>
      <div uiSeparator></div>
      <div data-slot="row">
        <span>الملف الشخصي</span>
        <div uiSeparator orientation="vertical"></div>
        <span>الفوترة</span>
        <div uiSeparator orientation="vertical"></div>
        <span>الإعدادات</span>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
