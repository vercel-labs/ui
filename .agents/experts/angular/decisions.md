# Angular expert: decisions

What's already decided about `@ui-sdk/angular`, and what's known and open. The expert never re-raises a **Settled** item as a finding.

Last reviewed: 2026-11-24, the whole adapter with its examples, docs and fixtures, at `a6176868` plus the fixes that review asked for.

## Settled

- **Directives on your own elements**, not components that render an element for you: `<button uiTabsTab value="a">`. Classes keep the names every framework uses (`TabsTab`), with selector `ui` plus the name and the same `exportAs`. No `render`, no `createParts`.
- **Angular 21 and 22.** Nothing older.
- **Props are signal inputs.** A controlled key is a plain `input()` with an `output()` named `<key>Change`, which `[(value)]` binds. Bound means controlled. Never `model()`: core decides the value.
- **A change is two outputs.** `(valueChange)` emits the value. `(beforeValueChange)` emits it with the reason and `cancel()`. Every other callback is one output, core's name without `on`, and `(action)` emits `{ source, event, waitUntil() }`.
- **State is read from a template reference**: `#tab="uiTabsTab"`, then `tab.state()`.
- **Presence has two forms.** A plain attribute keeps the element in the page with `hidden`. The star form, `*uiDialogContent` or `*uiTabsPanel="'account'"`, renders it only while it's present.
- **Custom parts** call `usePrimitive(primitive, () => options)` and `usePart(handle, slot, () => props)` in field initializers.
- **Core writes a part's attributes and binds its element**, outside change detection, as it does for web components. Host bindings would render a frame late and couldn't be in a star part's element.
- **Server references point at the part a component expects.** Until the root or trigger binds, an open Collapsible points at its panel, a Progress or Meter at its label and a Timeline item at its title, so server HTML names them. A part left out dangles until binding drops it; accname falls back to `aria-label` meanwhile (#517, #524, #506).
- **Form component dropped.**
- **Every component is `OnPush`.** Their templates read signals only, so an app with Zone.js checks them when something they read changes, not on every event.
- **Value roots take `Value extends string = string`**: Tabs, Accordion, RadioGroup, CheckboxGroup, ToggleGroup, SegmentedControl and MenuRadioGroup, inferred from `[value]`, so `(valueChange)` emits the app's own union. Children aren't checked against it.
- **A star part that has `state` types its `let`** with `ngTemplateContextGuard`.
- **Core's `href` gets Angular's URL check** in `use-primitive.ts`, since Angular never sees an attribute core writes.
- **CSP nonce**: a page sets it with `<meta property="csp-nonce" nonce="…">`. A tag with no nonce switches injected styles to constructed sheets, and the page declares `@layer ui-sdk;` first.
- **Popups flip to the opposite side only**, never to a perpendicular one.
- **`tests/specs/position.spec.ts` runs once per engine**, on `react` in Chromium and `web` elsewhere: the placement math is core's and doesn't depend on the framework.
- **A half-typed date reads `null`.** Writing `null` back leaves its segments, so a controlled value can't empty them; `clear()` does. Same in every framework.
- **`web.css` lets parts inherit the page's font**, and its colors follow the page's `color-scheme` through `light-dark()`.
- **Button-like parts render `type`, `disabled` and `aria-disabled` together until they bind**, and no role, so server HTML is right for a `<button>` and an `<a>` (PR 326).
- **Timeline's server markup holds the tab stop on the first event**, not the current one, until it hydrates.

## Known and open (don't report again, check whether fixed)

- **A closed Select or Combobox with composed items has no label for its value in server HTML.** Angular makes the items when their content renders, which a closed popup's hasn't. `items` or `itemToLabel` gives the server the label (`select.ssr.spec.ts`, `combobox.ssr.spec.ts` skip the check).
- **A Toolbar's server tab stop goes to the first item Angular makes**, so items in an `@for` lose it to one written after them. Hydration moves it to the first in the page (`toolbar.ssr.spec.ts` skips the check).
- **`*uiAccordionPanel` and `*uiCollapsiblePanel` take no star object**, so `keepMounted` can't be set in the star form. The plain attribute form takes it.
- **An output can't be written on a star part.** It lands on the element inside the template. The long form, `<ng-template uiComboboxCreate (create)="…">`, takes it.
- **`uiOverlayHost` takes no template for its toasts.** A placed `uiToastRegion` with the same toaster renders your own (`toast.host.spec.ts` skips the fixture's class check).
- **No test or fixture runs with Zone.js.** They all mount without it. The unit suite passed by hand under `provideZoneChangeDetection()`; a suite in the repo needs `zone.js` as a dev dependency.
- **Angular's forms package isn't wired up.** No part is a `ControlValueAccessor`, so `formControlName` and `ngModel` don't reach a Checkbox, Select or Slider, and nothing was run against Reactive Forms or Signal Forms. `[(value)]` and a native `<form>` work. A `@ui-sdk/angular/forms` entry is a new entry and a new peer, so it waits on discussion.
- **Outputs named `select` and `submit` also hear the DOM events of those names.** `(select)` on `uiTriggerMenu` gets a native `select` event when text is selected in its field, and `(submit)` on `uiAutocomplete`, `uiTextarea` or `uiTokenInput` gets a form's from inside it. Menu and command items have a `select` output too. Renaming them is a public API change.
- **The class `Input` shares its name with `@angular/core`'s `Input` decorator**, so a file that imports both aliases one.
- **Server HTML selects the first tab Angular makes.** With no `value` or `defaultValue`, tabs in an `@for` followed by a static one select the static one on the server, and hydration moves the selection to the first in the page.
- **Reordering an `@for` that holds an open, portaled popup** moves the comment Angular left, and the content with it, out of the popup's container. Not run in a browser yet.
- **A static `checked` or `value` attribute is a controlled value that never changes**: `<button uiCheckbox checked>` stays checked. `defaultChecked` is the one that starts checked. A development warning would say so.
- **`uiSelectItems` and its siblings render fixed `<div>` items in their own view.** A template for the item is the ask.
- **`uiTriggerMenu` renders no popup of its own.** Other frameworks render the list when the content part is left out. Here the author writes `<div *uiTriggerMenuContent><div uiTriggerMenuList></div></div>`, and the empty list renders the items.
- **An empty `*uiTriggerMenuHint` shows nothing.** The star form is for your own content. The plain form, left empty, shows the hints.
- **`withEventReplay()` wasn't run**: a press on a trigger before hydration may be dropped.
- **`animate.leave` on a star part wasn't probed.**
- **No Angular fixture for** the agent reach, cached page, virtual list, wrapped content, kitchen sink and performance specs.
- **The packed `.d.ts` files import `./x.ts`**, which TypeScript allows in a declaration file. `pnpm check:packages` builds `scripts/package-consumers/angular` against them with Angular's compiler and strict templates.
- **Payload types**: a popup content's payload type is asserted by the user, not tied to the controller's type. In a star part's `let`, it's `unknown`.
- **A popup stays shown when its anchor is clipped by a scroll container.** A marker like `data-anchor-hidden` is a public API and waits on discussion.
- **An anchor moved by the Web Animations API** is followed by positioning's 500ms slow check, not on the next frame.
- **A submit shortcut also submits a read-only Textarea.**
- **Holding Enter submits on every key repeat** with a submit shortcut: it doesn't skip `event.repeat`.
- **`submitShortcut="enter"` leaves phones no way to add a line**: a soft keyboard has no Shift+Enter, and the textarea sets no `enterkeyhint`.

## Revisit

Nothing yet.
