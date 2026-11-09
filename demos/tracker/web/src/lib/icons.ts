import { html, nothing } from "lit-html"
import { unsafeSVG } from "lit-html/directives/unsafe-svg.js"
import {
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  CircleX,
  Columns3,
  Ellipsis,
  Inbox,
  Info,
  List,
  ListTodo,
  Minus,
  Plus,
  Search,
  Settings,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SlidersHorizontal,
  Trash2,
  X,
  type IconNode,
} from "lucide"

const icons = {
  calendar: Calendar,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  circle: Circle,
  "circle-alert": CircleAlert,
  "circle-check": CircleCheck,
  "circle-dashed": CircleDashed,
  "circle-dot": CircleDot,
  "circle-dot-dashed": CircleDotDashed,
  "circle-x": CircleX,
  columns: Columns3,
  ellipsis: Ellipsis,
  inbox: Inbox,
  info: Info,
  list: List,
  "list-todo": ListTodo,
  minus: Minus,
  plus: Plus,
  search: Search,
  settings: Settings,
  "signal-high": SignalHigh,
  "signal-low": SignalLow,
  "signal-medium": SignalMedium,
  sliders: SlidersHorizontal,
  trash: Trash2,
  x: X,
}

type IconName = keyof typeof icons

function shapes(node: IconNode) {
  return node
    .map(([tag, attributes]) => {
      const pairs = Object.entries(attributes).map(
        ([name, value]) => `${name}="${value}"`
      )
      return `<${tag} ${pairs.join(" ")}/>`
    })
    .join("")
}

const markup = Object.fromEntries(
  Object.entries(icons).map(([name, node]) => [name, shapes(node)])
) as Record<IconName, string>

function iconMarkup(name: IconName, className = "size-4") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${className}" aria-hidden="true">${markup[name]}</svg>`
}

function icon(name: IconName, className = "size-4", label?: string) {
  return html`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class=${className}
    role=${label ? "img" : nothing}
    aria-label=${label ?? nothing}
    aria-hidden=${label ? nothing : "true"}
  >
    ${unsafeSVG(markup[name])}
  </svg>`
}

export { icon, iconMarkup }
export type { IconName }
