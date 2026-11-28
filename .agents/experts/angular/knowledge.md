# Angular expert: knowledge

What the Angular expert knows. Part 1 is Angular itself, part 2 is how `@ui-sdk/angular` is built, part 3 is the checklist a review walks. Pinned to what the repo installs: Angular 21.2.26 (`packages/angular` peer range `@angular/core ^21.0.0 || ^22.0.0`). Anything the adapter uses must exist in 21.0.

Last checked: 2026-11-24, against `node_modules/@angular/core` 21.2.26 (exports checked: `input`, `output`, `model`, `linkedSignal`, `afterNextRender`, `afterEveryRender`, `afterRenderEffect`, `HostAttributeToken`, `booleanAttribute`, `numberAttribute`, `provideZonelessChangeDetection`, `provideZoneChangeDetection`).

## 1. Angular, as its docs write it

### Directives and components

- Everything is standalone. A component lists what its template uses in `imports`. No NgModules.
- An attribute directive (`@Directive({ selector: "[uiTabs]" })`) adds behavior to the author's own element and has no template. A component can have an attribute selector too (`selector: "[uiSliderThumb]"`): its template renders inside the author's element, with `<ng-content />` for what they wrote, and `<ng-content>fallback</ng-content>` when they wrote nothing.
- `exportAs` names a directive for a template reference: `#tabs="uiTabs"`.
- `host: {}` in the decorator binds attributes, classes, styles and listeners on the host element. `hostDirectives` composes directives.
- An attribute that names an input sets it, as a string (`value="a"`, a bare `disabled` gives `""`), so boolean and number inputs need `booleanAttribute` or `numberAttribute`. An attribute that names no input stays a plain attribute, with no error.

### Signals

- `input()` and `input.required()`, with `transform` and `alias`. Inputs are set after the constructor and the field initializers run. Reading a required input before then throws NG0950.
- `output()` returns an `OutputEmitterRef`. `emit(value)` takes one value. No RxJS.
- `[(value)]` works on any `value` input with a `valueChange` output. `model()` makes both, as a signal the directive writes itself.
- `computed` is lazy and memoized, and takes `equal`. `linkedSignal` is writable state that follows other state. `untracked` reads without depending.
- A directive's `effect()` runs while the view whose template holds it is checked: after that template's bindings are set, before its `@if` and `@for` blocks and its child components (`refreshView`: `executeTemplate`, then `runEffectsInView`). On the server too. Effects sync with what isn't Angular. State derived from state is a `computed` or a `linkedSignal`.
- `afterNextRender`, `afterEveryRender` and `afterRenderEffect` run once Angular wrote the DOM, in the browser only. Measuring and other DOM reads go there.
- Queries are signals: `viewChild`, `contentChild`, `contentChildren`.

### Templates

- Control flow is `@if`, `@for (item of items; track item.id)`, `@switch` and `@let`. `*ngIf` and `*ngFor` are deprecated.
- `*uiX="expr; let x"` is sugar for an `<ng-template [uiX]="expr" let-x>` around the element. The directive sits on the template: it injects `TemplateRef` and `ViewContainerRef` and creates the view when it wants one. Everything else written on the element, attributes, bindings and listeners, stays on the element inside the template and never reaches the directive.
- Bindings: `[prop]`, `[attr.name]`, `[class.name]`, `[style.name]`, `(event)`.
- `(name)` on an element listens to every directive output called `name` and to the DOM event of that name: `(select)` on an element with a `select` output also gets a textarea's native `select` event bubbling through it. What a listener returns is discarded, so a callback that wants a promise takes it through the value it emits.
- Angular creates a view's static nodes and their directives first, in document order, and the embedded views of `@if` and `@for` during the first update pass. A directive inside a `@for` is constructed after every static sibling, wherever it sits in the page.

### Dependency injection

- `inject()` works in an injection context: a field initializer, a constructor, a provider factory. It takes `optional`, `self`, `skipSelf` and `host`.
- A directive injects the directives on the elements around it by class. An embedded view resolves injection where its template is written, not where it renders: projected content and a template rendered through `NgTemplateOutlet` both see the injectors of the place they were declared.
- `DestroyRef.onDestroy` cleans up. A `providedIn: "root"` service is one per application, so one per request on the server.

### Change detection

- Angular 21 runs without Zone.js unless the app adds `provideZoneChangeDetection()`. It renders after a signal a template read changes, a template listener runs or `markForCheck()` is called, a frame later. A native listener added outside a template renders nothing unless it writes a signal.
- `ApplicationRef.tick()` renders now.
- A component without `changeDetection: ChangeDetectionStrategy.OnPush` is checked on every pass in an app with Zone.js. With it, a signal its template reads still renders it.

### Server rendering and hydration

- The server renders with `provideServerRendering()`, and the browser hydrates with `provideClientHydration()`, reusing the server's DOM. `withEventReplay()` replays events from before hydration, and `@defer (hydrate on …)` hydrates a block later.
- Constructors, field initializers, `computed` and `effect` run on the server. The after-render functions don't. There's no `window` or `document` global: inject `DOCUMENT`, or wait for `afterNextRender`.
- Hydration matches the page node by node against what the templates create. A node added, removed or moved outside Angular before hydration breaks it (NG0500 to NG0507). Attributes written on an element don't. `ngSkipHydration` on a component's host opts it out.
- Angular has no id hook. `APP_ID` tells apart the apps that share a page.
- `animate.enter` and `animate.leave` take a class or a function, and `animate.leave` keeps the element until its animation ends. `@angular/animations` is deprecated.

### Common mistakes to flag

- An `effect` writing a signal that a `computed` or `linkedSignal` should derive.
- Reading the DOM or `window` in a constructor or an `effect`.
- A required input read in a field initializer or a constructor.
- `@Input()`, `@Output()`, `@HostBinding`, `@HostListener`, `EventEmitter`, constructor injection, `NgModule`, `*ngIf`, `*ngFor`, `ngClass`: older idioms in signal code.
- `@for` tracking `$index` over a list that reorders.
- A method call in a template doing work on every check, where a `computed` reads once.
- App state in a module-level `signal`. The server shares a module across requests, so every visitor reads and writes the same value. Keep it in a `providedIn: "root"` service.

## 2. How `@ui-sdk/angular` is built

Core holds every behavior; the adapter puts it on the author's elements. Read `packages/angular/src/use-primitive.ts`, `inputs.ts`, `outputs.ts`, `popup.ts`, and one entry like `src/tabs.ts`.

- **Directives on your own elements.** Each entry is one file of `@Directive` classes named like the parts in every framework (`TabsTab`), with selector `ui` plus the name (`[uiTabsTab]`) and the same `exportAs`. Props are signal inputs with JSDoc. Boolean and number inputs go through `optionalBoolean` and `optionalNumber` (`inputs.ts`), which keep a left-out input `undefined` so core's default applies. No `render`, no `createParts`.
- **`usePrimitive(primitive, () => options)`** in a root's field initializer returns a handle. The core instance is made the first time something reads `handle.instance`, since inputs arrive after the constructor, and an `effect` hands the options over after that. Its id is `ui-sdk-<APP_ID>-<n>`, counted by the root service `Ids`, so the server and the browser agree. `on*` callbacks stop once the root is destroyed, when its outputs are too (NG0953).
- **`usePart(handle, slot, () => props, options)`** in a part's field initializer. Core writes the attributes (`applyAttrs`) and binds the element (`bind`) itself, as it does for web components, so a state change reaches the page without change detection. Attributes are written in an `effect`, which puts them in server HTML. Binding waits for `afterRenderEffect`.
- **State** is a signal on each directive: `#tab="uiTabsTab"`, then `tab.state()`. It's equal while the slot's state is, so a template reading it renders only on a change. Angular evaluates a class binding on the part's own element before it sets the inputs, and `state()` is `{}` until then.
- **Presence.** On an element, a part that isn't present stays in the page with `hidden`. As `*uiDialogContent`, the directive sits on an `<ng-template>` and creates its view only while the part is present, and `let dialog` reads its state. Core changes presence outside change detection, so `Renders.soon()` calls `ApplicationRef.tick()` in a microtask: a key pressed right after the press that opened a popup reaches the popup.
- **Star inputs.** A star part takes its props as one object through an input named like the directive, `*uiPopoverContent="{ side: 'bottom' }"` (`StarInput`, `starInputs`, `withStar` in `inputs.ts`). Its own inputs win over the object. An output can't be written on a star part: use `<ng-template uiComboboxCreate (create)="…">`.
- **Controlled values** are a `value` input and a `valueChange` output, which `[(value)]` binds, plus `beforeValueChange` with the reason and `cancel()` (`emitChange` in `outputs.ts`). Bound means controlled. No `model()`: core decides the value, and a model writes itself first.
- **Actions.** `ActionEmitter` and its siblings are outputs that know whether anything listens, since a callback's presence changes what core does with a press. What they emit carries `waitUntil()`.
- **Keys.** The first part of a slot keeps core's own key, so an id another part points at before anything binds, like a field label's, is the one in server HTML. A second part of the same slot, like a dialog's second Close, takes its own (`claim` in `use-primitive.ts`).
- **Popups** (`popup.ts`). Each popup has its own `PopupRoot` class, so a tooltip's trigger inside a popover finds the tooltip. A trigger outside its popup connects through `controller` (`controller-target.ts`). The popup registers in an `effect`, so the trigger has its ARIA in server HTML, and it's a plain button until the popup exists. Content moves into its `container` after render, leaving a comment where Angular rendered it, and moves back before it leaves. Popups inside inherit the container (`PopupScope`).
- **Fields.** A control joins the field's `control` part on the same element (`useFieldControl`, `usePart`'s `joined`): the two parts' attributes merge and both bind.
- **Inner elements.** A part that renders elements of its own is a component with an attribute selector, still on the author's element: `[uiSliderThumb]`, `[uiRatingItem]`, `[uiOTPInput]`, the calendar's rows. A part left empty shows its text through `useText`, marked `data-text`, which tells the hydrated page the text is the part's to update.
- **Data lists.** The author places `<div uiSelectItems></div>` (also Listbox, Combobox, Autocomplete, Command, Menu and Tree) where the items go. It's a `display: contents` component that renders the items from `useStore`.
- **Hidden form inputs** (`native-input.ts`) are a component with selector `input` created through `ViewContainerRef` right after the directive's element, so they're in server HTML. With the root on an `<ng-container>` they follow the trigger or the input instead, since hydration can't find a view added to a container that has content (NG0500).
- **Authored attributes** are read with `HostAttributeToken`, never `getAttribute`: when the page hydrates, the element already holds what the server merged in.
- **The package** is compiled by `ngc` in partial mode (`scripts/build/build-angular-package.mjs`). Sources import `./x.ts`, which `rewriteRelativeImportExtensions` turns into `./x.js`.

Tests that show where the project stands: `packages/angular/test/*.test.ts` (jsdom, mounted without Zone.js by `test/mount.ts`), the `*-ssr.test.ts` files (`test/render.ts`), `custom-primitive.test.ts`, `dialog-outside.test.ts`. Browser specs: `--project angular`, `angular-data`, `angular-sheet` and `angular-ssr`, on the fixtures in `apps/playground/src/fixtures/<name>/angular.ts`. The playground compiles them with `ngc` first; restart its dev server after a change.

## 3. Review checklist

1. Inputs: a bare boolean attribute, a number written as an attribute, an input left out, a required input read before it's set.
2. `[(value)]`: bound to an empty signal, a parent that cancels in `(beforeValueChange)`, a value that changes type with a mode.
3. Star parts: props through the star object, `let` state, an output on the long form, nothing on the page while closed.
4. Effects: no `effect` that should be a `computed`, no DOM read before render, nothing browser-only outside the after-render functions.
5. Injection: a part outside its root gets a clear error; a part in a `@for`, behind `NgTemplateOutlet` or projected into another component still finds its root.
6. Order: parts made in `@for` and `@if` after their static siblings, in lists, tab stops and ids.
7. Server rendering and hydration: same HTML, no NG05xx, ids match, a trigger outside its popup named on the server.
8. Portaled popups: content moved to a container and back, a popup inside a portaled popup, a sheet's viewport.
9. With Zone.js: the same component in an app that adds `provideZoneChangeDetection()`.
10. Docs and examples teach signal idioms: `input()`, `output()`, `@if` and `@for`, `inject()`, state read from a template reference.
