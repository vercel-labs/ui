// Every count gate's budget, with why it is what it is. The gates are in
// tests/specs/*.counts.spec.ts and packages/core/test/store-fanout.test.ts.
// tests/perf/README.md is the catalog, generated from this file by
// `pnpm docs:perf`. A budget is
// the same at every item count, so work that grows with the count fails at
// the larger one.
const budgets = {
  "menu.arrow-key": {
    measures: "Work done by 10 ArrowDown presses 50 ms apart in an open menu.",
    why: "Moving the highlight changes two items. Sorting every item on each key made long menus lag.",
    // Plain items never re-render. Items that read `highlighted` re-render
    // when they gain or lose it: at most two per key.
    renders: { plain: 0, watched: 20 },
    // The keys come 50 ms apart. Each once woke positioning, which asked for
    // three frames to check whether the popup moved, about 30 a run. Nothing
    // inside a popup can move it, so now only the opening's last frames ask.
    counts: { compareDocumentPosition: 0, requestAnimationFrame: 8 },
    // Parts one highlight move notifies: the item losing it and the one gaining it.
    notified: 2,
  },
  "menu.hover": {
    measures:
      "Work done by moving the pointer across 10 items of an open menu.",
    why: "Each hover moves the highlight, like an arrow key, and runs on every pointer move.",
    renders: { plain: 0, watched: 20 },
    counts: { compareDocumentPosition: 0 },
  },
  "menu.open": {
    measures: "Renders per item when a menu opens.",
    why: "Opening mounts each item once. Re-rendering every item for each change that follows, like the menu learning its side, multiplies the cost of opening a long menu.",
    // Each item renders once, and the checkbox item too.
    renders: { perItem: 1 },
  },
  "menu.checkbox": {
    measures:
      "Parts notified, renders and attribute reads when one checkbox item in an open menu is toggled.",
    why: "Only the toggled item and its indicator show the change. Vue re-rendered every item for any change that affects rendering (H3), and every part heard the checked items' record change, so React compared every item's attributes and web components read them back.",
    // The item and its indicator. Gated in packages/core/test/store-fanout.test.ts.
    notified: 2,
    renders: { plain: 0, watched: 0, checkbox: 1 },
    // Web components read back the attributes of the parts a toggle reaches:
    // the item's and its indicator's, which appears.
    counts: { getAttribute: 20 },
  },
  "menu.idle": {
    measures:
      "Layout reads while a menu sits open and nothing moves, over 30 frames.",
    why: "Positioning checked the anchor and the popup every frame for as long as a popup was open, forcing work on pages that were otherwise idle (H7).",
    // Asleep, positioning still checks every `checkEvery` ms for moves no
    // event reports, like an anchor moved by the Web Animations API. Each
    // check reads the anchor's rectangle and the popup's size once.
    checkEvery: 500,
    counts: { getBoundingClientRect: 1, offsetWidth: 1, offsetHeight: 1 },
  },
  "menu.scroll": {
    measures:
      "Elements restyled per style recalculation while the page scrolls under an open menu.",
    why: "Positioning writes the popup's place and the room it has on every frame it moves. The room was an inherited custom property, so every item inside the popup restyled each frame.",
    // The popup, and the page's scroller.
    restyledPerRecalc: 4,
  },
  "tabs.arrow-key": {
    measures: "Work done by 10 ArrowRight presses 50 ms apart in a tab list.",
    why: "Roving focus sorted every tab on each key, and every tab and panel heard each switch, so web components compared all their attributes.",
    // Web components compare the attributes of the parts a switch reaches:
    // the two tabs and two panels it changes, and the list, about 62 per
    // switch. A short list wraps around and flips the activation direction,
    // which every part shows, so the budget leaves room for 10 tabs doing so.
    // Each switch shows a panel, which asks for one frame to draw its
    // starting style. It asked for two until 2026-10-13, so the page was
    // still drawing when the next key came.
    counts: {
      compareDocumentPosition: 0,
      getAttribute: 1000,
      requestAnimationFrame: 12,
    },
  },
  "grid.arrow-key": {
    measures:
      "Cells notified when an arrow key moves the active cell of a grid.",
    why: "Every cell heard every move and wrote its attributes again, about 11 ms per key on a 100 by 26 spreadsheet.",
    // The cell that loses the tab stop and the one that takes it.
    notified: 2,
  },
  "grid.extend": {
    measures:
      "Cells notified when Shift+Arrow grows a range of 2 rows by 5 columns by a row.",
    why: "A range change reaches the cells that join or leave it and the cells of the sides that move, never the rest of the grid.",
    // The row that joins, and the row that stops being the bottom edge.
    notified: 10,
  },
  "accordion.mount": {
    measures:
      "Sorts of the items into document order when a long accordion mounts, with closed panels unmounted and kept for find in page.",
    why: "Each item put every item in order again as it mounted, and each panel wrote the panels again, and every item heard both, so mounting grew with the square of the item count.",
    // The items are put in order once, after the last mounts. One sort compares
    // each item log2(n) times at most, and once when the items mount in order.
    sorts: 1,
  },
  "accordion.toggle": {
    measures: "Work done by opening one item of a long accordion.",
    why: "Opening an item mounts its panel, which put every item in order again, and every item and trigger heard the panels change, so web components compared all their attributes.",
    // Web components read back the opened item's parts, 17 at any size.
    counts: { compareDocumentPosition: 0, getAttribute: 20 },
  },
  "tree.mount": {
    measures:
      "Sorts of a long tree's items into document order when it mounts.",
    why: "Positions come from each parent's items in document order. Putting every item in order again as each one mounted made mounting a long tree quadratic.",
    // Each parent's items are put in order once, after they mount, and the
    // roving group puts every item in order once for the arrow keys.
    sorts: 2,
  },
  "tree.expand": {
    measures: "Work done by expanding one folder of a long tree.",
    why: "Expanding mounts a group of items, which once bumped a version every item heard, so every item wrote its position again and the whole tree was put in order. The roving group then sorted, or walked, every item again to place the two that joined.",
    // Only the folder's own items are put in order, the two items that join
    // take their places in the roving group's order by binary search, and web
    // components read back the folder's parts and its two items', 72 at any size.
    counts: { compareDocumentPosition: 1, getAttribute: 80, nextNode: 3 },
    inserts: 2,
  },
  "collapsible.toggle": {
    measures: "Work done by opening one of a long list of collapsibles.",
    why: "Each collapsible is its own instance, so opening one must not reach the others, as a shared store or a document listener would.",
    // Web components read back the opened collapsible's parts, 11 at any size.
    counts: { compareDocumentPosition: 0, getAttribute: 12 },
  },
  "toolbar.arrow-key": {
    measures: "Work done by 10 ArrowRight presses in a toolbar.",
    why: "Roving focus sorted every item on each key.",
    counts: { compareDocumentPosition: 0 },
    // Each button notifies only itself when it binds as another element.
    notifiedPerPart: 1,
  },
  "timeline.arrow-key": {
    measures: "Work done by 10 ArrowDown presses in a timeline.",
    why: "A long activity feed has hundreds of events, each with five parts inside, so a key that reached every part would grow with the feed.",
    // Web components compare the attributes of the parts a move reaches: the
    // event losing the tab stop and the one taking it, about 20 per move.
    // Parts inside an event never hear a move.
    counts: { compareDocumentPosition: 0, getAttribute: 400 },
  },
  "tooltip.focus": {
    measures:
      "Renders, layout and style reads, and attribute reads and writes for 10 Tab presses from the button before a row of tooltip triggers, each showing the next tooltip.",
    why: "Moving focus along a toolbar closes one tooltip and opens the next on every key. Tooltips share only module state, so a focus move should reach the tooltip closing and the one opening, never every trigger on the page.",
    // The first press opens a tooltip and each after it closes one and
    // opens the next, so contents that read their state render 19 times.
    // Triggers render nothing, since a focus move changes none of their
    // attributes. Solid has no renders to count after mount, and web none at all.
    renders: { trigger: 0, tooltip: 20 },
    // Positioning reads the trigger's and the content's boxes for each open,
    // then checks every 500 ms while it sleeps, so layout reads grow with
    // how long the presses take, not with the triggers: 40 to 62 rectangle
    // reads and 30 to 52 of each size here, and with 30 frames after each
    // press, about 5 seconds, 71 at 10 triggers and 73 at 500. Each press
    // reads a computed style twice. Web components read back
    // the attributes of the two tooltips a press reaches, 324 in all; the
    // others read 28 to 47.
    counts: {
      compareDocumentPosition: 0,
      getAttribute: 400,
      getBoundingClientRect: 100,
      offsetWidth: 100,
      offsetHeight: 100,
      getComputedStyle: 20,
    },
    // Every framework writes about 30 attributes and styles a press, 302 in
    // all: the closing tooltip's state, and the opening one's state,
    // placement and position, which takes 15 style writes. Checked against
    // a change that told every tooltip about each open: 5,000 trigger
    // renders, 5,302 writes and, on web, 55,388 attribute reads at 500.
    writes: 400,
  },
  "slot-state.render": {
    measures: "Subscriptions custom parts make when they render again.",
    why: "A part that resubscribes on every render pays for it on every render, and churns the store's listeners.",
    // Re-rendering parts adds none: each part keeps the one it made on mount.
    subscriptions: 0,
  },
  "rows.mount": {
    measures:
      "Renders and elements per row when rows mount, each with a closed menu, select and tooltip.",
    why: "A table with a menu, a select and a tooltip in every row pays for every closed popup when it mounts. A closed menu renders none of its items. A closed select renders all its options, by design: its trigger shows the selected label, and the server HTML needs the options for it. So a row costs one more element and one more render for each option its select has, and nothing else in it grows with the options. Rendering the options only on first open is a separate decision, so this budget records today's cost.",
    // Per row: each of the three triggers renders once, the select's value
    // twice (again once its options give it the label), and the tooltip's
    // content once, hidden, since the trigger points at it with
    // aria-describedby. A closed menu's items never render.
    renders: { trigger: 3, value: 2, tooltip: 1, menuItem: 0, perOption: 1 },
    // Elements per row with no options, then per option. Web components'
    // markup holds every part, the menu's items and wrapper elements included.
    // Svelte renders the same elements as React and Vue; its anchors are comments.
    elements: { react: 8, vue: 8, web: 17, svelte: 8, solid: 8, perOption: 1 },
  },
  "rows.labels": {
    measures:
      "Reads of a control's `labels` while rows of closed menus, selects and tooltips mount.",
    why: "Chromium answers `labels` by walking the whole document, so a page that reads it once per control mounts in quadratic time: 2,000 rows of web selects took 1,979 ms against React's 603. Core finds labels with the closest `<label>` and `label[for]` instead, and reads none for a control `aria-label` already names.",
    // Every framework, at every row count. Before the fix, web components
    // read a select's ElementInternals.labels twice as it mounted: to name
    // the element and to name its trigger.
    counts: { labels: 0 },
  },
  "select.arrow-key": {
    measures:
      "Work done by 10 ArrowDown presses 50 ms apart in an open select.",
    why: "Moving the highlight changes two options. Work that grows with the options makes a long select lag on every key.",
    // Plain options never re-render. Options that read `highlighted`
    // re-render when they gain or lose it: at most two per key. Keeping the
    // highlighted option in view reads its rectangle and the list's, and
    // positioning reads a few more on each frame the keys arrive in, about
    // 20 a run. Work that grows with the options would be in
    // the thousands at 500.
    renders: { plain: 0, watched: 20 },
    // The keys come 50 ms apart. Each once woke positioning, which asked for
    // three frames to check whether the popup moved, about 30 a run. Nothing
    // inside a popup can move it, so now only the opening's last frames ask.
    counts: {
      compareDocumentPosition: 0,
      getBoundingClientRect: 60,
      requestAnimationFrame: 8,
    },
  },
  "select.open": {
    measures:
      "Renders and attribute reads when a closed select, whose options are already rendered, opens.",
    why: "A closed select has rendered its options, and opening changes none of them but the one it highlights. When every option hears the open, each one renders again or reads its attributes back, so a long select pays for its length on every open.",
    // The first option is selected and gains the highlight. It's a plain one.
    renders: { plain: 0, watched: 0 },
    // Web components read back the attributes of the parts an open reaches:
    // the trigger, the value and the content, 27. Options read none, since
    // they hear only the highlight and their own entry in the listing
    // (packages/core/src/foundation/lists/listbox-listing.ts). 40 until 2026-10-10.
    counts: { getAttribute: 30 },
  },
  "combobox.arrow-key": {
    measures:
      "Work done by 10 ArrowDown presses 50 ms apart in an open combobox.",
    why: "Moving the highlight changes two options. Work that grows with the options makes a long combobox lag on every key.",
    // As for a select. The input keeps focus, so nothing scrolls into view
    // by focus, and positioning reads 0 to 2 rectangles a run.
    renders: { plain: 0, watched: 20 },
    // The keys come 50 ms apart. Each once woke positioning, which asked for
    // three frames to check whether the popup moved, about 30 a run. Nothing
    // inside a popup can move it, so now only the opening's last frames ask.
    counts: {
      compareDocumentPosition: 0,
      getBoundingClientRect: 60,
      requestAnimationFrame: 8,
    },
  },
  "combobox.open": {
    measures: "Renders and attribute reads when a combobox opens its list.",
    why: "A closed combobox renders no options in React and Vue, so opening renders each once. Rendering each twice doubles the cost of opening a long list, and web components, whose options are in the markup already, have nothing to read back for options that didn't change.",
    renders: { perItem: 1 },
    // Web components: the input, the content and the list, 57. Options read
    // none. 80 until 2026-10-10.
    counts: { getAttribute: 60 },
  },
  "combobox.type": {
    measures:
      "Renders and attribute reads when one character typed into an open combobox filters its options.",
    why: "Typing runs the filter, which checks every option, but only options that start or stop matching show a change. An option that matches before and after has nothing new to show, so it shouldn't render or read its attributes back.",
    // "I" matches every option, so none changes. Options that read
    // `highlighted` may show the highlight moving to the first match. Web
    // components read back the attributes of the input, the root, the content
    // and the list twice on the first character, once for the text and once
    // for the flag that says it was typed, 55, and none of the options'. 50
    // until 2026-10-10, before the gate first passed.
    renders: { plain: 0, watched: 2 },
    counts: { compareDocumentPosition: 0, getAttribute: 60 },
    // "7" hides every option without a 7 in its label. Core writes `hidden`
    // on those itself, so none of them renders, and no other option does.
    // One render per hidden option until 2026-10-13.
    rendersPerChangedOption: 0,
  },
  "popup.open-modal": {
    measures:
      "Style recalculations that restyle the whole page while a modal popover or a dialog opens over a page of many buttons.",
    why: "A modal open makes the page inert and locks its scroll, which restyles the page once. A layout read after those writes, or a CSS property registered on open, made the browser restyle it again in the same task, 3 to 4 times on a phone menu.",
    // The one the inert page and the scroll lock need.
    pageRestyles: 1,
  },
  "popup.reopen": {
    measures:
      "Frames from Enter on the trigger of a menu, select, popover or dialog that opened and closed before, until the popup settles.",
    why: "A popup that shows a frame late, or moves once it shows, looks slow however little work it does. Positioning places a popup in the frame it mounts, and focus moves into it in that frame too.",
    // Settled: shown, in place, with focus inside it, and the same two
    // frames later. Frames are counted from the key press.
    frames: 1,
  },
  "slider.drag": {
    measures:
      "Renders, layout reads, attribute reads and writes, and restyled elements for 10 pointer moves while dragging the last thumb of a slider with many thumbs.",
    why: "A drag sends a move every frame. Moving one thumb changes that thumb, the indicator and its neighbours' bounds, so work that grows with the thumbs makes a drag lag on every frame.",
    // Per move: the moved thumb renders if it reads its value, and the
    // indicator renders. The press read the track's box, so moves read no
    // layout.
    renders: { plain: 0, watched: 10, indicator: 10 },
    counts: {
      getBoundingClientRect: 0,
      offsetWidth: 0,
      offsetHeight: 0,
      getComputedStyle: 0,
      // Web components read back the attributes of the parts a move
      // reaches, 35 a move. 1,500 until 2026-10-10, when every thumb heard
      // every move and web read back 134 a move at 10 thumbs and 6,014 at
      // 500. Thumbs now select on their own value.
      getAttribute: 400,
    },
    // The moved thumb, its input, its neighbour's input, the indicator and
    // the value: 7 to 16 a move. 700 until 2026-10-10, when every thumb's
    // input wrote its bounds on every move, 31 to 61 a move at 10 thumbs.
    writes: 200,
    // The thumb, its input, the indicator and the track: 6 or 7. 20 until
    // 2026-10-10, when Vue restyled every thumb it rendered again.
    restyledPerMove: 10,
  },
  "slider.step-key": {
    measures:
      "Renders, layout reads, and attribute reads and writes for 10 ArrowRight presses on the last thumb of a slider with many thumbs.",
    why: "A key moves one thumb, like a drag's move, and a held key repeats it many times a second.",
    renders: { plain: 0, watched: 10, indicator: 10 },
    // Each key reads the thumb's direction once.
    counts: {
      getBoundingClientRect: 0,
      offsetWidth: 0,
      offsetHeight: 0,
      getComputedStyle: 10,
      getAttribute: 400,
    },
    // As for a drag.
    writes: 200,
  },
  "resizable.drag": {
    measures:
      "Renders, layout reads, attribute reads and writes, and restyled elements for 10 pointer moves while dragging the first handle of a group with many panels.",
    why: "A drag sends a move every frame. Moving one handle resizes the two panels beside it, so work that grows with the panels makes a drag lag on every frame.",
    // The second panel reads its size, so it renders once a move. The press
    // measured the panels, so moves read no layout.
    renders: { plain: 0, watched: 10, handle: 0 },
    // The two panels and the two handles a move changes read back their
    // live attributes, 9 a move. 400 until 2026-10-10, when every panel and
    // handle did, 37 a move with 10 panels and 1,997 with 500. Panels and
    // handles now select on their own size and value.
    counts: {
      getBoundingClientRect: 0,
      offsetWidth: 0,
      offsetHeight: 0,
      getComputedStyle: 0,
      getAttribute: 120,
    },
    // Two panels' sizes and the handle's value: 4 a move.
    writes: 50,
    // The two panels the move resizes. 40 until 2026-10-10, when the cursor
    // sheet was written again on every move and restyled the whole page, 28
    // elements with 10 panels and 1,008 with 500.
    restyledPerMove: 5,
  },
  "resizable.step-key": {
    measures:
      "Renders, layout and style reads, and attribute reads and writes for 10 ArrowRight presses on the first handle of a group with many panels.",
    why: "A key moves one handle, like a drag's move, and a held key repeats it many times a second.",
    renders: { plain: 0, watched: 10, handle: 0 },
    // Each key reads the handle's direction and the root font size once. The
    // attributes read back are the live ones of the two handles it moves, 5 each,
    // and `is` on the 2 panels Svelte renders: 12 a key, 10 before tabindex went live.
    counts: {
      getBoundingClientRect: 0,
      offsetWidth: 0,
      offsetHeight: 0,
      getComputedStyle: 20,
      compareDocumentPosition: 0,
      getAttribute: 120,
    },
    // Two panels' sizes and the handle's value, and the handle's bounds: 5 or 6 a key.
    writes: 80,
  },
  "scroll-area.drag": {
    measures:
      "Renders, layout reads, attribute reads and writes, and restyled elements for 10 pointer moves while dragging the thumb of a scroll area with many items.",
    why: "Dragging the thumb scrolls the viewport every frame. The content doesn't change, so nothing in it should render, and the variables written each frame shouldn't restyle it.",
    renders: { item: 0, content: 0, thumb: 0 },
    // Moves read nothing the counters see: the viewport's scroll position and
    // size come from properties they don't count.
    counts: {
      getBoundingClientRect: 0,
      offsetWidth: 0,
      offsetHeight: 0,
      getComputedStyle: 0,
      getAttribute: 0,
    },
    // Three variables on the root and the thumb's offset: 4 a move.
    writes: 40,
    // The root, the scrollbar and the thumb: the root's variables don't
    // inherit. 10 until 2026-10-10, when they did and the count was 5 or
    // 505 at 500 items, depending on the page's history.
    restyledPerMove: 4,
  },
  "leaks.cycles": {
    measures:
      "What stays behind after a menu, select, combobox, popover, dialog, tooltip, accordion or collapsible opens and closes 200 times, the arrow keys move through tabs, a toolbar or a tree 200 times, or a slider, a resizable handle or a scroll area's thumb is dragged 200 times (stepped with keys, or scrolled with the wheel so its scrollbar shows and hides), then mounts and unmounts 200 times, against the page after a warmup: listeners on the window and the document, pending animation frames, open layers, detached parts, and heap after garbage collection.",
    why: "A popup adds document listeners, animation frames and a layer while it's open, a panel animates and observes its size, tabs swap panels and measure their indicator, and a slider, a resizable group or a scroll area adds document listeners and frames while it's dragged or scrolled. A page does each thousands of times. Anything it doesn't give back grows with every open, key, drag or mount, until the page slows or runs out of memory.",
    // Listeners, frames, layers and detached parts come back to exactly what
    // they were. Nothing keeps the last popup closed once it unmounts, which
    // a test checks without a warmup.
    listeners: 0,
    frames: 0,
    layers: 0,
    detached: 0,
    // After the warmup, 200 opens and 400 mounts grow the development heap
    // by 120 to 600 KB, from compiled code and the test's own handles. One
    // leaked popup per open is about 25 KB, 5 MB in all.
    heapKB: 1024,
  },
  "leaks.unmount-open": {
    measures:
      "What stays behind after a popup, an accordion or a collapsible unmounts while it's open, tabs, a toolbar or a tree right after an arrow key, or a slider, a resizable group or a scroll area in the middle of a drag, 50 times: listeners, pending animation frames, open layers, detached parts and heap.",
    why: "Unmounting skips the close and the end of the drag: the layer, the outside press and Escape listeners, positioning's and animations' frames, the work an arrow key starts, and a drag's pointer listeners must all go with the component, or every route change with a popup open or a handle or thumb held leaks them.",
    listeners: 0,
    frames: 0,
    layers: 0,
    detached: 0,
    heapKB: 1024,
  },
}

export { budgets }
