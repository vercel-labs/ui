import { dynamic, type JSX } from "@solidjs/web"
import * as lucide from "lucide"

function icon(node: lucide.IconNode) {
  const shapes = node.map(([tag, attributes]) => ({
    Shape: dynamic(() => tag, { static: true }),
    attributes,
  }))
  return (props: JSX.SvgSVGAttributes<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      {...props}
    >
      {shapes.map(({ Shape, attributes }) => (
        <Shape {...attributes} />
      ))}
    </svg>
  )
}

const CalendarIcon = icon(lucide.Calendar)
const Check = icon(lucide.Check)
const ChevronDown = icon(lucide.ChevronDown)
const ChevronLeft = icon(lucide.ChevronLeft)
const ChevronRight = icon(lucide.ChevronRight)
const Circle = icon(lucide.Circle)
const CircleAlert = icon(lucide.CircleAlert)
const CircleCheck = icon(lucide.CircleCheck)
const CircleDashed = icon(lucide.CircleDashed)
const CircleDot = icon(lucide.CircleDot)
const CircleDotDashed = icon(lucide.CircleDotDashed)
const CircleX = icon(lucide.CircleX)
const Columns3 = icon(lucide.Columns3)
const Ellipsis = icon(lucide.Ellipsis)
const Inbox = icon(lucide.Inbox)
const Info = icon(lucide.Info)
const List = icon(lucide.List)
const ListTodo = icon(lucide.ListTodo)
const Minus = icon(lucide.Minus)
const Plus = icon(lucide.Plus)
const Search = icon(lucide.Search)
const Settings = icon(lucide.Settings)
const SignalHigh = icon(lucide.SignalHigh)
const SignalLow = icon(lucide.SignalLow)
const SignalMedium = icon(lucide.SignalMedium)
const SlidersHorizontal = icon(lucide.SlidersHorizontal)
const Trash2 = icon(lucide.Trash2)
const X = icon(lucide.X)

export {
  CalendarIcon,
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
}
