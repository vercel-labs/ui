# @ui-sdk/web

## 0.1.0-beta.19

### Patch Changes

- 287cab6: A closed Popover, Hover Card, Dialog, Alert Dialog and Drawer waits for its first use to set itself up, like Menu and Tooltip, unless it has `open`, `defaultOpen`, a `controller` or a `presentation`. Parts that aren't shown take less work to mount in every framework.
- e3d2015: A disabled `<ui-toggle>`, `<ui-checkbox>` or `<ui-switch>` takes a `pressed` or `checked` written from script, by property or attribute, like a native input's `value`. Presses, the `api` and agents still can't change it while it's disabled. Inside a toggle group or a disabled checkbox group, the group still decides.
- 3c9f2ae: An image cropper starts its first image's crop at `defaultCrop` even when the default arrives after the cropper is made, like the web property set on a `<ui-image-cropper>` already in the page. `defaultCrop` is now on the element's type.
- fe4d8ad: The types of `<ui-command>`'s `valuechange` now include `detail.index`, and the types of `querychange` on `<ui-select>`, `<ui-combobox>` and `<ui-command>` include `detail.composing`. Vue's Command, Combobox and Select type `queryChange`'s details with `composing` too.
- 25d0606: The package's docs now include `docs/components.md`: every component's composition, attributes and events in one file, for an agent building a page with no build step.
- 3cc1b67: A drag preview's copy of web components stays as it was made: the elements cloned into it no longer connect and start their own instance, so a checked box in the copy stays checked and its parts keep their ids and slots.
- 3028fe8: In parts made with `createParts`, a part's own attribute or property now wins over a prop it takes from the part around it, like a cell's `value` inside a row. Setting a boolean one to `false` keeps it off even when the part around it is on.
- 3073909: A `<ui-file-input-dropzone>`'s `pasteTarget` property keeps an element or a function as it is, so pastes into that target add their files. The `paste-target` attribute still takes `"document"` or a CSS selector.
- cd8bf5a: A popup content's `initialFocus` and `finalFocus` properties keep an element or a function that returns one, as their types say. Before, the property wrote it to the attribute as a string, so opening or closing the popup threw and focus was lost. The `initial-focus` and `final-focus` attributes still take a selector.
- Updated @ui-sdk/core to 0.1.0-beta.19

## 0.1.0-beta.18

### Patch Changes

- 94e1820: A popup content's `anchor` property takes an element or a point, as its docs and types say, besides a selector.
- 8d64c80: `<ui-autocomplete>`'s `api` now has `highlight()` and `getHighlighted()`, as its type says. Calling them threw before, since the element left them out.
- edab573: A `<ui-switch>`, `<ui-checkbox>` or other form control that starts `disabled` works once `disabled` is set back to `false` in jsdom. It kept `aria-disabled` and `data-disabled` and ignored presses, since its own `disabled` counted as a fieldset's, which only `formDisabledCallback` cleared and jsdom never calls it.
- bacd0a4: An empty `<ui-field-error>` keeps a message the page writes into it, like a server's, instead of replacing it with the browser's. Emptying it again shows the browser's message.
- a70d60f: An item text part written empty in the page, like `<ui-combobox-item-text>` beside an icon, shows its item's `label`, as it does for items given as data.
- 6404deb: An element that makes its own id keeps it when it's taken off the page and put back, so the controls a label built on the label primitive names stay named.
- 36df185: A `<ui-listbox-item>` or `<ui-combobox-item>` written in the page keeps a record set as its `value` property, keyed by the list's `itemToValue`, as a `<ui-select-item>` does. Each row used to register as "[object Object]", so every row shared one id and a press made the value that string. An empty item text part still shows its item's `label` when the item's value is a property, as Vue, React and Svelte set it.
- 91b7d0a: A data combobox or listbox whose page writes its own rows, like a windowed list, shows those rows alone. A combobox finds them inside a box in its list and drops the rows it rendered once the page writes its rows again. A listbox that holds rows from the page when `items` is set renders none of `items` beside them.
- 66afde4: `<ui-popover>`, `<ui-dialog>`, `<ui-alert-dialog>`, `<ui-drawer>`, `<ui-tooltip>`, `<ui-hover-card>` and `<ui-menu>` take `display: contents`, like `<ui-select>`, so the button in their trigger is laid out by the row or grid around them.
- ef6d0e2: An agent sets a `<ui-rating>` by its score, and its stars are no longer listed as choices.
- 2bbd848: `align` on `<ui-toast-region>` and `<ui-carousel>` now only places the toasts or the slides. In Chrome and Safari it used to right-align or center their text too, as popup contents with `align` already avoided.
- 1dae48d: A button that two parts bind, like a `<ui-button>` or `<ui-toggle>` inside a popover or tooltip trigger, keeps the inner part's `data-slot` (`button` or `toggle`) whatever order they upgrade in.
- dea32b4: A toast's close button with an `aria-label`, `aria-labelledby` or `title` and no content stays the author's close: it no longer hides, or shows and runs the toast's cancel.
- 5a39f1f: A trigger's `payload` attribute gives the popup a string, so server-rendered triggers can carry one without a script. A `payload` property still wins, for rich values.
- Updated @ui-sdk/core to 0.1.0-beta.18

## 0.1.0-beta.17

### Patch Changes

- fc45598: `@ui-sdk/web/toast` exports `toast()` and `createToaster()`, so a page without a bundler can import them from the CDN's `toast.js`.
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

- 005c6eb: The agent snapshot leaves out a closed Tooltip whose trigger is a listed component, since its text is already that component's label. In web components, a dialog or menu trigger around a `<ui-button>` binds the button inside it, so a press by its label reaches it.
- 43ee542: An Autocomplete's `onValueChange` details carry `item`, the chosen suggestion's `value` and `label`, when a suggestion is chosen, so two suggestions with the same label can be told apart. The new `AutocompleteValueChangeDetails` type describes them.
- 13a1ae4: Segmented Control's indicator gets `data-activation-direction`, like Tabs' indicator: `"none"` on its first placement, so a transition can skip it, then which way the checked item moved.
- Updated @ui-sdk/core to 0.1.0-beta.8

## 0.1.0-beta.7

### Patch Changes

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

- Updated dependencies [d699609]
- Updated dependencies [c53df2f]
  - @ui-sdk/core@0.1.0-beta.2

## 0.1.0-beta.1

### Minor Changes

- Initial release
