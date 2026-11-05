# Backlog

Open work, bugs and ideas. Add what you find; delete what lands.

- **Bug: a tooltip opened by keyboard closes and reopens when its controlled example's Open checkbox is pressed.** The `focusout` target is the trigger and the checkbox is only `relatedTarget`, so the controls-row cancel misses it. Fix with a public way to treat elements as inside a popup for dismissal (core has `PopupRules.contains` internally).
- **Idea: `renderToast(toast, el, state)` on web.** Rerun when `index`, `front`, `expanded` or `leaving` changes, so a custom web toast can set `inert` on toasts behind a collapsed stack like the other frameworks. Public API change; discuss first.
- **Docs: about 60 public props have no example or snippet**, plus `debug` on every component. `tests/docs/props.spec.ts` lists them (it isn't run in CI). Add snippets or allow them with a reason.
- **Idea: a menubar item without a menu.** A Menubar only holds Menus, so a top-level Help or Search entry that runs an action or follows a link has no part. A plain button inside the bar skips the arrow keys and takes its own tab stop, and a trigger with no content still announces `aria-haspopup="menu"`. The WAI-ARIA menubar pattern allows such items: a `MenubarItem` would join the roving tab stop and arrow keys, render `role="menuitem"` without `aria-haspopup`, run `onSelect` or render as a link, and close an open menu when focus reaches it. Public API: needs sign-off.
- **Bug: a plain `<input>` moved out of a disabled `<ui-field>` stays disabled.** The field never takes back what it wrote on a control that leaves it (`disabled`, its `aria-describedby` ids, the `name` it gave). Number input, date picker and token input aren't affected; their core owns `disabled`.
- **Idea: object values for web combobox, listbox and trigger menu items.** Select's items take any value as a property and key it through the list's `keyOf` (`define-element.ts`); the others need one line each (`properties: ["value"]`).

## Date Input and Time Input

- Time zones: a value with an offset, or one zoned to a place, beside the local values both inputs take now.
- Calendars other than the Gregorian one, and the locale's own digits.
- A range: two date inputs that read as one start and end.
- Date Picker with a segmented input in place of its text input.
- Changing `hourCycle` or `granularity` while a date is half typed keeps the old clock's fields, and going back to `"day"` keeps submitting the time.
- Web components: removing the segments, as a page morph does, leaves them gone until the locale or the clock changes.
- Text typed over a server-rendered value before hydration is reset when the page hydrates. Typing into an empty segment is kept.
