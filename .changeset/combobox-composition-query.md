---
"@ui-sdk/core": patch
---

Combobox, Command, Select's search field and Autocomplete keep their list's filter while an input method composes text, like `とうk` on its way to `東京` or a dead key's accent, and filter once it's committed. Their query change callbacks (Autocomplete's `onValueChange`) get `details.composing`, typed as `TextChangeDetails`, and report the committed text again with `composing: false`. Android keyboards and Hangul, which compose ordinary typing, filter as before. Async options' `setQuery` skips text that's still composing.
