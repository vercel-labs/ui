# @ui-sdk/svelte

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
