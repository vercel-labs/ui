# Perf tests

How ui-sdk measures the work an interaction costs, and the catalog of every budget. The map of the whole suite is [tests/README.md](../README.md).

## Counts

**Counts** are exact numbers per interaction: renders, subscriptions, parts a store change notifies, DOM calls like `compareDocumentPosition`, `getAttribute`, `getBoundingClientRect`, `getComputedStyle`, `offsetWidth` and `offsetHeight`, and frames until a popup settles. [init.ts](init.ts) counts the DOM calls by wrapping DOM prototypes before the fixture loads, so shipped code has no instrumentation. [drag.ts](drag.ts) adds attribute writes, from a `MutationObserver`, and elements restyled, from a Chromium trace. [leaks.ts](leaks.ts) reads what a popup leaves behind through the Chrome DevTools Protocol. Perf fixtures count their own renders and subscriptions with `countRender` and `countSubscriptions` from [tests/fixtures/perf.ts](../fixtures/perf.ts). Counts don't depend on how fast the machine is, so they gate in the normal suite.

|          | Counts                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| Tests    | `tests/specs/*.counts.spec.ts`, and unit tests that read a budget, like `packages/core/test/store-fanout.test.ts` |
| Budgets  | [budgets.ts](budgets.ts)                                                                                          |
| Gates in | The Playwright suite and the CI check job. See below.                                                             |
| Builds   | The playground's development build                                                                                |

Where the count gates run in CI: pull requests run them on Chromium in the `react`, `vue` and `web` projects. The portal projects leave them out (`countGates` in `tests/fixture-files.ts`), since a portal doesn't change the work. The nightly run adds WebKit and Firefox, and the weekly run adds Edge. Restyle counts read a Chromium trace, so the engines skip them. The leak specs run in Chromium and Edge only. Unit tests that read a budget run in the check job on every pull request.

Bundle size has its own check, `pnpm size`, which compares every adapter entry with `size-budget.json`. See [tests/README.md](../README.md#bundle-size).

## Running the count gates

From `tests/`, on your own port:

```bash
cd tests
PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test counts.spec --project react --project vue --project web --workers 1
```

- `PERF_SIZES=10,500,2000` sets the item counts. The default is `10,500`. A budget is the same at every size, so work that grows with the count fails at the larger one.
- `PERF_REPORT=1` prints every gate's counts, one line per test, like `[perf] react menu.arrow-key n=500 {"counts":{...},"renders":{...},"subscriptions":0}`.

```bash
cd tests
PLAYGROUND_PORT=5310 PERF_SIZES=10,500,2000 PERF_REPORT=1 ../scripts/test-slot.sh \
  npx playwright test counts.spec --project react --project vue --project web --workers 1
```

A failure prints the assertion's message, the count it got and the budget. The message links to the budget's entry below. Run the one test again with `PERF_REPORT=1` to see every count it took.

## Changing a budget

1. Edit the entry in [budgets.ts](budgets.ts). Change the number, and say why in its `why` or in a comment beside the number. Comments in an entry show up in its catalog entry as notes.
2. Run `pnpm docs:perf` to regenerate the catalog below.
3. Run the gates that read it. Its catalog entry lists them, with the command.

`pnpm docs:perf --check` runs in the CI check job. It fails when the catalog is stale, when no test reads a budget, when a budget's `measures` or `why` is empty, or when a test links to an anchor no budget has.

## Adding a scenario for a new component

Any component with a collection, a popup or a drag gets perf scenarios before it's done.

1. **Fixture.** Add `apps/playground/src/fixtures/<name>-perf/` with `react.tsx`, `vue.ts` and `web.ts`. Read the size with `perfSize()` (`?n=`, default 10) and make labels with `perfItems(n)` from `tests/fixtures/perf.ts`. Count renders with `countRender("<kind>")` in the parts you gate, and subscriptions with `countSubscriptions(instance)`. Render a `Before` button, since `open()` waits for it.
2. **Budget.** Add an entry to [budgets.ts](budgets.ts), keyed `<component>.<interaction>`, with `measures`, `why` and the numbers. Keep the bound the same at every size.
3. **Gate.** Add `tests/specs/<name>.counts.spec.ts`. Call `countCalls(page)` before `open()`, loop over `sizes`, `resetCounts` right before the interaction, then `readCounts`, `report` and the assertions. Every assertion message ends with a link to the entry:

   ```ts
   const budget = budgets["select.arrow-key"]
   expect(
     result.counts.compareDocumentPosition ?? 0,
     "See tests/perf/README.md#select-arrow-key."
   ).toBeLessThanOrEqual(budget.counts.compareDocumentPosition)
   ```

   The portal projects leave counts specs out, so a component in `portalSpecs` needs nothing more.

4. **Docs.** Run `pnpm docs:perf`, then `pnpm docs:perf --check`.

<!-- catalog:start -->

Generated by `pnpm docs:perf` from `tests/perf/budgets.ts` and the tests that read each budget. Edit those, not this part.

## Budgets

<a id="menu-arrow-key"></a>

### menu.arrow-key

**Measures:** Work done by 10 ArrowDown presses 50 ms apart in an open menu.

**Why:** Moving the highlight changes two items. Sorting every item on each key made long menus lag.

**Budget:**

- No `plain` renders.
- At most 20 `watched` renders.
- No `compareDocumentPosition` calls.
- At most 8 `requestAnimationFrame` calls.
- At most 2 parts notified.

**Notes:** Plain items never re-render. Items that read `highlighted` re-render when they gain or lose it: at most two per key. The keys come 50 ms apart. Each once woke positioning, which asked for three frames to check whether the popup moved, about 30 a run. Nothing inside a popup can move it, so now only the opening's last frames ask. Parts one highlight move notifies: the item losing it and the one gaining it.

**Tests:**

- `store-fanout.test.ts` › a highlight change notifies two items
- `fanout.test.tsx` › a highlight change renders two items that read it, and none that don't
- `menu.counts.spec.ts` › arrow keys do no work that grows with the item count

**Run:**

```bash
cd packages/core && ../../scripts/test-slot.sh npx vitest run test/store-fanout.test.ts -t 'a highlight change notifies two items'
cd packages/solid && ../../scripts/test-slot.sh npx vitest run test/fanout.test.tsx -t 'a highlight change renders two items that read it, and none that don.t'
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/menu.counts --project react -g 'arrow keys do no work that grows with the item count'
```

<a id="menu-hover"></a>

### menu.hover

**Measures:** Work done by moving the pointer across 10 items of an open menu.

**Why:** Each hover moves the highlight, like an arrow key, and runs on every pointer move.

**Budget:**

- No `plain` renders.
- At most 20 `watched` renders.
- No `compareDocumentPosition` calls.

**Tests:**

- `menu.counts.spec.ts` › hovering items does no work that grows with the item count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/menu.counts --project react -g 'hovering items does no work that grows with the item count'
```

<a id="menu-open"></a>

### menu.open

**Measures:** Renders per item when a menu opens.

**Why:** Opening mounts each item once. Re-rendering every item for each change that follows, like the menu learning its side, multiplies the cost of opening a long menu.

**Budget:**

- At most 1 render per item.

**Notes:** Each item renders once, and the checkbox item too.

**Tests:**

- `menu.counts.spec.ts` › opening the menu renders each item once

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/menu.counts --project react -g 'opening the menu renders each item once'
```

<a id="menu-checkbox"></a>

### menu.checkbox

**Measures:** Parts notified, renders and attribute reads when one checkbox item in an open menu is toggled.

**Why:** Only the toggled item and its indicator show the change. Vue re-rendered every item for any change that affects rendering (H3), and every part heard the checked items' record change, so React compared every item's attributes and web components read them back.

**Budget:**

- At most 2 parts notified.
- No `plain` renders.
- No `watched` renders.
- At most 1 `checkbox` render.
- At most 20 `getAttribute` calls.

**Notes:** The item and its indicator. Gated in packages/core/test/store-fanout.test.ts. Web components read back the attributes of the parts a toggle reaches: the item's and its indicator's, which appears.

**Tests:**

- `store-fanout.test.ts` › a checkbox toggle notifies its item and its indicator
- `fanout.test.tsx` › a checkbox toggle re-renders its item and its indicator only
- `menu.counts.spec.ts` › toggling a checkbox item reaches only that item and its indicator

**Run:**

```bash
cd packages/core && ../../scripts/test-slot.sh npx vitest run test/store-fanout.test.ts -t 'a checkbox toggle notifies its item and its indicator'
cd packages/solid && ../../scripts/test-slot.sh npx vitest run test/fanout.test.tsx -t 'a checkbox toggle re-renders its item and its indicator only'
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/menu.counts --project react -g 'toggling a checkbox item reaches only that item and its indicator'
```

<a id="menu-idle"></a>

### menu.idle

**Measures:** Layout reads while a menu sits open and nothing moves, over 30 frames.

**Why:** Positioning checked the anchor and the popup every frame for as long as a popup was open, forcing work on pages that were otherwise idle (H7).

**Budget:**

- Positioning checks for unreported moves every 500 ms.
- At most 1 `getBoundingClientRect` call per check.
- At most 1 `offsetWidth` call per check.
- At most 1 `offsetHeight` call per check.

**Notes:** Asleep, positioning still checks every `checkEvery` ms for moves no event reports, like an anchor moved by the Web Animations API. Each check reads the anchor's rectangle and the popup's size once.

**Tests:**

- `menu.counts.spec.ts` › an open menu reads no layout while nothing moves

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/menu.counts --project react -g 'an open menu reads no layout while nothing moves'
```

<a id="menu-scroll"></a>

### menu.scroll

**Measures:** Elements restyled per style recalculation while the page scrolls under an open menu.

**Why:** Positioning writes the popup's place and the room it has on every frame it moves. The room was an inherited custom property, so every item inside the popup restyled each frame.

**Budget:**

- At most 4 elements restyled per style recalculation.

**Notes:** The popup, and the page's scroller.

**Tests:**

- `menu.counts.spec.ts` › scrolling under an open menu restyles only the popup

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/menu.counts --project react -g 'scrolling under an open menu restyles only the popup'
```

<a id="tabs-arrow-key"></a>

### tabs.arrow-key

**Measures:** Work done by 10 ArrowRight presses 50 ms apart in a tab list.

**Why:** Roving focus sorted every tab on each key, and every tab and panel heard each switch, so web components compared all their attributes.

**Budget:**

- No `compareDocumentPosition` calls.
- At most 1,000 `getAttribute` calls.
- At most 12 `requestAnimationFrame` calls.

**Notes:** Web components compare the attributes of the parts a switch reaches: the two tabs and two panels it changes, and the list, about 62 per switch. A short list wraps around and flips the activation direction, which every part shows, so the budget leaves room for 10 tabs doing so. Each switch shows a panel, which asks for one frame to draw its starting style. It asked for two until 2026-10-13, so the page was still drawing when the next key came.

**Tests:**

- `tabs.counts.spec.ts` › arrow keys do no work that grows with the tab count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/tabs.counts --project react -g 'arrow keys do no work that grows with the tab count'
```

<a id="grid-arrow-key"></a>

### grid.arrow-key

**Measures:** Cells notified when an arrow key moves the active cell of a grid.

**Why:** Every cell heard every move and wrote its attributes again, about 11 ms per key on a 100 by 26 spreadsheet.

**Budget:**

- At most 2 parts notified.

**Notes:** The cell that loses the tab stop and the one that takes it.

**Tests:**

- `store-fanout.test.ts` › a move in a grid notifies the cell it leaves and the one it lands on

**Run:**

```bash
cd packages/core && ../../scripts/test-slot.sh npx vitest run test/store-fanout.test.ts -t 'a move in a grid notifies the cell it leaves and the one it lands on'
```

<a id="grid-extend"></a>

### grid.extend

**Measures:** Cells notified when Shift+Arrow grows a range of 2 rows by 5 columns by a row.

**Why:** A range change reaches the cells that join or leave it and the cells of the sides that move, never the rest of the grid.

**Budget:**

- At most 10 parts notified.

**Notes:** The row that joins, and the row that stops being the bottom edge.

**Tests:**

- `store-fanout.test.ts` › a range growing by a row notifies that row and the one that was its bottom edge

**Run:**

```bash
cd packages/core && ../../scripts/test-slot.sh npx vitest run test/store-fanout.test.ts -t 'a range growing by a row notifies that row and the one that was its bottom edge'
```

<a id="accordion-mount"></a>

### accordion.mount

**Measures:** Sorts of the items into document order when a long accordion mounts, with closed panels unmounted and kept for find in page.

**Why:** Each item put every item in order again as it mounted, and each panel wrote the panels again, and every item heard both, so mounting grew with the square of the item count.

**Budget:**

- At most 1 sort of the items in document order.

**Notes:** The items are put in order once, after the last mounts. One sort compares each item log2(n) times at most, and once when the items mount in order.

**Tests:**

- `accordion.counts.spec.ts` › mounting puts the items in order once
- `accordion.counts.spec.ts` › mounting with closed panels kept for find in page puts the items in order once

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/accordion.counts --project react
```

<a id="accordion-toggle"></a>

### accordion.toggle

**Measures:** Work done by opening one item of a long accordion.

**Why:** Opening an item mounts its panel, which put every item in order again, and every item and trigger heard the panels change, so web components compared all their attributes.

**Budget:**

- No `compareDocumentPosition` calls.
- At most 20 `getAttribute` calls.

**Notes:** Web components read back the opened item's parts, 17 at any size.

**Tests:**

- `accordion.counts.spec.ts` › opening an item does no work that grows with the item count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/accordion.counts --project react -g 'opening an item does no work that grows with the item count'
```

<a id="tree-mount"></a>

### tree.mount

**Measures:** Sorts of a long tree's items into document order when it mounts.

**Why:** Positions come from each parent's items in document order. Putting every item in order again as each one mounted made mounting a long tree quadratic.

**Budget:**

- At most 2 sorts of the items in document order.

**Notes:** Each parent's items are put in order once, after they mount, and the roving group puts every item in order once for the arrow keys.

**Tests:**

- `tree.counts.spec.ts` › mounting puts each folder's items in order once

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/tree.counts --project react -g 'mounting puts each folder.s items in order once'
```

<a id="tree-expand"></a>

### tree.expand

**Measures:** Work done by expanding one folder of a long tree.

**Why:** Expanding mounts a group of items, which once bumped a version every item heard, so every item wrote its position again and the whole tree was put in order. The roving group then sorted, or walked, every item again to place the two that joined.

**Budget:**

- At most 1 `compareDocumentPosition` call.
- At most 80 `getAttribute` calls.
- At most 3 `nextNode` calls.
- At most 2 items placed by binary search, about log₂ n comparisons each.

**Notes:** Only the folder's own items are put in order, the two items that join take their places in the roving group's order by binary search, and web components read back the folder's parts and its two items', 72 at any size.

**Tests:**

- `tree.counts.spec.ts` › expanding a folder does no work that grows with the item count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/tree.counts --project react -g 'expanding a folder does no work that grows with the item count'
```

<a id="collapsible-toggle"></a>

### collapsible.toggle

**Measures:** Work done by opening one of a long list of collapsibles.

**Why:** Each collapsible is its own instance, so opening one must not reach the others, as a shared store or a document listener would.

**Budget:**

- No `compareDocumentPosition` calls.
- At most 12 `getAttribute` calls.

**Notes:** Web components read back the opened collapsible's parts, 11 at any size.

**Tests:**

- `collapsible.counts.spec.ts` › opening one does no work that grows with the count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/collapsible.counts --project react -g 'opening one does no work that grows with the count'
```

<a id="toolbar-arrow-key"></a>

### toolbar.arrow-key

**Measures:** Work done by 10 ArrowRight presses in a toolbar.

**Why:** Roving focus sorted every item on each key.

**Budget:**

- No `compareDocumentPosition` calls.
- `notifiedPerPart`: 1.

**Notes:** Each button notifies only itself when it binds as another element.

**Tests:**

- `store-fanout.test.ts` › a toolbar button rendered as another element notifies only itself
- `toolbar.counts.spec.ts` › arrow keys do no work that grows with the item count

**Run:**

```bash
cd packages/core && ../../scripts/test-slot.sh npx vitest run test/store-fanout.test.ts -t 'a toolbar button rendered as another element notifies only itself'
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/toolbar.counts --project react -g 'arrow keys do no work that grows with the item count'
```

<a id="tooltip-focus"></a>

### tooltip.focus

**Measures:** Renders, layout and style reads, and attribute reads and writes for 10 Tab presses from the button before a row of tooltip triggers, each showing the next tooltip.

**Why:** Moving focus along a toolbar closes one tooltip and opens the next on every key. Tooltips share only module state, so a focus move should reach the tooltip closing and the one opening, never every trigger on the page.

**Budget:**

- No `trigger` renders.
- At most 20 `tooltip` renders.
- No `compareDocumentPosition` calls.
- At most 400 `getAttribute` calls.
- At most 100 `getBoundingClientRect` calls.
- At most 100 `offsetWidth` calls.
- At most 100 `offsetHeight` calls.
- At most 20 `getComputedStyle` calls.
- At most 400 attribute and style writes.

**Notes:** The first press opens a tooltip and each after it closes one and opens the next, so contents that read their state render 19 times. Triggers render nothing, since a focus move changes none of their attributes. Solid has no renders to count after mount, and web none at all. Positioning reads the trigger's and the content's boxes for each open, then checks every 500 ms while it sleeps, so layout reads grow with how long the presses take, not with the triggers: 40 to 62 rectangle reads and 30 to 52 of each size here, and with 30 frames after each press, about 5 seconds, 71 at 10 triggers and 73 at 500. Each press reads a computed style twice. Web components read back the attributes of the two tooltips a press reaches, 324 in all; the others read 28 to 47. Every framework writes about 30 attributes and styles a press, 302 in all: the closing tooltip's state, and the opening one's state, placement and position, which takes 15 style writes. Checked against a change that told every tooltip about each open: 5,000 trigger renders, 5,302 writes and, on web, 55,388 attribute reads at 500.

**Tests:**

- `tooltip.counts.spec.ts` › tabbing between triggers shows each tooltip and does no work that grows with the trigger count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/tooltip.counts --project react -g 'tabbing between triggers shows each tooltip and does no work that grows with the trigger count'
```

<a id="slot-state-render"></a>

### slot-state.render

**Measures:** Subscriptions custom parts make when they render again.

**Why:** A part that resubscribes on every render pays for it on every render, and churns the store's listeners.

**Budget:**

- No new subscriptions.

**Notes:** Re-rendering parts adds none: each part keeps the one it made on mount.

**Tests:**

- `menu.counts.spec.ts` › parts keep one subscription when they render again

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/menu.counts --project react -g 'parts keep one subscription when they render again'
```

<a id="rows-mount"></a>

### rows.mount

**Measures:** Renders and elements per row when rows mount, each with a closed menu, select and tooltip.

**Why:** A table with a menu, a select and a tooltip in every row pays for every closed popup when it mounts. A closed menu renders none of its items. A closed select renders all its options, by design: its trigger shows the selected label, and the server HTML needs the options for it. So a row costs one more element and one more render for each option its select has, and nothing else in it grows with the options. Rendering the options only on first open is a separate decision, so this budget records today's cost.

**Budget:**

- At most 3 `trigger` renders.
- At most 2 `value` renders.
- At most 1 `tooltip` render.
- No `menuItem` renders.
- At most 1 `perOption` render.
- `elements`: `react` 8, `vue` 8, `web` 17, `svelte` 8, `solid` 8, `perOption` 1.

**Notes:** Per row: each of the three triggers renders once, the select's value twice (again once its options give it the label), and the tooltip's content once, hidden, since the trigger points at it with aria-describedby. A closed menu's items never render. Elements per row with no options, then per option. Web components' markup holds every part, the menu's items and wrapper elements included. Svelte renders the same elements as React and Vue; its anchors are comments.

**Tests:**

- `rows.counts.spec.ts` › closed rows grow only with their select's options

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/rows.counts --project react -g 'closed rows grow only with their select.s options'
```

<a id="rows-labels"></a>

### rows.labels

**Measures:** Reads of a control's `labels` while rows of closed menus, selects and tooltips mount.

**Why:** Chromium answers `labels` by walking the whole document, so a page that reads it once per control mounts in quadratic time: 2,000 rows of web selects took 1,979 ms against React's 603. Core finds labels with the closest `<label>` and `label[for]` instead, and reads none for a control `aria-label` already names.

**Budget:**

- No `labels` calls.

**Notes:** Every framework, at every row count. Before the fix, web components read a select's ElementInternals.labels twice as it mounted: to name the element and to name its trigger.

**Tests:**

- `rows.counts.spec.ts` › closed rows read no control's labels as they mount

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/rows.counts --project react -g 'closed rows read no control.s labels as they mount'
```

<a id="select-arrow-key"></a>

### select.arrow-key

**Measures:** Work done by 10 ArrowDown presses 50 ms apart in an open select.

**Why:** Moving the highlight changes two options. Work that grows with the options makes a long select lag on every key.

**Budget:**

- No `plain` renders.
- At most 20 `watched` renders.
- No `compareDocumentPosition` calls.
- At most 60 `getBoundingClientRect` calls.
- At most 8 `requestAnimationFrame` calls.

**Notes:** Plain options never re-render. Options that read `highlighted` re-render when they gain or lose it: at most two per key. Keeping the highlighted option in view reads its rectangle and the list's, and positioning reads a few more on each frame the keys arrive in, about 20 a run. Work that grows with the options would be in the thousands at 500. The keys come 50 ms apart. Each once woke positioning, which asked for three frames to check whether the popup moved, about 30 a run. Nothing inside a popup can move it, so now only the opening's last frames ask.

**Tests:**

- `fanout.test.ts` › moving the highlight in an open select updates only options that read it
- `select.counts.spec.ts` › arrow keys do no work that grows with the option count

**Run:**

```bash
cd packages/svelte && ../../scripts/test-slot.sh npx vitest run test/fanout.test.ts -t 'moving the highlight in an open select updates only options that read it'
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/select.counts --project react -g 'arrow keys do no work that grows with the option count'
```

<a id="select-open"></a>

### select.open

**Measures:** Renders and attribute reads when a closed select, whose options are already rendered, opens.

**Why:** A closed select has rendered its options, and opening changes none of them but the one it highlights. When every option hears the open, each one renders again or reads its attributes back, so a long select pays for its length on every open.

**Budget:**

- No `plain` renders.
- No `watched` renders.
- At most 30 `getAttribute` calls.

**Notes:** The first option is selected and gains the highlight. It's a plain one. Web components read back the attributes of the parts an open reaches: the trigger, the value and the content, 27. Options read none, since they hear only the highlight and their own entry in the listing (packages/core/src/foundation/lists/listbox-listing.ts). 40 until 2026-10-10.

**Tests:**

- `select.counts.spec.ts` › opening renders and reads back no option it already rendered

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/select.counts --project react -g 'opening renders and reads back no option it already rendered'
```

<a id="combobox-arrow-key"></a>

### combobox.arrow-key

**Measures:** Work done by 10 ArrowDown presses 50 ms apart in an open combobox.

**Why:** Moving the highlight changes two options. Work that grows with the options makes a long combobox lag on every key.

**Budget:**

- No `plain` renders.
- At most 20 `watched` renders.
- No `compareDocumentPosition` calls.
- At most 60 `getBoundingClientRect` calls.
- At most 8 `requestAnimationFrame` calls.

**Notes:** As for a select. The input keeps focus, so nothing scrolls into view by focus, and positioning reads 0 to 2 rectangles a run. The keys come 50 ms apart. Each once woke positioning, which asked for three frames to check whether the popup moved, about 30 a run. Nothing inside a popup can move it, so now only the opening's last frames ask.

**Tests:**

- `combobox.counts.spec.ts` › arrow keys do no work that grows with the option count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/combobox.counts --project react -g 'arrow keys do no work that grows with the option count'
```

<a id="combobox-open"></a>

### combobox.open

**Measures:** Renders and attribute reads when a combobox opens its list.

**Why:** A closed combobox renders no options in React and Vue, so opening renders each once. Rendering each twice doubles the cost of opening a long list, and web components, whose options are in the markup already, have nothing to read back for options that didn't change.

**Budget:**

- At most 1 render per item.
- At most 60 `getAttribute` calls.

**Notes:** Web components: the input, the content and the list, 57. Options read none. 80 until 2026-10-10.

**Tests:**

- `combobox.counts.spec.ts` › opening renders each option once

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/combobox.counts --project react -g 'opening renders each option once'
```

<a id="combobox-type"></a>

### combobox.type

**Measures:** Renders and attribute reads when one character typed into an open combobox filters its options.

**Why:** Typing runs the filter, which checks every option, but only options that start or stop matching show a change. An option that matches before and after has nothing new to show, so it shouldn't render or read its attributes back.

**Budget:**

- No `plain` renders.
- At most 2 `watched` renders.
- No `compareDocumentPosition` calls.
- At most 60 `getAttribute` calls.
- `rendersPerChangedOption`: 0.

**Notes:** "I" matches every option, so none changes. Options that read `highlighted` may show the highlight moving to the first match. Web components read back the attributes of the input, the root, the content and the list twice on the first character, once for the text and once for the flag that says it was typed, 55, and none of the options'. 50 until 2026-10-10, before the gate first passed. "7" hides every option without a 7 in its label. Core writes `hidden` on those itself, so none of them renders, and no other option does. One render per hidden option until 2026-10-13.

**Tests:**

- `combobox.counts.spec.ts` › typing what every option matches reaches no option
- `combobox.counts.spec.ts` › typing a filter renders no option it hides

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/combobox.counts --project react
```

<a id="popup-reopen"></a>

### popup.reopen

**Measures:** Frames from Enter on the trigger of a menu, select, popover or dialog that opened and closed before, until the popup settles.

**Why:** A popup that shows a frame late, or moves once it shows, looks slow however little work it does. Positioning places a popup in the frame it mounts, and focus moves into it in that frame too.

**Budget:**

- `frames`: 1.

**Notes:** Settled: shown, in place, with focus inside it, and the same two frames later. Frames are counted from the key press.

**Tests:**

- `reopen.counts.spec.ts` › a menu settles in the frame it reopens
- `reopen.counts.spec.ts` › a select settles in the frame it reopens
- `reopen.counts.spec.ts` › a popover settles in the frame it reopens
- `reopen.counts.spec.ts` › a dialog settles in the frame it reopens

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/reopen.counts --project react
```

<a id="slider-drag"></a>

### slider.drag

**Measures:** Renders, layout reads, attribute reads and writes, and restyled elements for 10 pointer moves while dragging the last thumb of a slider with many thumbs.

**Why:** A drag sends a move every frame. Moving one thumb changes that thumb, the indicator and its neighbours' bounds, so work that grows with the thumbs makes a drag lag on every frame.

**Budget:**

- No `plain` renders.
- At most 10 `watched` renders.
- At most 10 `indicator` renders.
- No `getBoundingClientRect` calls.
- No `offsetWidth` calls.
- No `offsetHeight` calls.
- No `getComputedStyle` calls.
- At most 400 `getAttribute` calls.
- At most 200 attribute and style writes.
- `restyledPerMove`: 10.

**Notes:** Per move: the moved thumb renders if it reads its value, and the indicator renders. The press read the track's box, so moves read no layout. Web components read back the attributes of the parts a move reaches, 35 a move. 1,500 until 2026-10-10, when every thumb heard every move and web read back 134 a move at 10 thumbs and 6,014 at 500. Thumbs now select on their own value. The moved thumb, its input, its neighbour's input, the indicator and the value: 7 to 16 a move. 700 until 2026-10-10, when every thumb's input wrote its bounds on every move, 31 to 61 a move at 10 thumbs. The thumb, its input, the indicator and the track: 6 or 7. 20 until 2026-10-10, when Vue restyled every thumb it rendered again.

**Tests:**

- `slider.counts.spec.ts` › dragging a thumb does no work that grows with the thumb count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/slider.counts --project react -g 'dragging a thumb does no work that grows with the thumb count'
```

<a id="slider-step-key"></a>

### slider.step-key

**Measures:** Renders, layout reads, and attribute reads and writes for 10 ArrowRight presses on the last thumb of a slider with many thumbs.

**Why:** A key moves one thumb, like a drag's move, and a held key repeats it many times a second.

**Budget:**

- No `plain` renders.
- At most 10 `watched` renders.
- At most 10 `indicator` renders.
- No `getBoundingClientRect` calls.
- No `offsetWidth` calls.
- No `offsetHeight` calls.
- At most 10 `getComputedStyle` calls.
- At most 400 `getAttribute` calls.
- At most 200 attribute and style writes.

**Notes:** Each key reads the thumb's direction once. As for a drag.

**Tests:**

- `slider.counts.spec.ts` › arrow keys on a thumb do no work that grows with the thumb count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/slider.counts --project react -g 'arrow keys on a thumb do no work that grows with the thumb count'
```

<a id="resizable-drag"></a>

### resizable.drag

**Measures:** Renders, layout reads, attribute reads and writes, and restyled elements for 10 pointer moves while dragging the first handle of a group with many panels.

**Why:** A drag sends a move every frame. Moving one handle resizes the two panels beside it, so work that grows with the panels makes a drag lag on every frame.

**Budget:**

- No `plain` renders.
- At most 10 `watched` renders.
- No `handle` renders.
- No `getBoundingClientRect` calls.
- No `offsetWidth` calls.
- No `offsetHeight` calls.
- No `getComputedStyle` calls.
- At most 120 `getAttribute` calls.
- At most 50 attribute and style writes.
- `restyledPerMove`: 5.

**Notes:** The second panel reads its size, so it renders once a move. The press measured the panels, so moves read no layout. The two panels and the two handles a move changes read back their live attributes, 9 a move. 400 until 2026-10-10, when every panel and handle did, 37 a move with 10 panels and 1,997 with 500. Panels and handles now select on their own size and value. Two panels' sizes and the handle's value: 4 a move. The two panels the move resizes. 40 until 2026-10-10, when the cursor sheet was written again on every move and restyled the whole page, 28 elements with 10 panels and 1,008 with 500.

**Tests:**

- `resizable.counts.spec.ts` › dragging a handle does no work that grows with the panel count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/resizable.counts --project react -g 'dragging a handle does no work that grows with the panel count'
```

<a id="resizable-step-key"></a>

### resizable.step-key

**Measures:** Renders, layout and style reads, and attribute reads and writes for 10 ArrowRight presses on the first handle of a group with many panels.

**Why:** A key moves one handle, like a drag's move, and a held key repeats it many times a second.

**Budget:**

- No `plain` renders.
- At most 10 `watched` renders.
- No `handle` renders.
- No `getBoundingClientRect` calls.
- No `offsetWidth` calls.
- No `offsetHeight` calls.
- At most 20 `getComputedStyle` calls.
- No `compareDocumentPosition` calls.
- At most 100 `getAttribute` calls.
- At most 80 attribute and style writes.

**Notes:** Each key reads the handle's direction and the root font size once, and the panels' props in the order the group last found, without sorting. 110 style reads and 400 ordering calls until 2026-10-10, when each key sorted the panels and read the root font size once per panel: 11 and 38 a key with 10 panels, 501 and 998 with 500. The attributes read back are the panels' and handles' a key changes, 8 a key, as for a drag. Two panels' sizes and the handle's value, and the handle's bounds: 5 or 6 a key.

**Tests:**

- `resizable.counts.spec.ts` › arrow keys on a handle do no work that grows with the panel count

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/resizable.counts --project react -g 'arrow keys on a handle do no work that grows with the panel count'
```

<a id="scroll-area-drag"></a>

### scroll-area.drag

**Measures:** Renders, layout reads, attribute reads and writes, and restyled elements for 10 pointer moves while dragging the thumb of a scroll area with many items.

**Why:** Dragging the thumb scrolls the viewport every frame. The content doesn't change, so nothing in it should render, and the variables written each frame shouldn't restyle it.

**Budget:**

- No `item` renders.
- No `content` renders.
- No `thumb` renders.
- No `getBoundingClientRect` calls.
- No `offsetWidth` calls.
- No `offsetHeight` calls.
- No `getComputedStyle` calls.
- No `getAttribute` calls.
- At most 40 attribute and style writes.
- `restyledPerMove`: 4.

**Notes:** Moves read nothing the counters see: the viewport's scroll position and size come from properties they don't count. Three variables on the root and the thumb's offset: 4 a move. The root, the scrollbar and the thumb: the root's variables don't inherit. 10 until 2026-10-10, when they did and the count was 5 or 505 at 500 items, depending on the page's history.

**Tests:**

- `scroll-area.counts.spec.ts` › dragging the thumb does no work that grows with the item count
- `scroll-area.counts.spec.ts` › dragging the thumb restyles only the scroll area's own parts

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/scroll-area.counts --project react
```

<a id="leaks-cycles"></a>

### leaks.cycles

**Measures:** What stays behind after a menu, select, combobox, popover, dialog, tooltip, accordion or collapsible opens and closes 200 times, the arrow keys move through tabs, a toolbar or a tree 200 times, or a slider, a resizable handle or a scroll area's thumb is dragged 200 times (stepped with keys, or scrolled with the wheel so its scrollbar shows and hides), then mounts and unmounts 200 times, against the page after a warmup: listeners on the window and the document, pending animation frames, open layers, detached parts, and heap after garbage collection.

**Why:** A popup adds document listeners, animation frames and a layer while it's open, a panel animates and observes its size, tabs swap panels and measure their indicator, and a slider, a resizable group or a scroll area adds document listeners and frames while it's dragged or scrolled. A page does each thousands of times. Anything it doesn't give back grows with every open, key, drag or mount, until the page slows or runs out of memory.

**Budget:**

- `listeners`: 0.
- `frames`: 0.
- `layers`: 0.
- `detached`: 0.
- `heapKB`: 1,024.

**Notes:** Listeners, frames, layers and detached parts come back to exactly what they were. Nothing keeps the last popup closed once it unmounts, which a test checks without a warmup. After the warmup, 200 opens and 400 mounts grow the development heap by 120 to 600 KB, from compiled code and the test's own handles. One leaked popup per open is about 25 KB, 5 MB in all.

**Tests:**

- `leaks.spec.ts` › opening and closing <withArticle(name)> 200 times, then mounting and unmounting it 200 times, leaves nothing behind
- `leaks.spec.ts` › unmounting <withArticle(name)> after it opens and closes once leaves none of its parts alive
- `leaks.spec.ts` › dragging a slider 200 times, then mounting and unmounting it 200 times, leaves nothing behind
- `leaks.spec.ts` › moving through <name> with the arrow keys 200 times, then mounting and unmounting it 200 times, leaves nothing behind
- `leaks.spec.ts` › resizing a resizable group 200 times, then mounting and unmounting it 200 times, leaves nothing behind
- `leaks.spec.ts` › dragging and scrolling a scroll area 200 times, then mounting and unmounting it 200 times, leaves nothing behind

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/leaks --project react
```

<a id="leaks-unmount-open"></a>

### leaks.unmount-open

**Measures:** What stays behind after a popup, an accordion or a collapsible unmounts while it's open, tabs, a toolbar or a tree right after an arrow key, or a slider, a resizable group or a scroll area in the middle of a drag, 50 times: listeners, pending animation frames, open layers, detached parts and heap.

**Why:** Unmounting skips the close and the end of the drag: the layer, the outside press and Escape listeners, positioning's and animations' frames, the work an arrow key starts, and a drag's pointer listeners must all go with the component, or every route change with a popup open or a handle or thumb held leaks them.

**Budget:**

- `listeners`: 0.
- `frames`: 0.
- `layers`: 0.
- `detached`: 0.
- `heapKB`: 1,024.

**Tests:**

- `leaks.spec.ts` › opening and closing <withArticle(name)> 200 times, then mounting and unmounting it 200 times, leaves nothing behind
- `leaks.spec.ts` › unmounting <withArticle(name)> while it's open 50 times leaves nothing behind
- `leaks.spec.ts` › unmounting <withArticle(name)> after it opens and closes once leaves none of its parts alive
- `leaks.spec.ts` › dragging a slider 200 times, then mounting and unmounting it 200 times, leaves nothing behind
- `leaks.spec.ts` › unmounting a slider in the middle of a drag 50 times leaves nothing behind
- `leaks.spec.ts` › moving through <name> with the arrow keys 200 times, then mounting and unmounting it 200 times, leaves nothing behind
- `leaks.spec.ts` › unmounting <name> right after an arrow key 50 times leaves nothing behind
- `leaks.spec.ts` › resizing a resizable group 200 times, then mounting and unmounting it 200 times, leaves nothing behind
- `leaks.spec.ts` › unmounting a resizable group in the middle of a drag 50 times leaves nothing behind
- `leaks.spec.ts` › dragging and scrolling a scroll area 200 times, then mounting and unmounting it 200 times, leaves nothing behind
- `leaks.spec.ts` › unmounting a scroll area in the middle of a thumb drag 50 times leaves nothing behind

**Run:**

```bash
cd tests && PLAYGROUND_PORT=5310 ../scripts/test-slot.sh npx playwright test specs/leaks --project react
```

<!-- catalog:end -->
