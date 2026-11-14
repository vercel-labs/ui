# @ui-sdk/core

## 0.1.0-beta.3

### Patch Changes

- 220c1a0: A Select, Combobox or Listbox no longer throws when the browser restores a value that isn't the list of keys it saved, like a number. It selects nothing.
- adc59ce: `registerTools` marks `act` with `consequentialHint` and ends a step that is waiting on `allow` when the browser cancels its call. The bridge no longer keeps a hidden input's value after the input leaves the page.

## 0.1.0-beta.2

### Patch Changes

- d699609: A modal opened while another modal is open, like `confirm()` from a button inside a dialog, is no longer made inert by the one underneath, wherever its markup sits, wherever focus was and however soon after the other one it opened.
- c53df2f: When two cookies share a name, the preferences script now reads the same one as the server and the client, the first, so the value no longer changes after hydration.

## 0.1.0-beta.1

### Minor Changes

- Initial release
