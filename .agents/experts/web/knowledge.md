# Web components expert: knowledge

What the custom elements expert knows. Part 1 is the platform, part 2 is how `@ui-sdk/web` is built, part 3 is the checklist a review walks. No framework version to pin: the bar is the HTML and DOM standards as Chromium, WebKit and Firefox ship them. Browser specs run on Chromium in the cloud; WebKit and Firefox are skipped for now (shadcn, 2026-10-25), so say when a claim was only checked on Chromium.

Last checked: 2026-11-04, against `packages/web/src/define-element.ts` and `packages/web/src/autoload.ts`.

## 1. The platform, as the standards write it

### Lifecycle

- `customElements.define(name, Class)`. An element in the page before its definition is "undefined" (`:not(:defined)`) and upgrades when the definition arrives; `customElements.whenDefined(name)` resolves then.
- `constructor` runs on creation or upgrade. It must not read attributes or children, or add any (the parser hasn't added them yet, and `createElement` throws if the constructor adds attributes).
- `connectedCallback` runs every time the element enters a document, `disconnectedCallback` every time it leaves. A move (`append` elsewhere) is a disconnect then a connect in the same task. Code that tears down on disconnect must survive a move.
- `Element.moveBefore(node, child)` (Chromium 133+) moves without disconnecting, keeping state like focus and animations; an element that defines `connectedMoveCallback` gets that instead of disconnect and connect, otherwise it gets both.
- Children may not be upgraded or even parsed yet at `connectedCallback` (the parser connects the parent first). Reading children needs a `MutationObserver`, `slotchange`, or waiting for their definitions.
- **Properties set before upgrade** become own properties on the instance and shadow the class's accessors. The fix: in `connectedCallback` or the constructor, delete the own property and set it again through the accessor, the "lazy properties" pattern from web.dev's custom element best practices.

### Attributes and properties

- `static observedAttributes` lists the attributes `attributeChangedCallback(name, old, value)` hears.
- Built-ins reflect: `input.disabled` ↔ `disabled` by presence; enumerated attributes like `spellcheck="false"` and `contenteditable` by value; `hidden="until-found"`. Unknown enumerated values fall back to a default. Rich data (objects, functions) is property-only.
- Attribute names are lowercase; a property for each option is how frameworks and scripts set them.

### Form-associated custom elements

- `static formAssociated = true` plus `this.attachInternals()`. `internals.setFormValue(value, state)`, `setValidity(flags, message, anchor)`, `form`, `labels`, `validity`, `willValidate`, `checkValidity()`, `reportValidity()`.
- Callbacks: `formResetCallback` (form reset), `formDisabledCallback(disabled)` (own `disabled` or a disabled `<fieldset>`), `formStateRestoreCallback(state, mode)` (`"restore"` on back/forward or autofill, `"autocomplete"`), `formAssociatedCallback(form)`.
- Native controls expose `name`, `form`, `validity`, `labels` and friends; form code expects them.
- `:invalid`, `:disabled` and `<label for>` work on form-associated elements.

### Shadow DOM versus light DOM

- Shadow DOM scopes styles and ids, and slots light children. IDREFs (`aria-labelledby`, `for`) don't cross shadow boundaries; element reflection (`ariaLabelledByElements`) can point at elements in the same tree or an enclosing one, never into a nested shadow root.
- Light DOM keeps the user's markup and styles in charge and ids in one tree, but inside a user's shadow root, document styles don't reach and `document.getElementById` misses; use `getRootNode()`.
- `document.activeElement` is the shadow host when focus is inside a shadow root; the focused element is `root.activeElement`, recursively.
- `delegatesFocus: true` on a shadow root forwards focus to the first focusable element inside.

### Events

- `new CustomEvent(name, { bubbles, cancelable, composed, detail })`. `composed: true` crosses shadow boundaries (retargeted to the host). Native `change`, `input`, `toggle` set the convention: `toggle` on `<details>` doesn't bubble.
- A listener added in plain HTML (`onopenchange=` attributes only exist for known event names), `addEventListener`, React 19 (`onopenchange` prop on a custom element adds a listener for `openchange`, since React 19 supports custom element events and properties), Vue (`@openchange`), Svelte (`onopenchange`).
- Native controls don't fire `change` when script sets `value`. Firing events for script writes surprises framework code that writes properties back.

### ARIA through ElementInternals

- `internals.role`, `internals.ariaChecked`, ... set default semantics without sprinkling attributes the user can see and override. User-set attributes win. Supported in all three engines; reflection of element references varies.

### Server rendering

- Declarative shadow DOM (`<template shadowrootmode="open">`) renders a shadow root from HTML. Light DOM elements need nothing: the server renders the markup the user writes.
- Before upgrade, the element is an unknown inline element. Content shows with no behavior; `:not(:defined)` styles can hide or reserve space.

### Interop

- React 19 sets properties on custom elements when the property exists on the element, otherwise attributes, and adds listeners for `on<event>` props. Earlier React only set attributes.
- TypeScript: `HTMLElementTagNameMap` for `document.querySelector` and `createElement`; React's `JSX.IntrinsicElements` (through `declare module "react"`), Vue's `GlobalComponents`, Svelte's `svelteHTML` need their own declarations.
- A custom elements manifest (`custom-elements.json`) lets editors and tools list elements, attributes, properties and events.

### Common mistakes to flag

- Work in the constructor that reads attributes or children.
- Teardown on disconnect that breaks a move.
- Properties set before upgrade lost.
- Events that bubble when the native analog doesn't, or don't cross a shadow root the user rendered into.
- `document.activeElement` or `document.getElementById` where `getRootNode()` is needed.
- An attribute with no property, or a property that doesn't reflect like a built-in.

## 2. How `@ui-sdk/web` is built

Core holds every behavior; the adapter defines elements. Read `packages/web/src/define-element.ts`.

- **Owners and parts.** `defineRootElement` defines an owner element (like `<ui-tabs>`) that creates the core instance; part elements (`<ui-tabs-tab>`) register with the owner their `for` names, else the nearest one (`findOwner`), as they upgrade, in any order, and sync a microtask later in DOM order, so a trigger binds before an open popup. A `for` part also binds to an owner that connects after it, like a native label's control, and doesn't warn while it waits. An element its part lets go of (a `for` naming no owner, a wrapped child removed or moved) loses every attribute the owner wrote on it, render and live. A part with no owner looks again a microtask later before it warns. A part with an `alone` hook (field label, description, error) runs it instead of the 'must be inside' warning, a microtask after connect and on every attribute change, and writes the same `data-slot` as the other adapters. `container="#id"` is looked up in the element's own tree, then each enclosing tree up to the document, and warns once when nothing matches.
- **Light DOM.** Elements render into the user's light DOM. A part binds itself, a wrapped button, or with `as-child` its first child (`:where([as-child]) { display: contents }`). A child observer rebinds when the bound child comes later or is replaced. Positioning listens for scrolls, loads, animations and changes in every shadow root on the anchor's flat tree path, slots included, one set of listeners per root.
- **Shared elements and surroundings.** On an element two parts share, like a number input's control inside a toolbar input, the inner part's `data-slot` wins (`innerPart`), as the element passed to `render` does in the other frameworks. An owner with an `options` hook, which reads its surroundings like a toggle reads its toolbar group, reads them again when an owner around it, like its field, changes an attribute (`reconfigureInside`).
- **Default styles** go in the lowest cascade layer with zero specificity, so any class wins; inside a shadow root, the same rules are adopted into that root (`adoptStyles`), from one constructed sheet per document, since a sheet only adopts into its own document; each part sync checks the rules are still there and adds them back first, so a page that replaces or changes a root's sheets gets them back at the next state change, and a closed part can show until then. An element moved into another document, like an iframe's, gets a copy of the rules in that document's head. Shadow roots are found by node type, not `instanceof ShadowRoot`, which fails across windows. Core layers (Escape, outside presses) listen in each document that has an open layer, and Escape closes the topmost layer of the document it was pressed in.
- **Attributes and properties.** Options read from kebab-case attributes by schema. Every attribute option also gets a reflecting property (`reflectAttributes`): default-off booleans by presence, default-on ones (`defaults: { loop: true }`) write `"false"`, text and numbers as written, lists comma-joined. Properties set before upgrade are set again through the accessor (`upgradeProperties`). Live state properties set before connect are where it starts.
- **Events.** Callbacks become DOM events: `onOpenChange` fires `openchange`, `onCheckedChange` fires `checkedchange`. A root whose field fires a native event of the same name renames its event in the define call's `events`: Trigger Menu's `onSelect` fires `itemselect`, since a text field's `select` bubbles into it. They don't bubble and are `composed`. One whose callback gets details or an event is cancelable, and canceling it calls the change's `details.cancel()`. Listen on an ancestor with `{ capture: true }`. `actions` events hand listeners `waitUntil()`, like `ExtendableEvent`.
- **Public api** on the element is only the controller's methods (`controllerView`), never internals. The instance stays off the element: `define-element.ts` keeps it in a module-private `WeakMap`, the package's modules read it with `instanceOf(el)`, and a root's `render(el, instance)` hook receives it. Tests and fixtures drive an element through `api`, its properties or a `controller` property, never the instance.
- **Moves.** `disconnectedCallback` waits until the task's moves settle (`whenGone`), so a popup moving to a portal stays bound. Gone, it saves its form state, destroys the instance, and put back later, starts again from its defaults and restores state quietly. No `connectedMoveCallback` yet.
- **Forms.** `formAssociated(Base)` adds `static formAssociated`, `attachInternals()`, the native members (`form`, `labels`, `name`, `validity`, `validationMessage`, `willValidate`, `checkValidity`, `reportValidity`, `setCustomValidity`) and the form callbacks, all handed to core. `disabled` and `required` count whenever present, like native controls.
- **Types.** Element interfaces with `AttributeProperties<typeof primitive, Own>` for root tags, and every part tag in `HTMLElementTagNameMap` as `UiPartElement<typeof primitive, slot, attributes, properties, events>` (its slot props as properties, like `ui-tabs-tab`'s `disabled` or a trigger's `payload`, and its events from the slot's callbacks, `PartEvents`, unless the element fires others, like a close's `action`, or its owner fires them, like a trigger menu item's `itemselect`). `custom-elements.json` lists elements, attributes with defaults (from core's `@defaultValue`) and events, reading parts from their define calls and part events from their types. A test checks each part's property list against its define call, and `part-events.test.ts` presses every part with typed events and checks it fires exactly those.

- **Without a bundler.** `scripts/build/browser.mjs` builds `packages/web/browser/` with Rolldown: `web/<entry>.js` per side-effect entry, shared code in `web/chunks/`, and `web.js`, the loader (`src/autoload.ts`). The loader finds the folder beside its own URL (`componentsBase`), maps a tag to the longest entry named like it (`entryOf`: `ui-tabs-panel` to `tabs`, `ui-overlay-host` to `overlays`), and imports each entry once, for tags in the document and in open shadow roots it sees, then for ones added later. The files export nothing. The docs site serves them at `/web@<version>.js` and `/web@<version>/`, and `apps/docs/proxy.ts` redirects `/web@<major>` to the newest. Specs: `pnpm test:browser-build` (`tests/browser-build/`, pages on one origin, files on another).

Tests that show where the project stands: `packages/web/test/reconnect.test.ts`, `tests/specs/web-lifecycle.spec.ts`, the manifest test. Browser specs: `--project web` (plus `web-webkit` and `web-firefox` when engines run).

## 3. Review checklist

1. Lifecycle: removed and put back, moved, moved with `moveBefore`, connected before its children upgrade, upgraded after properties were set, defined late.
2. Attributes and properties: reflection both ways, booleans and enumerated values like built-ins, properties before upgrade, attribute-only state.
3. Forms: `ElementInternals`, reset, restore, validity, labels, `:invalid`, fieldsets.
4. Light DOM inside a user's shadow root: ids, `aria-labelledby`, `getRootNode`, focus, adopted styles, a popup whose trigger is slotted into a scrolling shadow root.
5. Events: names, `bubbles`, `composed`, cancel; a listener in plain HTML, React 19, Vue and Svelte hears them.
6. SSR and the flash before upgrade: what HTML the element needs before it upgrades.
7. ARIA through `ElementInternals` versus attributes; focus delegation.
8. Interop: property versus attribute, event names, TypeScript JSX types, the manifest.
