# Styling the examples

Every example is styled in Rhea, the shadcn/ui style from preset `b27GcrRo`: style Rhea, base color and theme neutral, font Inter, icons lucide, menu accent subtle, radius default. Rhea is compact: `h-8` controls, `rounded-2xl` controls, `rounded-xl` items, `rounded-3xl` panels, filled inputs with no border, soft `ring-1` popups instead of borders, and a wide translucent focus ring.

The source of truth is Rhea's stylesheet in shadcn/ui (`apps/v4/registry/styles/style-rhea.css`). Find the part by its `cn-*` class (`cn-dropdown-menu-item`, `cn-select-trigger`), then adapt it with the rules below. The recipes at the end are already adapted: copy them, then adjust.

## Rules

- **Demo styling.** Import directly from ui-sdk and style the parts inline with Tailwind using the neutral Rhea theme. CSS Modules examples belong in framework styling guides.
- **Button demos use secondary styling.** Apply the secondary colors to the button recipe below. Keep the normal cursor; don't add `cursor-pointer`.
- **Stable layout.** Keep controls in place when state changes or search results disappear. Reserve space for changing output where needed.
- **Inline every class.** Write classes on the element. No `const trigger = "..."`, no class helpers above the component, no `styles` objects, no shared style files. A class that repeats on ten items repeats ten times. A `className` that depends on state is an inline arrow: `className={(state) => (state.nested ? "..." : "...")}`. A value that varies per item in a data array (an avatar color) is data and may stay in the array.
- **shadcn/ui tokens, not palette colors.** `bg-primary`, `text-muted-foreground`, `bg-input/50`, `ring-ring/30`, `bg-popover`, `text-destructive`. The docs define the neutral theme and shadcn's radius scale in `apps/docs/app/global.css`, so examples paste into any shadcn/ui project. Write `dark:` only where Rhea does (`dark:bg-transparent`, `dark:ring-foreground/10`, `dark:hover:bg-input/30`). The available tokens: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent` (each with `-foreground`), `destructive`, `border`, `input`, `ring`.
- **Write the border color.** shadcn projects set `border-border` in a base layer; the docs don't. Every `border`, `border-b` or `divide-*` gets an explicit color: `border-border`, `border-input`.
- **ui-sdk's state attributes.** `data-open`, `data-highlighted`, `data-checked`, `data-selected`, `data-active`, `data-pressed`, `data-disabled`, `data-invalid`, `data-placeholder`, `data-side`, `data-orientation`. Read the component's docs page to see which parts set which. Rhea's `focus:` on items becomes `data-highlighted:`; `aria-expanded:` on triggers becomes `data-open:`; `aria-invalid:` becomes `data-invalid:` where the part sets it.
- **Transitions, not tw-animate.** The docs do not load `tw-animate-css`. Rhea's `animate-in fade-in-0 zoom-in-95` becomes `transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0`, with `origin-(--transform-origin)` on positioned popups.
- **CSS variables in Tailwind** are `prefix-(--var-name)`, never `prefix-[var(--var-name)]`.
- **Self-contained files.** An example imports only `@ui-sdk/*`, its framework (`react`, `vue`) and lucide. No imports from `examples/shared/*` or `examples/<name>/shared/*`. Data the example needs (a list of fruits, an FAQ, people) is written in the example file itself, as a `const` at the top or inline in the markup. Data is the one thing that may sit in a `const`; classes and styles never do. Copy the data into each framework's file, so they all show the same items.
- **Icons come from lucide**, imported by name: `lucide-react` in React, `@lucide/vue` in Vue, and `lucide` in web components, where `createElement` turns an icon into an element you can put in the template: `${createElement(ChevronDown, { class: "size-4", "aria-hidden": "true" }).outerHTML}`. lucide's `createElement` doesn't add `aria-hidden` the way the React and Vue packages do, so always pass it. Use the same icon in every framework. Size icons `size-4` unless Rhea says otherwise (`size-3.5` in checkboxes, `size-3` in badges). Muted icons are `text-muted-foreground`. Native text glyphs standing in for icons (✕, ⚑) become lucide icons too.
- **Demo-only text** (an `<output>` that shows the last action) is `mt-3 text-sm text-muted-foreground`. Drop the `mt-3` when the parent already has a `gap`.
- **Logical properties** for anything that flips in RTL: `ms-auto`, `ps-2`, `end-2`, `rtl:rotate-180` on chevrons. Rhea's `ml-auto`, `pl-2` and `right-2` become these.
- **Keep what the example teaches.** Restyling never removes a prop or a behavior. Examples have no comments: the docs page around an example explains it.

## Recipes

Focus ring, on every focusable control:
`outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30`

Invalid, on fields:
`data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40`

**Button, primary base recipe** (use the secondary colors below for button demos):
`inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-primary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-primary-foreground outline-none select-none transition-[color,background-color,box-shadow] hover:bg-primary/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px data-disabled:pointer-events-none data-disabled:opacity-50`

**Button, outline** (most triggers). The `data-open:*` classes apply only when the button is a popup trigger; drop them on a plain button:
`inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-border bg-background bg-clip-padding px-3 text-sm font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px data-open:bg-muted data-open:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 dark:bg-transparent dark:hover:bg-input/30`

**Button, secondary:** `bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]` in place of the primary colors.
**Button, ghost:** the outline recipe with `border-transparent bg-transparent` and `hover:bg-muted data-open:bg-muted dark:hover:bg-muted/50`.
**Button, destructive:** replace the primary colors and the focus ring colors, don't add to them, so `ring-ring/30` and `ring-destructive/20` never sit on one element: `bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40`.
**Sizes:** `xs` is `h-6 gap-1 px-2.5 text-xs`, `sm` is `h-7 gap-1 px-3`, `lg` is `h-9 px-4`, icon buttons are `size-8 px-0` (`size-7`, `size-6`, `size-9`) and drop the `gap`, `px` and text classes.
**Pill shape.** `rounded-2xl` on an `h-8` control is already a pill, so an example that teaches radius has to show something else (square, `rounded-md`), or drop what it no longer teaches.
**Link-style button inside a sentence:** `inline h-auto p-0 font-medium text-primary underline-offset-4 hover:underline` with the focus ring.
**Pending:** `data-pending:cursor-progress` on the button and a spinner (`LoaderCircle` from lucide (`Loader2` is a deprecated alias), `size-4 animate-spin`) that shows with `group-data-pending:inline-flex hidden`, or swaps with the label.
**Native checkbox input** (a plain `<input type="checkbox">` in a form example): `size-4 accent-primary`.
**Input inside a `font-medium` label** adds `font-normal`, since inputs inherit the label's weight.

**Input:**
`h-8 w-full min-w-0 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-base outline-none transition-[color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:opacity-50 md:text-sm`
**Textarea:** the input recipe with `min-h-16 resize-none py-2` and no `h-8`.
**Select trigger:** the input recipe with `flex w-fit items-center justify-between gap-1.5 px-3 py-2 text-sm data-placeholder:text-muted-foreground`, and a `size-4 text-muted-foreground` chevron.

**Popup** (menu, select, combobox, autocomplete, menubar):
`min-w-36 origin-(--transform-origin) rounded-2xl bg-popover p-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 dark:ring-foreground/10`
**Popover, hover card:** the popup recipe with `flex w-72 flex-col gap-4 rounded-3xl p-4` instead of `min-w-36 rounded-2xl p-1`.
**Command:** `rounded-3xl bg-popover p-1 text-popover-foreground`, items as below with `data-highlighted:bg-muted`.
**Tooltip:** `inline-flex origin-(--transform-origin) items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5 text-xs text-background transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0`

**Item** (menu, select, combobox; subtle accent):
`flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4`
Submenu trigger adds `data-open:bg-accent data-open:text-accent-foreground`. Destructive adds `text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive dark:data-highlighted:bg-destructive/20`. Select items reserve `pe-8` for the check, placed `absolute end-2 flex size-4 items-center justify-center`.
**Group label:** `px-2 py-1 text-xs text-muted-foreground`
**Separator in a popup:** `-mx-1 my-1 h-px bg-border/50`
**Shortcut:** `ms-auto text-xs tracking-widest text-muted-foreground`

**Dialog backdrop:** `fixed inset-0 bg-black/30 transition-opacity duration-100 supports-backdrop-filter:backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0`
**Dialog:** `fixed top-1/2 left-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-6 rounded-[min(var(--radius-4xl),24px)] bg-popover p-6 text-sm text-popover-foreground shadow-xl ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 sm:max-w-md dark:ring-foreground/10`
Alert dialogs use `max-w-xs sm:max-w-md`. **Title:** `text-base leading-none font-medium`. **Description:** `text-sm text-muted-foreground`.

**Card:** `flex flex-col gap-5 overflow-hidden rounded-[min(var(--radius-4xl),24px)] bg-card py-5 text-sm text-card-foreground shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10`, sections `px-5`, title `text-base font-medium`, description `text-sm text-muted-foreground`.

**Checkbox:** `flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-transparent bg-input/90 outline-none transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-disabled:opacity-50`, check icon `size-3.5`.
**Radio:** the checkbox recipe with `rounded-full`, and a `size-2 rounded-full bg-primary-foreground` dot.
**Switch:** `inline-flex h-5 w-8 shrink-0 items-center rounded-full border-2 border-transparent bg-input/90 outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:border-primary data-checked:bg-primary data-disabled:opacity-50`, thumb `block size-4 rounded-full bg-background shadow-sm transition-transform data-checked:translate-x-[calc(100%-4px)] rtl:data-checked:-translate-x-[calc(100%-4px)] dark:bg-foreground dark:data-checked:bg-primary-foreground`. Small: `h-4 w-6`, thumb `size-3`.
**Slider:** track `h-1 rounded-full bg-input/90`, range `bg-primary`, thumb `size-4 rounded-full bg-white shadow-md ring-1 ring-black/10 transition-[color,box-shadow] duration-200 hover:ring-4 hover:ring-ring/30 focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:outline-hidden`.
**Progress:** track `h-2 overflow-hidden rounded-full bg-muted`, indicator `bg-primary`.

**Tabs list:** `inline-flex h-8 w-fit items-center justify-center rounded-2xl bg-muted p-[3px] text-muted-foreground`
**Tab:** `inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-2xl border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 outline-none transition-[color,box-shadow] hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-selected:bg-background data-selected:text-foreground data-selected:shadow-sm dark:text-muted-foreground dark:data-selected:border-input dark:data-selected:bg-input/30 dark:data-selected:text-foreground`
**Toggle:** `inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-2xl px-2 text-sm font-medium outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-pressed:bg-muted`. Outline adds `border border-input bg-transparent`.
**Accordion item:** `border-border not-last:border-b data-open:bg-muted/50`, trigger `flex w-full items-start justify-between gap-6 p-4 text-start text-sm font-medium outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/30` (add `focus-visible:ring-inset` inside a rounded `overflow-hidden` frame, or the ring is clipped). The same goes for any focusable control inside an `overflow-hidden` panel: use an inset ring or give the panel room, chevron `ms-auto size-4 text-muted-foreground`, panel `px-4 pb-4 text-sm`.
**Avatar:** `size-8 rounded-full` (`size-6`, `size-10`), fallback `rounded-full bg-muted text-muted-foreground`.
**Badge:** `inline-flex h-5 items-center gap-1 rounded-2xl border border-transparent px-2 py-0.5 text-xs font-medium`, default `bg-primary text-primary-foreground`, secondary `bg-secondary text-secondary-foreground`.
**Kbd:** `inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-lg bg-muted px-1 font-sans text-xs font-medium text-muted-foreground`
**OTP slot:** `size-8 border-y border-e border-input bg-input/50 text-sm transition-[color,box-shadow] duration-200 first:rounded-s-2xl first:border-s last:rounded-e-2xl data-active:border-ring data-active:ring-3 data-active:ring-ring/30`
**Field:** label `text-sm leading-none font-medium`, description `text-sm text-muted-foreground`, error `text-sm text-destructive`.
**Separator:** `shrink-0 bg-border`.
