import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

const languages = [
  { value: "ar", label: "العربية" },
  { value: "en", label: "الإنجليزية" },
  { value: "fr", label: "الفرنسية" },
  { value: "es", label: "الإسبانية" },
  { value: "de", label: "الألمانية" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div dir="rtl">
      <ui-select placeholder="اختر لغة">
        <div data-slot="stack">
          <ui-select-label>اللغة</ui-select-label>
          <ui-select-trigger>
            <button>
              <ui-select-value></ui-select-value>
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
        </div>
        <ui-select-content>
          ${languages
            .map(
              (language) => `
                <ui-select-item value="${language.value}">
                  ${language.label}
                  <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                </ui-select-item>
              `,
            )
            .join("")}
        </ui-select-content>
      </ui-select>
    </div>
  `
}
