# @ui-sdk/svelte

## 0.1.0-beta.19

### Patch Changes

- 287cab6: A closed Popover, Hover Card, Dialog, Alert Dialog and Drawer waits for its first use to set itself up, like Menu and Tooltip, unless it has `open`, `defaultOpen`, a `controller` or a `presentation`. Parts that aren't shown take less work to mount in every framework.
- f49311f: Each `ColorPickerInput` in a color picker is its own part, so every one shows the picker's value and takes a typed color, like a field beside the trigger and another in a popover.
- a19503d: CheckboxGroup and ToggleGroup in Svelte and Vue, and Accordion in Svelte, type their value from `value`, `defaultValue` or the change handler, as the docs say, so a handler typed with your own union of values type-checks.
- f8f3301: A Menu radio group without a `name` keeps the person's choice after the menu closes and its content unmounts. It's kept by the group's place among the menu's unnamed radio groups, so give a group that's shown only some of the time a `name`.
- 798e7c1: A part rendered through `render` as a component, like UI SDK's own Button, gets `disabled`, `hidden`, `readonly`, `required`, `inert` and `multiple` as `true`, as React's and Vue's adapters give them. A disabled Popover trigger, File Input trigger or Image Cropper button rendered as a Button is now disabled.
- 518ca7d: A part binds once per element, even when its `bind` reads app state through a function option, like a format function: that state changing no longer unbinds and binds it again.
- 537f315: A part written by hand with `usePart` gives its props to the parts inside it that take them `from` its slot, as a generated part does. An item inside a hand-written group now reads the group's `value`.
- a3b6cd5: An SVG part no longer takes a Tab stop in Chrome. Only a part that handles `focusout` gets the listener that notes a focused element Svelte removes.
- Updated @ui-sdk/core to 0.1.0-beta.19

## 0.1.0-beta.18

### Patch Changes

- 0dbff31: A Checkbox in a Field of its own inside a CheckboxGroup takes that field from the server's HTML on: its label names it and the field's `disabled` disables it, like a checkbox outside a group.
- a3f6abe: RadioGroup, SegmentedControl and NavigationMenu in Svelte and Vue, and Tabs in Svelte, type their value from `value`, `defaultValue` or the change handler, as the docs say, so a handler typed with your own union of values type-checks.
- 8829403: A handler on an element inside a part, like `onkeydown` on a field in a tree row, now runs before the part's own keys and clicks, so its `stopPropagation()` keeps the event from the part, as in React.
- 6ec9019: A part from `createParts` mapped to an SVG tag, like `circle` or `path`, is created as an SVG element, as in the other adapters.
- 1de2cde: A click or key press on a part inside a popup that renders outside the app, like a button in a popover, reaches the popup's own handlers again.
- 875a20b: A part made with `createParts` and given an `id`, like one rendered through a trigger's `render`, no longer takes that id as its key, so an agent can press it as in the other frameworks.
- ab810de: A Textarea's default value leaves the caret at the start of the text, as a native textarea does.
- Updated @ui-sdk/core to 0.1.0-beta.18

## 0.1.0-beta.17

### Patch Changes

- 922763f: Relative imports in the published files name their file, like `./create-parts.js`, where a folder of the same name sat beside it, so Node and test runners that load the package without a bundler no longer throw `ERR_UNSUPPORTED_DIR_IMPORT`.
- Updated @ui-sdk/core to 0.1.0-beta.17

## 0.1.0-beta.16

### Patch Changes

- Updated @ui-sdk/core to 0.1.0-beta.16

## 0.1.0-beta.15

### Patch Changes

- Updated @ui-sdk/core to 0.1.0-beta.15

## 0.1.0-beta.14

### Patch Changes

- Updated @ui-sdk/core to 0.1.0-beta.14

## 0.1.0-beta.13

### Patch Changes

- Updated @ui-sdk/core to 0.1.0-beta.13

## 0.1.0-beta.12

### Patch Changes

- Updated @ui-sdk/core to 0.1.0-beta.12

## 0.1.0-beta.11

### Patch Changes

- Updated @ui-sdk/core to 0.1.0-beta.11

## 0.1.0-beta.10

### Patch Changes

- 81943ed: Give each `FieldDescription` an id of its own, so a control with two descriptions is described by both.
- Updated @ui-sdk/core to 0.1.0-beta.10

## 0.1.0-beta.9

### Patch Changes

- fcb4382: Dialog and Popover content take `inline`, which renders the content (and a dialog's backdrop) where it is in the page instead of the top layer, so it can stay inside a frame. An inline popover is placed by your CSS.
- da25ba4: Combobox, Autocomplete and Listbox controllers take `highlight(value)` and `getHighlighted()`, so code can put the highlight on a particular item, like the row a cascading picker came back from. `onHighlight` fires for it, and the item scrolls into view. While focus is outside a Listbox, `highlight` gives the option the tab stop instead.
- bf17e93: Listbox takes `virtualFocus` to keep focus on the list itself. Arrow keys, Home, End and typing move a highlight, the list points at it with `aria-activedescendant`, and a press chooses an option without moving focus.
- 1a04e0d: Select takes `virtualFocus` to keep focus on the trigger while the list is open, as on a native select. Arrow keys, Home, End and typing move the highlight, the trigger points at it with `aria-activedescendant`, and Tab closes the list and moves on.
- Updated @ui-sdk/core to 0.1.0-beta.9

## 0.1.0-beta.8

### Patch Changes

- 43ee542: An Autocomplete's `onValueChange` details carry `item`, the chosen suggestion's `value` and `label`, when a suggestion is chosen, so two suggestions with the same label can be told apart. The new `AutocompleteValueChangeDetails` type describes them.
- a93c6e6: Combobox's `autoHighlight` takes `"selected"`: opening the list highlights the selected item, so the arrow keys move on from it, and highlights nothing when none is selected. While typing, it highlights the first match, like `true`.
- 7e2ebe9: Pagination takes `disabled`: every page and step then does what a step at its end does (`aria-disabled`, `data-disabled`, no `href`, presses ignored), and the root gets `data-disabled`. A controller still changes the page.
- 13a1ae4: Segmented Control's indicator gets `data-activation-direction`, like Tabs' indicator: `"none"` on its first placement, so a transition can skip it, then which way the checked item moved.
- 7e5834f: The hidden field a Select, Combobox or Listbox renders for its form is now a `<textarea>`, so Enter in the form's one text field submits a form without a submit button, like it does next to a native `<select>`.
- 795d1fe: A popup with a one-way `open` whose content renders only while it's open, like `{#if open}`, opens again after it closes. Before, an entrance animation that fills forwards left it stuck closed.
- fa92d22: A part's inline style that goes away now leaves the element too when the owner keeps `style` out of its spread, like an avatar image that loads.
- Updated @ui-sdk/core to 0.1.0-beta.8

## 0.1.0-beta.7

### Patch Changes

- e154ead: In server-rendered HTML, the control of a Field marked `invalid` now names its first shown error in `aria-describedby`, including a `FieldError` with `match`. Every error shown at once keeps an id of its own.
- 06fd2e2: `SelectItemText`, `ComboboxItemText`, `CommandItemText` and `AutocompleteItemText` follow their content when it changes, like an item reused by an unkeyed `{#each}` or a count in its label. They used to keep the first text they rendered. A label that changes while a search marks it updates once the search clears.
- Updated @ui-sdk/core to 0.1.0-beta.7

## 0.1.0-beta.6

### Patch Changes

- Updated dependencies [7cfedda]
- Updated dependencies [2087c1e]
- Updated dependencies [6531579]
- Updated dependencies [6776fc2]
- Updated dependencies [b003f2a]
- Updated dependencies [85ff859]
- Updated dependencies [0e80ddb]
- Updated dependencies [83c1863]
- Updated dependencies [203f75c]
- Updated dependencies [0406bb1]
- Updated dependencies [a63834d]
- Updated dependencies [4a4cfb0]
- Updated dependencies [9525c67]
- Updated dependencies [7709e0c]
- Updated dependencies [dfc8eae]
- Updated dependencies [9fa96f9]
- Updated dependencies [1a703c3]
- Updated dependencies [f64c466]
- Updated dependencies [e844918]
- Updated dependencies [fc6ced5]
- Updated dependencies [c0373e4]
- Updated dependencies [2a961bc]
- Updated dependencies [c705ecf]
- Updated dependencies [0e71042]
- Updated dependencies [33ce1e0]
- Updated dependencies [7695b23]
- Updated dependencies [e1ccd55]
- Updated dependencies [81488c4]
- Updated dependencies [79d482c]
- Updated dependencies [aa4b725]
- Updated dependencies [6efa592]
- Updated dependencies [1885f8c]
- Updated dependencies [6f4f9cf]
- Updated dependencies [605d49f]
- Updated dependencies [740fe4c]
- Updated dependencies [11edd0a]
- Updated dependencies [a108b05]
- Updated dependencies [243bdbf]
- Updated dependencies [f6bb2a7]
- Updated dependencies [ab22cc4]
- Updated dependencies [57e3d0b]
- Updated dependencies [ee3d64a]
- Updated dependencies [7d93609]
- Updated dependencies [94d414e]
- Updated dependencies [c8999f6]
- Updated dependencies [9f2eb57]
  - @ui-sdk/core@0.1.0-beta.6

## 0.1.0-beta.5

### Patch Changes

- Updated dependencies [75c3588]
- Updated dependencies [452f851]
- Updated dependencies [2b4ed26]
- Updated dependencies [8228013]
- Updated dependencies [7bb89c2]
  - @ui-sdk/core@0.1.0-beta.5

## 0.1.0-beta.4

### Patch Changes

- Updated dependencies [4e529d2]
  - @ui-sdk/core@0.1.0-beta.4

## 0.1.0-beta.3

### Patch Changes

- Updated dependencies [a6dc4e0]
- Updated dependencies [220c1a0]
- Updated dependencies [adc59ce]
  - @ui-sdk/core@0.1.0-beta.3

## 0.1.0-beta.2

### Patch Changes

- 3aa0973: A `SelectTrigger` connected through `controller` outside its `Select`, inside a `Field`, takes the field's control id and label in the server HTML, so the `FieldLabel` points at it before the page hydrates.
- Updated dependencies [d699609]
- Updated dependencies [c53df2f]
  - @ui-sdk/core@0.1.0-beta.2

## 0.1.0-beta.1

### Minor Changes

- Initial release
