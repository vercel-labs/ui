# @ui-sdk/core

## 0.1.0-beta.7

### Patch Changes

- b6db62a: An agent's choice in a closed Select or Combobox now reads the option it chooses even when the option renders only while the list is open: the list opens for a moment, so a `data-agent-confirm` mark on that option asks a person first. With `items` or `emptyItems` data, the option was chosen without asking.
- c52e8ad: The Calendar and Date Picker year select labels a year below 100 as that year, not as 19xx.
- dec3e40: A click on a native label for a Combobox input, like a Field label, focuses the input and leaves the list closed, as a Select's label does. It opened the list.
- 54b7c8d: A Control-click on macOS opens a context menu at the pointer, like a right-click. It used to open as if from the keyboard, anchored to the whole area with its first item focused.
- 938e5e2: A Drawer on a touch screen puts a scroll area's own inline `overflow-y` back at its largest snap point and when it closes. It used to remove it, so a list scrolled by an inline style couldn't scroll.
- e154ead: In server-rendered HTML, the control of a Field marked `invalid` now names its first shown error in `aria-describedby`, including a `FieldError` with `match`. Every error shown at once keeps an id of its own.
- 3fbd191: With a `NavigationMenuViewport`, Tab from the last item past an open panel leaves the navigation, and the panel closes. It used to go back into the panel, so Tab could never leave.
- 5a356dc: Number Input's default small step (a tenth of `step`) no longer carries floating point noise, so Alt+ArrowUp with `step: 0.7` from 1 gives 1.05, not 1.0499999999999998.
- 76f3585: A touch drag that starts in a Resizable handle's touch hit area but beside the handle resizes and no longer scrolls the page. It used to scroll and stop after a few pixels.
- a14961e: Server-rendered HTML now names and links the parts that render after the one pointing at them: an open Collapsible's trigger has `aria-controls`, a Progress or Meter with a label has `aria-labelledby`, and a Timeline item is named by its title. Once the component binds, a part that isn't in the page is dropped again.
- 25ac95a: Tabs select the `defaultValue` tab when it binds after the others, like a tab inside Suspense or `React.lazy`. The first tab stands in until it does, unless someone picks another tab first.
- 250c9bb: A Tree builds its collection once for each new `items` or `paths` array. While a new array rendered, it rebuilt the collection several times, which slowed a reorder in a large tree.
- 217fc40: Text committed through an input method after a trigger character, like Japanese after `@`, filters a Trigger Menu. It used to leave the list unfiltered, so Enter inserted the highlighted item.
- a36290a: In React, Combobox, Autocomplete, Command, Number Input, Date Picker and Color Picker inputs keep text typed before hydration, and take it as typing when they hydrate. A field that already lost focus settles the text as a blur would.

## 0.1.0-beta.6

### Patch Changes

- 7cfedda: An agent's `setValue` is now refused on a Combobox or Select that renders its own items and shows none once open, as it already was for one whose `items` data is empty. A Combobox with `allowCustomValue` still takes the text.
- 2087c1e: The agent's `snapshot()` leaves out a toast region that holds no toasts. It lists the region once a toast is in it.
- 6531579: An Input inside an InputGroup is one component in the agent snapshot. The group was listed as a second input with only `clear`, so a step that named the field by its label was refused as ambiguous.
- 6776fc2: The agent names a component by a part of its own before its one item, as it already did with more than one. Tabs with a single tab took that tab's text as their label, where they're named by their list.
- b003f2a: The agent lists `press` for a Button rendered as a link.
- 85ff859: An agent's `press` by label works on a Button that opens a tooltip, a menu or a dialog. The press is on the Button, and a press with the text of a button inside the one popup it opens is on that popup.
- 0e80ddb: The agent now lists a toast's action and close as buttons, and presses them by their text.
- 83c1863: `checkPattern(el, "listbox")` passes the open list of a select: a list a combobox opens is reached from the combobox, so it needs no tab stop of its own, and the check no longer chooses an option there.
- 203f75c: `checkPattern` now leaves out elements hidden from screen readers, like the hidden native inputs a Radio Group or a Checkbox Group renders for forms, so those groups pass their patterns.
- 0406bb1: `checkPattern` passes read-only controls: a switch or checkbox with `aria-readonly="true"` is checked to keep its state on Space, and a read-only slider or radio group is no longer asked to change.
- a63834d: `checkPattern(el, "dialog")` passes a dialog that only traps focus, like a popover with `modal="trap-focus"`: it asks for `aria-modal="true"` when the page behind the dialog is inert, and no longer when Tab stays inside while the page stays usable.
- 4a4cfb0: Typing inside the label a Combobox shows for its value keeps the caret where it is. The first edit after a choice moved it to the end.

  A text field whose value core writes, like the Combobox input and the Password Input, is written only when its value changes. So an edit the owner of a controlled value ignores, without changing the value, stays in the field instead of being replaced by the same value.

- 9525c67: A combobox with `multiple` and `allowCustomValue` now adds the typed text on Enter while its list is kept closed.
- 7709e0c: A Date Picker with a controlled `value` now turns its calendar to a date set with `controller.setValue()`, as an uncontrolled one does.
- dfc8eae: A Drawer or Dialog opened through a controlled `open` on a phone no longer gets a `--keyboard-inset` with no keyboard open. A read taken before it rendered that shows a covered strip is measured again.
- 9fa96f9: An enter transition on something inside a part, like the path of a Checkbox indicator's icon, now starts from its `data-starting-style` pose. It used to run backwards first.
- 1a703c3: `formatFileSize` now writes sizes under 1 kB with the unit in full, like "70 bytes", where it read "70 byte".
- f64c466: `createInputHistory` leaves ArrowUp and ArrowDown to a Trigger Menu open on a textarea. It only looked for `aria-expanded`, which a textarea can't carry, so the keys brought back an earlier message while the menu was open.
- e844918: Date Input and Time Input take digits committed through an input method, and Number Input, Date Input, Time Input and Date Picker read full-width digits.
- fc6ced5: `keepFocus` moves focus to its element when focus sits on an element that was disabled or made inert, which Chrome leaves focused for a frame, or on an ancestor of the element, where Safari puts a clicked button's focus.
- c0373e4: TokenInput writes a value with a long run of backslashes without stalling the page, and `toLocale` reads a long tag in linear time.
- 2a961bc: A menu trigger rendered as something other than a button, like a badge, is now a button people can tab to.
- c705ecf: A number input with `wheel` leaves its value alone when the page canceled the wheel event, as it does for a canceled key or press.
- 0e71042: A NumberInput with a controlled `value` now commits the value that Enter or blur clamped or snapped it to. `onValueCommit` got the value from before, or didn't run.
- 33ce1e0: A NumberInput step now keeps its value when `onValueChange` moves focus out of the field. The blur asked for the old value again, which dropped the step.
- 7695b23: A Password Input removed from the page or hidden while its field has focus no longer throws from the blur that follows.
- e1ccd55: A popup whose exit has nothing to animate, like one under reduced motion, no longer keeps its closed content in memory until it opens again.
- 81488c4: A popup that mounted open, like a dialog a menu item opens, returns focus to what had it when it closes. One removed from the page while open, like a dialog rendered only while it's open, returns focus to what opened it, where focus used to fall to the page.
- 79d482c: A popup opened from a contenteditable, like a link popover in an editor, returns focus with the caret where it was. Focus alone put it back at the start.
- aa4b725: A form reset returns a disabled Select, Combobox or Listbox to its default value, like a native control.
- 6efa592: A `bindScrollPicker` wheel whose value is set from outside, like a controlled Listbox or an agent's `setValue`, moves focus from the old option to the new one when focus was on the wheel. A Drawer settling around the wheel no longer scrolls it back to the old option.
- 1885f8c: `bindScrollPicker` now centers and picks the right option when a transform scales the list, like a popup that scales in as it opens, and when it was bound while the list was hidden.
- 6f4f9cf: Select's open list takes its trigger's name when the trigger is named by `aria-label`, a label element or a Field, where it was named after the selected value.
- 605d49f: `createSelection` keeps its Shift anchor when a controlled value comes back with the same keys in another order.
- 740fe4c: A select that opens as a sheet keeps its content hidden until the sheet has loaded, so it no longer shows in the page for a moment on a slow connection.
- 11edd0a: A sheet no longer throws as it settles in a browser without `linear()` easing, like Safari before 17.2. It plays the same spring as a keyframe per frame there.
- a108b05: A drag on a Slider, a ColorPicker area or another part with its own drag inside a Drawer or a sheet no longer moves the sheet.
- 243bdbf: A sheet whose content resizes while it is still opening keeps moving to its new size. In Chrome and Safari, a resize during the opening frames threw a `TypeError` from the sheet's effects.
- f6bb2a7: A popup opened by a key pressed away from its trigger returns focus to where it was opened from when it closes, not to the trigger. A Dialog trigger's `shortcut` pressed in a field returns focus to the field, and a Date Picker opened with Alt+ArrowDown in its input returns focus to the input.
- ab22cc4: Slider's `onValueChange` and `onValueCommit` type their value as the slider's own value type, `number` or `number[]`, where it was `number | (number[] & number)`.
- 57e3d0b: `createStickToBottom` keeps the rows in view still while not following when rows above them are removed, added or resized, like a log that drops its oldest lines. Content that arrives below while rows go above now counts as unseen.
- ee3d64a: Tabs' indicator animates its first move after mount when styles skip its transitions while `data-activation-direction="none"`.
- 7d93609: A toast with no layout, like one in a region under a hidden ancestor, has no height to measure. `--toast-height`, `--toast-offset`, `--toast-front-height` and `--toast-stack-height` now stay unset for it rather than reading `NaNpx`, and they're set once the toast is laid out.
- 94d414e: `web.css` keeps the Date Picker's trigger and clear button inside the end of the input. They sat on a row of their own below it.
- c8999f6: `web.css` no longer draws the default focus ring on parts that turn it off. A focused Tree branch outlined everything inside it, and the Command input showed a ring around its field.
- 9f2eb57: A window blur that closes a popup no longer logs a development warning in Chrome, or throws in strict mode. Chrome sends it as a plain `Event`.

## 0.1.0-beta.5

### Patch Changes

- 75c3588: An agent's `setValue` on a Combobox now refuses a value that isn't one of its items, as a Select does, unless the Combobox has `allowCustomValue`.
- 452f851: An agent can no longer change a read-only `Input` or `Textarea`. Its snapshot shows `disabled: true` with no actions, and `required: true` for a required one.
- 2b4ed26: An agent's `setValue` now refuses numeric text with grouped digits, like `"1,499.5"`, which used to set `1`. One value or label for a component that holds a list, like a multiple Select or a Checkbox Group, now sets a list of one.
- 8228013: A Calendar or Date Picker's `setValue` given text that isn't a date, or a range with one end, now returns `false` and keeps the value. It no longer clears the selection.
- 7bb89c2: A drag with a `threshold`, like `createReorder`'s and `createTransfer`'s, now captures the pointer once the pointer passes it. A press that lifts first clicks what was pressed, like a handle or a button inside the item, and no longer the item. Focus on an element inside a moved item, like its drag handle, now follows the item when a framework renders it as a new element in another list.

## 0.1.0-beta.4

### Patch Changes

- 4e529d2: An agent's `press` takes a button's own text, like `press "Save"` on a Save button.

## 0.1.0-beta.3

### Patch Changes

- a6dc4e0: A step marked `data-agent-confirm` that `registerTools`' `allow` refuses now fails with `The app refused …`. It no longer reports that the person said no.
- 220c1a0: A Select, Combobox or Listbox no longer throws when the browser restores a value that isn't the list of keys it saved, like a number. It selects nothing.
- adc59ce: `registerTools` marks `act` with `consequentialHint` and ends a step that is waiting on `allow` when the browser cancels its call. The bridge no longer keeps a hidden input's value after the input leaves the page.

## 0.1.0-beta.2

### Patch Changes

- d699609: A modal opened while another modal is open, like `confirm()` from a button inside a dialog, is no longer made inert by the one underneath, wherever its markup sits, wherever focus was and however soon after the other one it opened.
- c53df2f: When two cookies share a name, the preferences script now reads the same one as the server and the client, the first, so the value no longer changes after hydration.

## 0.1.0-beta.1

### Minor Changes

- Initial release
