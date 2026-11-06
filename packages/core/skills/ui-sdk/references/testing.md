# Test it

`@ui-sdk/core/testing` checks keyboard behavior, focus, ARIA, server output and reading direction. The full page is "Testing" in `docs/core.md`, or https://ui-sdk.dev/docs/core/testing.

Test what you built, not what ui-sdk already tests: for an interface, check that the right components are wired with names, values and callbacks; for a new component, check every key and state.

Wiring includes what a person does with the keyboard: press Space on each switch or checkbox you placed, and check that closing a dialog or menu returns focus where it should. Assert every button's name in the page's own markup, not in a fixture, and assert that state attributes you don't set, like `aria-disabled`, are absent. The same goes when you're asked to add tests to existing code: tests that pass on a broken page don't count.

## Which tool for what

| You built                                                   | Test with                                                                                                                                                                                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| An interface from our components                            | The framework's testing library for what you wired (names, values, callbacks, what submits), and the [agent test](agent-ready.md#prove-it-with-a-test). Our components are tested already: don't run `checkPattern` on them. |
| A primitive                                                 | `mount` with `keys`, `type`, `click`, `hover` and `drag`, then `checkPattern`, `checkServer` and `checkDirection`                                                                                                            |
| Anything with popups, layout or focus moving between fields | Also a real browser                                                                                                                                                                                                          |

## Check a pattern

`checkPattern(element, pattern)` checks roles, names, states, references between parts and the keyboard interactions of a WAI-ARIA pattern, and throws one error that lists every problem:

```ts
import { checkPattern } from "@ui-sdk/core/testing"

await checkPattern(screen.getByRole("tablist").parentElement!, "tabs")
```

Patterns: `listbox`, `menu`, `menubar`, `tabs`, `radio-group`, `toolbar`, `tree`, `dialog`, `alertdialog`, `disclosure`, `accordion`, `combobox`, `slider`, `switch`, `checkbox`. Open a menu or dialog before checking it. A menu check activates an item, so use safe actions in tests.

## Test a primitive

```ts
import { checkDirection, checkServer, mount } from "@ui-sdk/core/testing"
import { expect, test } from "vitest"
import { stepper } from "./stepper"

test("arrows move between steps and Enter opens one", async () => {
  const view = mount(stepper, {}, `<root><step value="a">A</step><step value="b">B</step></root>`)
  try {
    await view.keys("Tab", "ArrowRight", "Enter")
    expect(view.state.value).toBe("b")
    expect(view.changes.at(-1)).toMatchObject({ key: "value", source: "keyboard" })
  } finally {
    view.unmount()
  }
})

test("renders on the server and works in both directions", async () => {
  checkServer(stepper, {}, `<root><step value="a">A</step></root>`)
  await checkDirection(stepper, {}, `<root><step value="a">A</step><step value="b">B</step></root>`)
})
```

- In `mount`'s markup, tags named after slots become parts and their attributes become part props. `root` is the first element; `view.part("step", "b")` finds another.
- Focus an input before `type`. `keys` takes `Tab`, `Shift+Tab`, `Space` and combinations.
- `view.announced` holds what screen readers heard. Call `await view.settle()` before reading delayed work.
- Always `unmount`.
- Set `globalThis.__UI_SDK_STRICT__ = true` in the test setup so development warnings fail the test.

## Break it on purpose

For each key behavior of a new component, break it (return early, skip a call), run the tests, confirm one fails, then restore the file. A test that still passes is testing nothing. Report how many breaks your tests caught.

For a composite widget, test both arrow directions, that exactly one item is tabbable, Space and Enter, and every state attribute you set, like `aria-current` or `aria-disabled`.

## jsdom

Framework renderers don't fill jsdom's gaps. Before anything opens, add these to the test setup:

```ts
HTMLElement.prototype.showPopover = function () {}
HTMLElement.prototype.hidePopover = function () {}
Element.prototype.getAnimations = () => []
Element.prototype.scrollIntoView = function () {}
Element.prototype.checkVisibility = () => true
Element.prototype.getClientRects = () => [] as unknown as DOMRectList
document.elementsFromPoint = () => []
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
document.head.append(
  Object.assign(document.createElement("style"), { textContent: "[popover] { display: block !important }" }),
)
```

Assign these rather than using `??=`: jsdom has some of them without the parts that matter. Web components in jsdom also need `ElementInternals`: jsdom's `attachInternals` lacks `setFormValue` and `setValidity`, so wrap `HTMLElement.prototype.attachInternals` and add them as no-ops. Stub `URL.createObjectURL` for file previews. `mount` already does the popover and animation stubs, and it keeps a part that isn't present as a detached node, so `view.part()` still returns it: check `isConnected` to tell whether it's on the page. Some state arrives a tick after mounting; wait with `await new Promise((r) => setTimeout(r, 0))` (inside `act` in React).

## A real browser

Check what jsdom can't show: top layer popups and their placement, layout, a key that moves focus so the next typed character lands in another field, typeahead timing. A browser tool's "type" may insert text without key events, so press real keys to test keyboard handling. Tab through the whole interface once and confirm every control is reachable and named.
