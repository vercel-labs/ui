import "@ui-sdk/web/field"
import "@ui-sdk/web/input"
import { Search, X, createElement } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack" dir="rtl">
      <ui-field name="name">
        <ui-field-label>الاسم الكامل</ui-field-label>
        <ui-input>
          <input placeholder="ليلى حسن" />
        </ui-input>
        <ui-field-description>كما يظهر في ملفك الشخصي.</ui-field-description>
      </ui-field>
      <ui-input-group>
        ${createElement(Search, { "aria-hidden": "true" }).outerHTML}
        <ui-input>
          <input type="search" aria-label="بحث" value="حسن" />
        </ui-input>
        <ui-input-clear>
          <button type="button" aria-label="مسح البحث">
            ${createElement(X, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-input-clear>
      </ui-input-group>
    </div>
  `
}
