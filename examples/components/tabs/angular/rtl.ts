import { Component } from "@angular/core"
import {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
} from "@ui-sdk/angular/tabs"

@Component({
  imports: [Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab],
  template: `
    <div dir="rtl">
      <div uiTabs defaultValue="account">
        <div uiTabsList aria-label="الإعدادات">
          <button uiTabsTab value="account">الحساب</button>
          <button uiTabsTab value="password">كلمة المرور</button>
          <button uiTabsTab value="notifications">الإشعارات</button>
          <span uiTabsIndicator></span>
        </div>
        <div uiTabsPanel value="account">
          عدّل اسمك وبريدك الإلكتروني وصورتك.
        </div>
        <div uiTabsPanel value="password">
          غيّر كلمة المرور وفعّل التحقق بخطوتين.
        </div>
        <div uiTabsPanel value="notifications">اختر ما نرسله إليك بالبريد.</div>
      </div>
    </div>
  `,
})
class Example {}

export { Example }
