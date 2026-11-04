import "@ui-sdk/web/checkbox"
import "@ui-sdk/web/field"
import { Check, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack" dir="rtl">
      <ui-field>
        <ui-field-label>الاسم على البطاقة</ui-field-label>
        <input name="card-name" autocomplete="cc-name" placeholder="ليلى حسن" />
      </ui-field>
      <ui-field>
        <ui-field-label>رقم البطاقة</ui-field-label>
        <input name="card-number" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" />
        <ui-field-description>أدخل الرقم المكون من 16 خانة.</ui-field-description>
      </ui-field>
      <ui-field>
        <ui-checkbox name="save-card" default-checked>
          <ui-checkbox-indicator>
            ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
          </ui-checkbox-indicator>
        </ui-checkbox>
        <ui-field-label>احفظ البطاقة للمدفوعات القادمة</ui-field-label>
      </ui-field>
    </div>
  `
}

export { mount }
