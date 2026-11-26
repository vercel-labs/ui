import { Directive, inject, input, output } from "@angular/core"
import {
  tabs,
  type TabsController,
  type TabsValueChangeReason,
} from "@ui-sdk/core/tabs"
import { optionalBoolean } from "./inputs.ts"
import { emitChange, type Change } from "./outputs.ts"
import { useId, usePart, usePrimitive } from "./use-primitive.ts"

/**
 * What `(beforeValueChange)` emits: the value the tabs are about to take, why,
 * and `cancel()` to keep the current one.
 * @experimental
 */
type TabsValueChange = Change<string | null, TabsValueChangeReason>

/**
 * Layered sections of content, one shown at a time.
 * @experimental
 */
@Directive({ selector: "[uiTabs]", exportAs: "uiTabs" })
class Tabs {
  /** The selected tab's value. Bind it with `[(value)]` to control the tabs. `null` selects nothing. */
  readonly value = input<string | null>()
  /** The tab selected at first, when uncontrolled. Defaults to the first enabled tab. */
  readonly defaultValue = input<string | null>()
  /** Which arrow keys move between tabs: left and right, or up and down. */
  readonly orientation = input<"horizontal" | "vertical">()
  /** Whether focusing a tab selects it, or only Enter and Space do. */
  readonly activation = input<"automatic" | "manual">()
  /** Whether arrow keys wrap from the last tab to the first. */
  readonly loop = input(undefined, { transform: optionalBoolean })
  /** Keeps unselected panels in the page, where find-in-page can reach them. */
  readonly hiddenUntilFound = input(undefined, { transform: optionalBoolean })
  /** Drives the tabs from outside, made with `createTabsController()`. */
  readonly controller = input<TabsController>()
  /** The new value, after a change that wasn't canceled. */
  readonly valueChange = output<string | null>()
  /** Runs before the value changes, with the reason and `cancel()`. */
  readonly beforeValueChange = output<TabsValueChange>()

  readonly handle = usePrimitive(tabs, () => ({
    value: this.value(),
    defaultValue: this.defaultValue(),
    orientation: this.orientation(),
    activation: this.activation(),
    loop: this.loop(),
    hiddenUntilFound: this.hiddenUntilFound(),
    controller: this.controller(),
    onValueChange: emitChange(this.beforeValueChange, this.valueChange),
  }))
  /** The tabs' state, as a signal. */
  readonly state = usePart(this.handle, "root").state
}

/**
 * The row of tabs, a tablist with one tab stop and arrow keys between its tabs.
 * @experimental
 */
@Directive({ selector: "[uiTabsList]", exportAs: "uiTabsList" })
class TabsList {
  /** The list's state, as a signal. */
  readonly state = usePart(inject(Tabs).handle, "list").state
}

/**
 * A tab. Selecting it shows the panel with the same `value`.
 * @experimental
 */
@Directive({ selector: "[uiTabsTab]", exportAs: "uiTabsTab" })
class TabsTab {
  /** What this tab selects: the `value` of its panel. */
  readonly value = input.required<string>()
  /** Whether the tab can be selected. */
  readonly disabled = input(undefined, { transform: optionalBoolean })
  /** The tab's state, as a signal. */
  readonly state = usePart(inject(Tabs).handle, "tab", () => ({
    value: this.value(),
    disabled: this.disabled(),
  })).state
}

/**
 * An icon inside a tab. A tab with only an icon needs an `aria-label`. Screen readers skip it, and `mirror` flips it in right-to-left text.
 * @experimental
 */
@Directive({ selector: "[uiTabsTabIcon]", exportAs: "uiTabsTabIcon" })
class TabsTabIcon {
  /** Flips the icon horizontally in right-to-left text, for icons that point a way, like arrows and chevrons. Icons that picture a thing, like a clock or a check, stay as they are. */
  readonly mirror = input(undefined, { transform: optionalBoolean })

  readonly #id = useId()
  /** The icon's state, as a signal. */
  readonly state = usePart(inject(Tabs).handle, "tab-icon", () => ({
    id: this.#id,
    mirror: this.mirror(),
  })).state
}

/**
 * Marks the selected tab. Its box comes from the `--active-tab-*` variables, measured from the tab list.
 * @experimental
 */
@Directive({ selector: "[uiTabsIndicator]", exportAs: "uiTabsIndicator" })
class TabsIndicator {
  /** Whether it follows the tab under the pointer, and goes back to the selected one when the pointer leaves the list. */
  readonly followHover = input(undefined, { transform: optionalBoolean })

  /** The indicator's state, as a signal. */
  readonly state = usePart(inject(Tabs).handle, "indicator", () => ({
    followHover: this.followHover(),
  })).state
}

/**
 * The content of the tab with the same `value`, shown while that tab is
 * selected. `*uiTabsPanel="'account'"` renders it only while it's shown.
 * @experimental
 */
@Directive({ selector: "[uiTabsPanel]", exportAs: "uiTabsPanel" })
class TabsPanel {
  /** The `value` of the tab that shows this panel. */
  readonly value = input<string>()
  /** The same value, from the `*uiTabsPanel="'account'"` form. */
  readonly uiTabsPanel = input<string | "">()
  /** Keeps the panel in the page while its tab isn't selected. */
  readonly keepMounted = input(undefined, { transform: optionalBoolean })
  /** Keeps the panel in the page, where find-in-page can reach it. */
  readonly hiddenUntilFound = input(undefined, { transform: optionalBoolean })
  /** The panel's state, as a signal. */
  readonly state = usePart(inject(Tabs).handle, "panel", () => ({
    value: this.value() ?? (this.uiTabsPanel() as string),
    keepMounted: this.keepMounted(),
    hiddenUntilFound: this.hiddenUntilFound(),
  })).state
}

export { createTabsController } from "@ui-sdk/core/tabs"
export type {
  TabsApi,
  TabsChangeOptions,
  TabsController,
  TabsDirection,
  TabsIndicatorProps,
  TabsIndicatorState,
  TabsListState,
  TabsOptions,
  TabsOrientation,
  TabsPanelProps,
  TabsPanelState,
  TabsPrimitive,
  TabsState,
  TabsTabIconProps,
  TabsTabIconState,
  TabsTabProps,
  TabsTabState,
  TabsValueChangeReason,
} from "@ui-sdk/core/tabs"

export {
  Tabs,
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsTab,
  TabsTabIcon,
  type TabsValueChange,
}
