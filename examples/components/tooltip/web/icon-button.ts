import "@ui-sdk/web/tooltip"
import { Bold, createElement, Italic, Share2, Underline } from "lucide"

const formats = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      ${formats
        .map(
          (format) => `
        <ui-tooltip>
          <ui-tooltip-trigger><button>${createElement(format.icon, { "aria-hidden": "true" }).outerHTML}</button></ui-tooltip-trigger>
          <ui-tooltip-content>${format.label}</ui-tooltip-content>
        </ui-tooltip>`,
        )
        .join("")}
      <ui-tooltip type="label">
        <ui-tooltip-trigger><button>¶</button></ui-tooltip-trigger>
        <ui-tooltip-content>Show formatting marks</ui-tooltip-content>
      </ui-tooltip>
      <ui-tooltip>
        <ui-tooltip-trigger><button>${createElement(Share2, { "aria-hidden": "true" }).outerHTML}Share</button></ui-tooltip-trigger>
        <ui-tooltip-content>Anyone with the link can view</ui-tooltip-content>
      </ui-tooltip>
    </div>
  `
}

export { mount }
