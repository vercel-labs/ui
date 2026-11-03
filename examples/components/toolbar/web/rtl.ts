import "@ui-sdk/web/toolbar"
import "@ui-sdk/web/toggle"
import { Bold, createElement, Italic } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div dir="rtl">
      <ui-toolbar aria-label="تنسيق">
        <ui-toggle-group multiple aria-label="نمط النص">
          <ui-toggle value="bold">
            <button data-variant="ghost" aria-label="غامق">
              ${createElement(Bold, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-toggle>
          <ui-toggle value="italic">
            <button data-variant="ghost" aria-label="مائل">
              ${createElement(Italic, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-toggle>
        </ui-toggle-group>
        <ui-toolbar-separator></ui-toolbar-separator>
        <ui-toolbar-button>
          <button data-variant="secondary">حفظ</button>
        </ui-toolbar-button>
      </ui-toolbar>
    </div>
  `
}

export { mount }
