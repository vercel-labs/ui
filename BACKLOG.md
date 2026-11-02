# Backlog

Open work, bugs and ideas. Add what you find; delete what lands.

- **React token input renders a custom token's label twice.** In `examples/token-input/react/deletion.tsx`, `renderToken` returns `<TokenInputToken>@{token.label}</TokenInputToken>`, and the host keeps the default label next to it, so the editor reads "routes.ts@routes.ts". Web and Svelte render it once.
- **A press on a control under a closing popup is lost.** In the core Popups page's options example, the cart popup overlaps the checkbox row while it fades out. A click on the Modal checkbox during that exit doesn't toggle it, even with `pointer-events: none` on `[data-ending-style]`: a capture listener prevents the `pointerdown`, so no click fires. Once the exit ends it works. The spec waits for the popup to hide; decide whether core should still block presses over a popup that is already closing.
- **Bug: web select items can't match object values.** A `ui-select-item` always holds its `value` as the attribute string, so `isItemEqualToValue` never matches a value object; the web object-values example matches through `itemToValue` instead. Fix in `packages/web` (item `value` as a property) or core.
- **Bug: web select trigger `data-slot` lands on the inner button.** `select.css` selectors keyed on the trigger's slot miss on web (clearable, positioning). Fix in `packages/web` or by loosening the selectors.
- **Bug: web virtualized select renders only if `items` is set before `<ui-select-list>` is inserted.** Fix in `packages/web/src/list.ts`. Likely also why "every select example works in web-components" times out on a detached trigger.
- **Bug: a web number input or date picker in a disabled field still submits.** `ui-field disabled` only disables the inner `<input>`; the step buttons stay enabled. Token input has the fix to copy (`packages/web/src/token-input.ts` options, and the submit guard in `token-input-parts.ts`).
- **Bug: a tooltip opened by keyboard closes and reopens when its controlled example's Open checkbox is pressed.** The `focusout` target is the trigger and the checkbox is only `relatedTarget`, so the controls-row cancel misses it. Fix with a public way to treat elements as inside a popup for dismissal (core has `PopupRules.contains` internally).
- **Idea: `renderToast(toast, el, state)` on web.** Rerun when `index`, `front`, `expanded` or `leaving` changes, so a custom web toast can set `inert` on toasts behind a collapsed stack like the other frameworks. Public API change; discuss first.
- **Bug: web tree link rows get no focus ring.** `tree.css` misses labels rendered as children.
- **Bugs: trigger menu on web and Vue.** Web `container` creates a second content that positioning drops; web's `select` event clashes with the native event; Vue nested `#render` slots break FieldControl.
- **Docs: about 60 public props have no example or snippet**, plus `debug` on every component. `tests/docs/props.spec.ts` lists them (it isn't run in CI). Add snippets or allow them with a reason.
- **Idea: a menubar item without a menu.** A Menubar only holds Menus, so a top-level Help or Search entry that runs an action or follows a link has no part. A plain button inside the bar skips the arrow keys and takes its own tab stop, and a trigger with no content still announces `aria-haspopup="menu"`. The WAI-ARIA menubar pattern allows such items: a `MenubarItem` would join the roving tab stop and arrow keys, render `role="menuitem"` without `aria-haspopup`, run `onSelect` or render as a link, and close an open menu when focus reaches it. Public API: needs sign-off.

## Date Input and Time Input

- Time zones: a value with an offset, or one zoned to a place, beside the local values both inputs take now.
- Calendars other than the Gregorian one, and the locale's own digits.
- A range: two date inputs that read as one start and end.
- Date Picker with a segmented input in place of its text input.
