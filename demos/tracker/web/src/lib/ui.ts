import { cn } from "cn"
import { html, nothing, type TemplateResult } from "lit-html"
import { ref, type Ref } from "lit-html/directives/ref.js"
import { labelOf, personOf, priorityOf, statusOf, type Priority, type Status } from "tracker-data"
import { icon, type IconName } from "./icons"

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
  outline:
    "border-border bg-background hover:bg-muted data-open:bg-muted dark:bg-transparent dark:hover:bg-input/30",
  ghost: "hover:bg-muted data-open:bg-muted dark:hover:bg-muted/50",
  destructive:
    "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20",
}

const sizes = {
  default: "h-8 px-3",
  sm: "h-7 px-2.5 text-xs",
  icon: "size-8",
  "icon-sm": "size-7",
}

function button({
  variant = "secondary",
  size = "default",
}: { variant?: keyof typeof variants; size?: keyof typeof sizes } = {}) {
  return cn(
    "inline-flex shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none [&_svg:not([class*='size-'])]:size-4",
    variants[variant],
    sizes[size],
  )
}

const popupMotion =
  "origin-(--transform-origin) transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none"

const styles = {
  backdrop:
    "fixed inset-0 bg-black/30 transition-opacity duration-100 supports-backdrop-filter:backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0",
  dialog: cn(
    "fixed top-1/2 left-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-6 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none sm:max-w-md dark:ring-foreground/10",
    popupMotion,
  ),
  dialogTitle: "block text-base leading-none font-medium",
  menu: cn(
    "max-h-(--available-height) min-w-44 overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none dark:ring-foreground/10",
    popupMotion,
  ),
  menuItem:
    "group relative flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4",
  menuItemIcon: "flex text-muted-foreground group-data-highlighted:text-current",
  menuGroupLabel: "block px-2 py-1.5 text-xs font-medium text-muted-foreground",
  menuSeparator: "-mx-1 my-1 block h-px bg-border/50",
  menuDestructive: "text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive",
  popover: cn(
    "flex w-72 flex-col gap-3 rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none dark:ring-foreground/10",
    popupMotion,
  ),
  hoverCard: cn(
    "flex w-64 flex-col gap-3 rounded-3xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none dark:ring-foreground/10",
    popupMotion,
  ),
  tooltip: cn(
    "inline-flex w-fit max-w-xs items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5 text-xs text-background data-instant:transition-none",
    popupMotion,
  ),
  list: cn(
    "max-h-[min(18rem,var(--available-height))] min-w-(--anchor-width) scroll-py-1 overflow-x-hidden overflow-y-auto rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none dark:ring-foreground/10",
    popupMotion,
  ),
  option:
    "group relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-xl py-1.5 ps-2 pe-8 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  indicator: "absolute end-2 flex size-4 items-center justify-center",
  label: "block text-sm leading-none font-medium",
  control:
    "h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 text-base outline-none transition-[color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50 aria-invalid:border-destructive/50 aria-invalid:ring-3 aria-invalid:ring-destructive/15 motion-reduce:transition-none md:text-sm",
  description: "block text-sm text-muted-foreground",
  error: "block text-sm text-destructive",
  selectTrigger:
    "flex h-8 w-full min-w-0 cursor-default items-center justify-between gap-1.5 rounded-2xl border border-transparent bg-input/50 px-3 text-sm whitespace-nowrap outline-none select-none transition-[color,box-shadow] duration-200 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-placeholder:text-muted-foreground data-disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4 [&_svg]:shrink-0",
  comboboxInput:
    "h-8 w-full rounded-2xl bg-input/50 px-2.5 pe-8 outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
  comboboxTrigger:
    "group absolute end-1 top-1 inline-flex size-6 cursor-default items-center justify-center rounded-xl text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-open:bg-muted motion-reduce:transition-none",
  chips:
    "relative flex min-h-8 w-full flex-wrap items-center gap-1 rounded-2xl border border-transparent bg-input/50 bg-clip-padding py-1 ps-1 pe-8 text-sm transition-[color,box-shadow] duration-200 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30 motion-reduce:transition-none",
  chip: "flex h-5.5 w-fit items-center gap-1 rounded-2xl bg-input ps-1.5 pe-0.5 text-xs font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
  chipRemove:
    "-ms-0.5 flex size-4.5 cursor-default items-center justify-center rounded-full opacity-50 outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/30",
  empty: "block py-2 text-center text-sm text-muted-foreground empty:hidden",
  checkbox:
    "relative flex size-4 shrink-0 cursor-default items-center justify-center rounded-[5px] bg-input/90 text-primary-foreground outline-none transition-shadow after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-indeterminate:bg-primary data-disabled:opacity-50 motion-reduce:transition-none",
  radio:
    "relative flex size-4 shrink-0 cursor-default items-center justify-center rounded-full bg-input/90 outline-none transition-shadow after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-disabled:opacity-50 motion-reduce:transition-none",
  toggle:
    "inline-flex h-7 min-w-7 cursor-default items-center justify-center gap-1.5 rounded-[14px] px-1.5 text-sm font-medium text-muted-foreground outline-none select-none transition-[color,background-color,box-shadow] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs motion-reduce:transition-none dark:data-pressed:bg-input/50 [&_svg]:size-4",
}

const avatarSizes = {
  sm: "size-5 text-[10px]",
  default: "size-7 text-xs",
  lg: "size-10 text-sm",
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

function avatar(
  name: string,
  { size = "default", decorative = false } = {} as {
    size?: keyof typeof avatarSizes
    decorative?: boolean
  },
) {
  return html`<ui-avatar
    aria-hidden=${decorative ? "true" : nothing}
    class=${cn("relative flex shrink-0 rounded-full select-none", avatarSizes[size])}
  >
    <ui-avatar-fallback
      class="flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground"
    >
      <span aria-hidden="true">${initials(name)}</span>
      ${decorative ? nothing : html`<span class="sr-only">${name}</span>`}
    </ui-avatar-fallback>
  </ui-avatar>`
}

function assignee(id: string | null) {
  const person = personOf(id)
  return person ? avatar(person.name) : html`<span class="size-7 shrink-0"></span>`
}

const statusIcons: Record<Status, IconName> = {
  backlog: "circle-dashed",
  todo: "circle",
  "in-progress": "circle-dot-dashed",
  done: "circle-check",
  canceled: "circle-x",
}

const priorityIcons: Record<Priority, IconName> = {
  urgent: "circle-alert",
  high: "signal-high",
  medium: "signal-medium",
  low: "signal-low",
  none: "minus",
}

function statusIcon(status: Status, { label = false } = {}) {
  return icon(
    statusIcons[status],
    cn(
      "size-4 shrink-0 text-muted-foreground",
      status === "in-progress" && "text-amber-500",
      status === "done" && "text-emerald-600 dark:text-emerald-400",
    ),
    label ? statusOf(status).label : undefined,
  )
}

function priorityIcon(priority: Priority, { label = false } = {}) {
  return icon(
    priorityIcons[priority],
    cn("size-4 shrink-0 text-muted-foreground", priority === "urgent" && "text-destructive"),
    label ? priorityOf(priority).label : undefined,
  )
}

function issueLabels(labels: string[], className: string) {
  return html`<ul class=${className} aria-label="Labels">
    ${labels.map((id) => {
      const label = labelOf(id)
      return label
        ? html`<li>
            <span
              class="inline-flex h-5 shrink-0 items-center gap-1.5 rounded-2xl border border-border px-2 text-xs font-medium whitespace-nowrap"
            >
              <span class="size-2 rounded-full" style="background: ${label.color}"></span>
              ${label.name}
            </span>
          </li>`
        : nothing
    })}
  </ul>`
}

function checkbox({
  value,
  label,
  parent = false,
  disabled = false,
  target,
}: {
  value?: string
  label: string
  parent?: boolean
  disabled?: boolean
  target?: Ref<HTMLElement>
}) {
  return html`<ui-checkbox
    ${target ? ref(target) : nothing}
    value=${value ?? nothing}
    aria-label=${label}
    ?parent=${parent}
    ?disabled=${disabled}
    class=${styles.checkbox}
  >
    <ui-checkbox-indicator class="group grid place-content-center">
      ${icon("check", "size-3.5 group-data-indeterminate:hidden")}
      ${icon("minus", "hidden size-3.5 group-data-indeterminate:block")}
    </ui-checkbox-indicator>
  </ui-checkbox>`
}

function selectTrigger({
  icon: withIcon = false,
  className = "",
  label,
}: { icon?: boolean; className?: string; label?: string } = {}) {
  return html`<ui-select-trigger>
    <button aria-label=${label ?? nothing} class=${cn(styles.selectTrigger, className)}>
      ${withIcon ? html`<ui-select-value-icon class="flex text-muted-foreground"></ui-select-value-icon>` : nothing}
      <ui-select-value class="min-w-0 flex-1 truncate text-start"></ui-select-value>
      ${icon("chevron-down", "text-muted-foreground")}
    </button>
  </ui-select-trigger>`
}

function selectItem(value: string, content: unknown, itemIcon?: TemplateResult) {
  return html`<ui-select-item value=${value} class=${styles.option}>
    ${itemIcon ? html`<ui-select-item-icon class=${styles.menuItemIcon}>${itemIcon}</ui-select-item-icon>` : nothing}
    ${content}
    <ui-select-item-indicator class=${styles.indicator}>${icon("check")}</ui-select-item-indicator>
  </ui-select-item>`
}

function comboboxItem(value: string, label: string, content: unknown) {
  return html`<ui-combobox-item value=${value} label=${label} class=${styles.option}>
    ${content}
    <ui-combobox-item-indicator class=${styles.indicator}>${icon("check")}</ui-combobox-item-indicator>
  </ui-combobox-item>`
}

function comboboxTrigger(label: string) {
  return html`<ui-combobox-trigger>
    <button aria-label=${label} class=${styles.comboboxTrigger}>
      ${icon("chevron-down", "size-4 transition-transform group-data-open:rotate-180")}
    </button>
  </ui-combobox-trigger>`
}

function tooltip(
  trigger: TemplateResult,
  content: unknown,
  { shortcut, side }: { shortcut?: string; side?: string } = {},
) {
  return html`<ui-tooltip shortcut=${shortcut ?? nothing}>
    <ui-tooltip-trigger>${trigger}</ui-tooltip-trigger>
    <ui-tooltip-content side=${side ?? nothing} side-offset="6" class=${styles.tooltip}>
      ${content}
      ${shortcut ? html`<ui-tooltip-shortcut class="text-background/60"></ui-tooltip-shortcut>` : nothing}
    </ui-tooltip-content>
  </ui-tooltip>`
}

export {
  assignee,
  avatar,
  button,
  checkbox,
  comboboxItem,
  comboboxTrigger,
  issueLabels,
  priorityIcon,
  selectItem,
  selectTrigger,
  statusIcon,
  styles,
  tooltip,
}
