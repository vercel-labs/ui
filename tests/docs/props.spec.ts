import { expect, test } from "@playwright/test"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import ts from "typescript"

// Every public prop, option, data field and state field of each component must
// appear in at least one React example, so the docs show how to use it. Names
// come from the core's exported types, so a new prop fails this test until an
// example uses it.
const repo = path.join(import.meta.dirname, "../..")

type Component = {
  // The core module, in packages/core/src/foundation or components.
  source: string
  // The examples folders, in examples/<name>/react. Components that share
  // parts, like Dialog and AlertDialog, can count each other's examples.
  examples: string | string[]
  // Exported types whose fields count as public.
  types: string[]
  // Public names no example can show, with the type they come from and why.
  allowed?: Record<string, string>
}

const components: Record<string, Component> = {
  "async-options": {
    source: "lists/async-options.ts",
    examples: ["combobox", "select", "autocomplete", "command"],
    types: ["AsyncOptionsOptions", "AsyncOptionsContext"],
  },
  shortcuts: {
    source: "page/shortcuts/shortcuts.ts",
    examples: "shortcuts",
    types: ["ShortcutOptions"],
    allowed: {
      // A popup's own shortcut needs the popup open. The Shortcuts page shows it in code.
      layer: "ShortcutOptions",
    },
  },
  toast: {
    source: "toast/toast.ts",
    examples: "toast",
    types: [
      "ToastRegionOptions",
      "ToastActionProps",
      "ToastCloseProps",
      "ToastRegionState",
      "ToastState",
      "ToastButtonState",
    ],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "ToastRegionOptions",
      // The region renders its toasts, and `children` renders each one, so reading
      // the list from state would mean rendering it a second time.
      toasts: "ToastRegionState",
      // Only changes the words of the polite pending announcement. Button's pending examples show it.
      pendingAnnouncement: "ToastRegionOptions",
    },
  },
  toaster: {
    source: "toast/toaster.ts",
    examples: "toast",
    types: ["ToastOptions", "ToastAction", "ToastCancel"],
  },
  confirm: {
    source: "dialog/dialog.ts",
    examples: "toast",
    types: ["ConfirmOptions"],
  },
  menu: {
    source: "menu/menu.ts",
    examples: "menu",
    types: [
      "MenuOptions",
      "MenuTriggerProps",
      "MenuContextTriggerProps",
      "MenuContentProps",
      "MenuItemProps",
      "MenuCheckboxItemProps",
      "MenuRadioGroupProps",
      "MenuRadioItemProps",
      "MenuSubTriggerProps",
      "MenuItemIndicatorProps",
      "MenuItemIconProps",
      "MenuDataItem",
      "MenuTriggerState",
      "MenuContextTriggerState",
      "MenuContentState",
      "MenuItemState",
      "MenuCheckboxItemState",
      "MenuRadioItemState",
      "MenuRadioGroupState",
      "MenuItemIndicatorState",
      "MenuItemIconState",
    ],
    allowed: {
      // A menu that starts open would cover the docs page as it loads. The
      // Controlled section describes it instead.
      defaultOpen: "MenuOptions",
      // The dismissal policy every popup shares. Popover's draft example shows it.
      dismissible: "MenuOptions",
      onDismissAttempt: "MenuOptions",
      // React content renders the payload from its state. The web components payload example listens for it.
      onPayloadChange: "MenuOptions",
      // Menus don't filter. Keywords come with data shared with Command.
      keywords: "MenuDataItem",
    },
  },
  popover: {
    source: "popover/popover.ts",
    examples: "popover",
    types: [
      "PopoverOptions",
      "PopoverTriggerProps",
      "PopoverContentProps",
      "PopoverShortcutProps",
      "PopoverTriggerState",
      "PopoverContentState",
      "PopoverArrowState",
      "PopoverShortcutState",
    ],
    allowed: {
      // A popover that starts open would cover the docs page as it loads.
      defaultOpen: "PopoverOptions",
      // React content renders the payload from its state. The web components payload example listens for it.
      onPayloadChange: "PopoverOptions",
    },
  },
  tooltip: {
    source: "tooltip/tooltip.ts",
    examples: "tooltip",
    types: [
      "TooltipOptions",
      "TooltipTriggerProps",
      "TooltipContentProps",
      "TooltipShortcutProps",
      "TooltipTriggerState",
      "TooltipContentState",
      "TooltipArrowState",
      "TooltipShortcutState",
    ],
    allowed: {
      // A tooltip that starts open would cover the docs page as it loads.
      defaultOpen: "TooltipOptions",
      // React content renders the payload from its state. The web components payload example listens for it.
      onPayloadChange: "TooltipOptions",
    },
  },
  "hover-card": {
    source: "hover-card/hover-card.ts",
    examples: "hover-card",
    types: [
      "HoverCardOptions",
      "HoverCardTriggerProps",
      "HoverCardContentProps",
      "HoverCardTriggerState",
      "HoverCardContentState",
      "HoverCardArrowState",
    ],
    allowed: {
      // A card that starts open would cover the docs page as it loads.
      defaultOpen: "HoverCardOptions",
      // React content renders the payload from its state. The web components payload example listens for it.
      onPayloadChange: "HoverCardOptions",
    },
  },
  "navigation-menu": {
    source: "navigation-menu/navigation-menu.ts",
    examples: "navigation-menu",
    types: [
      "NavigationMenuOptions",
      "NavigationMenuItemProps",
      "NavigationMenuTriggerProps",
      "NavigationMenuContentProps",
      "NavigationMenuLinkProps",
      "NavigationMenuViewportProps",
      "NavigationMenuState",
      "NavigationMenuListState",
      "NavigationMenuItemState",
      "NavigationMenuTriggerState",
      "NavigationMenuContentState",
      "NavigationMenuLinkState",
      "NavigationMenuViewportState",
      "NavigationMenuIndicatorState",
      "NavigationMenuLinkIconProps",
      "NavigationMenuLinkIconState",
    ],
    allowed: {
      // A panel open as the page loads would cover the docs page. The
      // Controlled section describes it instead.
      defaultValue: "NavigationMenuOptions",
    },
  },
  dialog: {
    source: "dialog/dialog.ts",
    // Dialog and AlertDialog share their parts, so each counts the other's examples.
    examples: ["dialog", "alert-dialog"],
    types: [
      "DialogOptions",
      "DialogTriggerProps",
      "DialogContentProps",
      "DialogCloseProps",
      "DialogShortcutProps",
      "DialogTriggerState",
      "DialogBackdropState",
      "DialogContentState",
      "DialogCloseState",
      "DialogShortcutState",
    ],
    allowed: {
      // A dialog that starts open would cover the docs page as it loads.
      defaultOpen: "DialogOptions",
      // React content renders the payload from its state. The docs describe the web components event.
      onPayloadChange: "DialogOptions",
      // Only changes the words of the polite pending announcement. Button's pending examples show it.
      pendingAnnouncement: "DialogOptions",
    },
  },
  "alert-dialog": {
    source: "dialog/dialog.ts",
    examples: ["alert-dialog", "dialog"],
    types: [
      "AlertDialogOptions",
      "AlertDialogTriggerProps",
      "AlertDialogContentProps",
      "AlertDialogCloseProps",
      "AlertDialogShortcutProps",
      "AlertDialogTriggerState",
      "AlertDialogBackdropState",
      "AlertDialogContentState",
      "AlertDialogCloseState",
      "AlertDialogShortcutState",
    ],
    allowed: {
      // An alert dialog that starts open would cover the docs page as it loads.
      defaultOpen: "AlertDialogOptions",
      // React content renders the payload from its state. The docs describe the web components event.
      onPayloadChange: "AlertDialogOptions",
      // Only changes the words of the polite pending announcement. Button's pending examples show it.
      pendingAnnouncement: "AlertDialogOptions",
    },
  },
  drawer: {
    source: "drawer/drawer.ts",
    examples: "drawer",
    types: [
      "DrawerOptions",
      "DrawerContentProps",
      "DrawerOutletProps",
      "DrawerContentState",
      "DrawerBackdropState",
      "DrawerHandleState",
      "DrawerOutletState",
    ],
    allowed: {
      // A drawer that starts open would cover the docs page as it loads.
      defaultOpen: "DrawerOptions",
      // React content renders the payload from its state. The docs describe the web components event.
      onPayloadChange: "DrawerOptions",
      // Only changes the words of the polite pending announcement. Button's pending examples show it.
      pendingAnnouncement: "DrawerOptions",
    },
  },
  select: {
    source: "select/select.ts",
    examples: "select",
    types: [
      "SelectOptions",
      "SelectTriggerProps",
      "SelectValueProps",
      "SelectContentProps",
      "SelectItemProps",
      "SelectItemIndicatorProps",
      "SelectClearProps",
      "ListItem",
      "SelectTriggerState",
      "SelectValueState",
      "SelectContentState",
      "SelectItemState",
      "SelectItemIndicatorState",
      "SelectClearState",
      "SelectArrowState",
      "SelectInputState",
      "SelectEmptyState",
      "SelectStatusState",
      "SelectItemTextState",
      "SelectSelectAllState",
      "SelectItemIconProps",
      "SelectItemIconState",
    ],
    allowed: {
      // A select that starts open would cover the docs page as it loads.
      defaultOpen: "SelectOptions",
      // The dismissal policy every popup shares. Popover's draft example shows it.
      dismissible: "SelectOptions",
      onDismissAttempt: "SelectOptions",
      // Closing the list empties the search, so a starting text only shows on the first open.
      defaultQuery: "SelectOptions",
      // Select typeahead matches labels only. Keywords filter comboboxes.
      keywords: "ListItem",
    },
  },
  combobox: {
    source: "combobox/combobox.ts",
    examples: "combobox",
    types: [
      "ComboboxOptions",
      "ComboboxContentProps",
      "ComboboxItemProps",
      "ComboboxCreateProps",
      "ComboboxChipProps",
      "ComboboxClearProps",
      "ComboboxItemIndicatorProps",
      "ListItem",
      "ComboboxInputState",
      "ComboboxTriggerState",
      "ComboboxContentState",
      "ComboboxItemState",
      "ComboboxItemIndicatorState",
      "ComboboxCreateState",
      "ComboboxEmptyState",
      "ComboboxStatusState",
      "ComboboxChipState",
      "ComboboxClearState",
      "ComboboxValueState",
      "ComboboxArrowState",
      "ComboboxValueProps",
      "ComboboxItemTextState",
      "ComboboxSelectAllState",
      "ComboboxChipsOverflowState",
      "ComboboxItemIconProps",
      "ComboboxItemIconState",
    ],
    allowed: {
      // A combobox that starts open would cover the docs page as it loads.
      defaultOpen: "ComboboxOptions",
      // The dismissal policy every popup shares. Popover's draft example shows it.
      dismissible: "ComboboxOptions",
      onDismissAttempt: "ComboboxOptions",
    },
  },
  command: {
    source: "command/command.ts",
    examples: "command",
    types: [
      "CommandOptions",
      "CommandItemProps",
      "CommandPageProps",
      "CommandShortcutProps",
      "CommandDataItem",
      "CommandState",
      "CommandInputState",
      "CommandListState",
      "CommandItemState",
      "CommandEmptyState",
      "CommandStatusState",
      "CommandShortcutState",
      "CommandItemTextState",
      "CommandItemIconProps",
      "CommandItemIconState",
    ],
  },
  autocomplete: {
    source: "autocomplete/autocomplete.ts",
    examples: "autocomplete",
    types: [
      "AutocompleteOptions",
      "AutocompleteContentProps",
      "AutocompleteItemProps",
      "AutocompleteClearProps",
      "ListItem",
      "AutocompleteInputState",
      "AutocompleteTriggerState",
      "AutocompleteContentState",
      "AutocompleteItemState",
      "AutocompleteEmptyState",
      "AutocompleteStatusState",
      "AutocompleteClearState",
      "AutocompleteArrowState",
      "AutocompleteItemTextState",
      "AutocompleteItemIconProps",
      "AutocompleteItemIconState",
    ],
    allowed: {
      // Suggestions that start open would cover the docs page as it loads.
      defaultOpen: "AutocompleteOptions",
      // The dismissal policy every popup shares. Popover's draft example shows it.
      dismissible: "AutocompleteOptions",
      onDismissAttempt: "AutocompleteOptions",
    },
  },
  "trigger-menu": {
    source: "trigger-menu/trigger-menu.ts",
    examples: "trigger-menu",
    types: [
      "TriggerMenuOptions",
      "TriggerMenuContentProps",
      "TriggerMenuItemProps",
      "TriggerDefinition",
      "TriggerMenuDataItem",
      "TriggerArgument",
      "TriggerMenuInputState",
      "TriggerMenuContentState",
      "TriggerMenuItemState",
      "TriggerMenuEmptyState",
      "TriggerMenuStatusState",
      "TriggerMenuHintState",
      "TriggerMenuItemIconProps",
      "TriggerMenuItemIconState",
    ],
    allowed: {
      // The dismissal policy every popup shares. Popover's draft example shows it.
      dismissible: "TriggerMenuOptions",
      onDismissAttempt: "TriggerMenuOptions",
    },
  },
  "token-input": {
    source: "token-input/token-input.ts",
    examples: "token-input",
    types: [
      "TokenInputOptions",
      "TokenInputEditorProps",
      "HistoryOptions",
      "TokenInputEditorState",
      "TokenInputTokenState",
    ],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "TokenInputOptions",
    },
  },
  tabs: {
    source: "tabs/tabs.ts",
    examples: "tabs",
    types: [
      "TabsOptions",
      "TabsTabProps",
      "TabsPanelProps",
      "TabsState",
      "TabsListState",
      "TabsTabState",
      "TabsPanelState",
      "TabsIndicatorState",
      "TabsTabIconProps",
      "TabsTabIconState",
    ],
  },
  accordion: {
    source: "accordion/accordion.ts",
    examples: "accordion",
    types: [
      "AccordionOptions",
      "AccordionItemProps",
      "AccordionHeaderProps",
      "AccordionTriggerProps",
      "AccordionPanelProps",
      "AccordionState",
      "AccordionItemState",
      "AccordionHeaderState",
      "AccordionTriggerState",
      "AccordionPanelState",
    ],
  },
  collapsible: {
    source: "collapsible/collapsible.ts",
    examples: "collapsible",
    types: [
      "CollapsibleOptions",
      "CollapsibleTriggerProps",
      "CollapsiblePanelProps",
      "CollapsibleState",
      "CollapsibleTriggerState",
      "CollapsiblePanelState",
    ],
  },
  checkbox: {
    source: "checkbox/checkbox.ts",
    examples: "checkbox",
    types: ["CheckboxOptions", "CheckboxIndicatorProps", "CheckboxState", "CheckboxIndicatorState"],
  },
  switch: {
    source: "switch/switch.ts",
    examples: "switch",
    types: ["SwitchOptions", "SwitchState", "SwitchThumbState"],
  },
  button: {
    source: "button/button.ts",
    examples: "button",
    types: ["ButtonOptions", "ButtonState"],
    allowed: {
      // Console logging is covered by core tests and the shared State and Events guide.
      debug: "ButtonOptions",
    },
  },
  toggle: {
    source: "toggle/toggle.ts",
    examples: "toggle",
    types: ["ToggleOptions", "ToggleState", "ToggleIconProps", "ToggleIconState"],
  },
  "toggle group": {
    source: "toggle/toggle-group.ts",
    examples: "toggle",
    types: ["ToggleGroupOptions", "ToggleGroupState"],
  },
  toolbar: {
    source: "toolbar/toolbar.ts",
    examples: "toolbar",
    types: [
      "ToolbarOptions",
      "ToolbarButtonProps",
      "ToolbarInputProps",
      "ToolbarGroupProps",
      "ToolbarState",
      "ToolbarButtonState",
      "ToolbarLinkState",
      "ToolbarInputState",
      "ToolbarGroupState",
      "ToolbarSeparatorState",
    ],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "ToolbarOptions",
    },
  },
  tree: {
    source: "tree/tree.ts",
    examples: "tree",
    types: [
      "TreeOptions",
      "TreeItemProps",
      "TreeGroupProps",
      "TreeItemData",
      "TreeRow",
      "TreeState",
      "TreeItemState",
      "TreeGroupState",
    ],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "TreeOptions",
      // The tree reads a row's parent from `items`. It's there for a renderer's own use, like indent guides.
      parent: "TreeRow",
    },
  },
  menubar: {
    source: "menubar/menubar.ts",
    examples: "menubar",
    types: ["MenubarOptions", "MenubarState"],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "MenubarOptions",
    },
  },
  separator: {
    source: "separator/separator.ts",
    examples: "separator",
    types: ["SeparatorOptions", "SeparatorState"],
  },
  "checkbox group": {
    source: "checkbox/checkbox-group.ts",
    examples: "checkbox",
    types: ["CheckboxGroupOptions", "CheckboxGroupState"],
  },
  radio: {
    source: "radio/radio.ts",
    examples: "radio",
    types: [
      "RadioGroupOptions",
      "RadioProps",
      "RadioIndicatorProps",
      "RadioGroupState",
      "RadioState",
      "RadioIndicatorState",
    ],
  },
  slider: {
    source: "slider/slider.ts",
    examples: "slider",
    types: ["SliderOptions", "SliderThumbProps", "SliderState", "SliderThumbState", "SliderValueState"],
  },
  resizable: {
    source: "resizable/resizable.ts",
    examples: "resizable",
    types: [
      "ResizableOptions",
      "ResizablePanelProps",
      "ResizableHandleProps",
      "ResizableState",
      "ResizablePanelState",
      "ResizableHandleState",
    ],
  },
  avatar: {
    source: "avatar/avatar.ts",
    examples: "avatar",
    types: ["AvatarOptions", "AvatarFallbackProps", "AvatarState"],
  },
  progress: {
    source: "progress/progress.ts",
    examples: "progress",
    types: ["ProgressOptions", "ProgressState", "ProgressValueState", "GaugeLabelDetails"],
  },
  meter: {
    source: "meter/meter.ts",
    examples: "meter",
    types: ["MeterOptions", "MeterState", "MeterValueState", "MeterLabelDetails"],
  },
  "scroll-area": {
    source: "scroll-area/scroll-area.ts",
    examples: "scroll-area",
    types: [
      "ScrollAreaOptions",
      "ScrollAreaScrollbarProps",
      "ScrollAreaScrollOptions",
      "ScrollAreaState",
      "ScrollAreaScrollbarState",
      "ScrollAreaThumbState",
      "ScrollAreaScrollToEndState",
    ],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "ScrollAreaOptions",
    },
  },
  "otp-input": {
    source: "otp-input/otp-input.ts",
    examples: "otp-input",
    types: ["OTPInputOptions", "OTPInputSlotProps", "OTPInputState", "OTPInputSlotState"],
  },
  "password-input": {
    source: "password-input/password-input.ts",
    examples: "password-input",
    types: ["PasswordInputOptions", "PasswordInputState"],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "PasswordInputOptions",
    },
  },
  listbox: {
    source: "listbox/listbox-root.ts",
    examples: "listbox",
    types: [
      "ListboxOptions",
      "ListboxItemProps",
      "ListboxItemIndicatorProps",
      "ListboxState",
      "ListboxItemState",
      "ListboxItemIndicatorState",
    ],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "ListboxOptions",
    },
  },
  calendar: {
    source: "calendar/calendar.ts",
    examples: "calendar",
    types: [
      "CalendarOptions",
      "CalendarGridProps",
      "CalendarWeekdayProps",
      "CalendarDayProps",
      "CalendarState",
      "CalendarHeadingState",
      "CalendarStepState",
      "CalendarGridState",
      "CalendarWeekdayState",
      "CalendarDayState",
    ],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "CalendarOptions",
    },
  },
  "date-picker": {
    source: "date-picker/date-picker.ts",
    examples: "date-picker",
    types: [
      "DatePickerOptions",
      "DatePickerInputProps",
      "DatePickerContentProps",
      "DatePickerPresetProps",
      "DatePickerState",
      "DatePickerInputState",
      "DatePickerTriggerState",
      "DatePickerContentState",
      "DatePickerHintState",
      "DatePickerPresetState",
      "DatePickerClearState",
    ],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "DatePickerOptions",
    },
  },
  pagination: {
    source: "pagination/pagination.ts",
    examples: "pagination",
    types: [
      "PaginationOptions",
      "PaginationLinkProps",
      "PaginationState",
      "PaginationLinkState",
      "PaginationStepState",
    ],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "PaginationOptions",
    },
  },
  carousel: {
    source: "carousel/carousel.ts",
    examples: "carousel",
    types: [
      "CarouselOptions",
      "CarouselIndicatorProps",
      "CarouselControlProps",
      "CarouselState",
      "CarouselViewportState",
      "CarouselContentState",
      "CarouselItemState",
      "CarouselStepState",
      "CarouselIndicatorGroupState",
      "CarouselIndicatorState",
      "CarouselPlayToggleState",
    ],
    allowed: {
      // Logs every change to the console, which no example should do.
      debug: "CarouselOptions",
    },
  },
  "number-input": {
    source: "number-input/number-input.ts",
    examples: "number-input",
    types: [
      "NumberInputOptions",
      "NumberInputScrubAreaProps",
      "NumberInputButtonProps",
      "NumberInputState",
      "NumberInputButtonState",
    ],
  },
  field: {
    source: "field/field.ts",
    examples: "field",
    types: ["FieldOptions", "FieldErrorProps", "FieldState", "FieldErrorState"],
  },
  "field set": {
    source: "field/field-set.ts",
    examples: "field",
    types: ["FieldSetOptions", "FieldSetState"],
  },
  input: {
    source: "input/input.ts",
    // Input and Textarea share their options, so each counts the other's examples.
    examples: ["input", "textarea"],
    types: [
      "InputOptions",
      "TextareaOptions",
      "InputProps",
      "InputState",
      "InputGroupOptions",
      "InputGroupState",
    ],
  },
  "file-input": {
    source: "file-input/file-input.ts",
    examples: "file-input",
    types: [
      "FileInputOptions",
      "FileInputDropzoneProps",
      "FileInputItemProps",
      "FileInputState",
      "FileInputDropzoneState",
      "FileInputItemState",
      "FileInputItemRemoveState",
    ],
  },
}

// One program for every core module the tests read, made on first use. A
// program per module parsed the core and the DOM types again each time, and a
// worker holding dozens of them ran out of memory or time on CI.
let program: ts.Program | undefined
// Sources are named from their folder, like "toast/toast.ts", in `foundation` or `components`,
// or from core's `src` for the page's modules, like "page/shortcuts/shortcuts.ts".
const coreFile = (source: string) =>
  ["foundation", "components", "."]
    .map((folder) => path.join(repo, "packages/core/src", folder, source))
    .find((file) => existsSync(file)) ?? path.join(repo, "packages/core/src/components", source)
function moduleOf(source: string) {
  program ??= ts.createProgram(
    [...new Set(Object.values(components).map((component) => coreFile(component.source)))],
    { strict: true, noEmit: true, skipLibCheck: true },
  )
  const checker = program.getTypeChecker()
  const exports = checker.getExportsOfModule(
    checker.getSymbolAtLocation(program.getSourceFile(coreFile(source))!)!,
  )
  return { checker, exports }
}

// The names each public type exposes, without @internal ones.
function publicNames(component: Component) {
  const { checker, exports } = moduleOf(component.source)
  const names = new Map<string, string>()
  for (const typeName of component.types) {
    const symbol = exports.find((candidate) => candidate.name === typeName)
    expect(symbol, `${typeName} is exported`).toBeDefined()
    const type = checker.getDeclaredTypeOfSymbol(symbol!)
    const members = type.isUnion() ? type.types : [type]
    for (const member of members) {
      for (const property of checker.getPropertiesOfType(member)) {
        if (property.getJsDocTags(checker).some((tag) => tag.name === "internal")) continue
        if (!names.has(property.name)) names.set(property.name, typeName)
      }
    }
  }
  return names
}

// A framework's examples, and the local modules they import, without comments.
function exampleSource(folders: string | string[], framework: "react" | "solid") {
  const seen = new Set<string>()
  const read = (file: string) => {
    if (seen.has(file)) return
    seen.add(file)
    const code = readFileSync(file, "utf8")
    for (const [, specifier] of code.matchAll(/from "(\.{1,2}\/[^"]+)"/g)) {
      const base = path.resolve(path.dirname(file), specifier)
      const resolved = ["", ".ts", ".tsx"]
        .map((ext) => base + ext)
        .find((candidate) => existsSync(candidate) && statSync(candidate).isFile())
      if (resolved) read(resolved)
    }
  }
  for (const folder of [folders].flat()) {
    const examples = path.join(repo, "examples", folder, framework)
    for (const file of readdirSync(examples)) read(path.join(examples, file))
  }
  return (
    [...seen]
      .map((file) => readFileSync(file, "utf8"))
      .join("\n")
      // A block comment never follows a word character, unlike `"image/*"`.
      .replace(/(^|\W)\{?\/\*[\s\S]*?\*\/\}?/g, "$1")
      .replace(/(^|[^:"])\/\/.*$/gm, "$1")
  )
}

// A prop is used when it's passed, keyed, read from state or written as a bare
// JSX attribute, including one followed by another attribute.
function uses(code: string, name: string) {
  return new RegExp(
    `(\\b${name}\\s*[=:?]|\\.${name}\\b|[\\s{(,]${name}(?=\\s*[,})\\n>/]|\\s+[\\w-]+[=\\s>]))`,
  ).test(code)
}

// The Solid examples are ports of React's, so they show the same props. They're
// checked once every folder a component counts has them.
const hasSolidExamples = (component: Component) =>
  [component.examples].flat().every((folder) => existsSync(path.join(repo, "examples", folder, "solid")))

for (const [name, component] of Object.entries(components)) {
  const frameworks = hasSolidExamples(component) ? (["react", "solid"] as const) : (["react"] as const)
  for (const framework of frameworks)
    test(`every public ${name} prop appears in a ${framework === "react" ? "React" : "Solid"} example`, () => {
      const code = exampleSource(component.examples, framework)
      const names = publicNames(component)
      const allowed = component.allowed ?? {}
      // Catches a type that wasn't found. A field set has only two names.
      // Types that resolve to nothing would pass everything. Separator has two names.
      expect(names.size).toBeGreaterThan(1)
      // Solid spells native attributes as HTML does: `readonly` for `readOnly`.
      const used = (prop: string) =>
        uses(code, prop) || (framework === "solid" && uses(code, prop.toLowerCase()))
      const missing = [...names]
        .filter(([prop]) => !allowed[prop] && !used(prop))
        .map(([prop, typeName]) => `${typeName}.${prop}`)
      expect(missing, "props with no example").toEqual([])
      // Keep the allow list honest: a name it lists must still exist.
      for (const prop of Object.keys(allowed)) expect(names.has(prop), `${prop} is still public`).toBe(true)
    })
}

// `label` only feeds typeahead. Its docs must not promise an accessible name.
test("menu item labels are documented as typeahead text, not accessible names", () => {
  const { checker, exports } = moduleOf("menu/menu.ts")
  for (const typeName of ["MenuItemProps", "MenuCheckboxItemProps", "MenuRadioItemProps"]) {
    const type = checker.getDeclaredTypeOfSymbol(exports.find((symbol) => symbol.name === typeName)!)
    const label = checker.getPropertyOfType(type, "label")!
    const docs = ts.displayPartsToString(label.getDocumentationComment(checker))
    expect(docs, typeName).toContain("typeahead")
    expect(docs, typeName).toContain("aria-label")
    expect(docs, typeName).not.toMatch(/assistive|screen reader/i)
  }
})
