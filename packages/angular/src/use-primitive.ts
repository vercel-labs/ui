import {
  afterRenderEffect,
  APP_ID,
  ApplicationRef,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  ErrorHandler,
  inject,
  Injectable,
  NgZone,
  Sanitizer,
  SecurityContext,
  signal,
  TemplateRef,
  untracked,
  ViewContainerRef,
  type EmbeddedViewRef,
  type Signal,
} from "@angular/core"
import type {
  Attrs,
  OptionsOf,
  Primitive,
  PropsOf,
  SlotName,
  StateOf,
  TypesOf,
} from "@ui-sdk/core"
import {
  applyAttrs,
  attrs as partAttrs,
  bind,
  conditional,
  partState,
  portalTarget,
  present as isPresent,
  releaseAttrs,
  sameSlotState,
  selectedKeys,
  subscribe,
  takeOwnId,
  type Feature,
} from "@ui-sdk/core/renderer"

// One counter per app, so ids match between the server and the browser and a
// server never shares one across requests.
@Injectable({ providedIn: "root" })
class Ids {
  readonly #app = inject(APP_ID)
  #count = 0

  next() {
    return `ui-sdk-${this.#app}-${this.#count++}`
  }
}

// Angular renders a frame after a change. A part that comes or goes renders
// in the task that changed it, so a key pressed right after a press that
// opened a popup reaches the popup.
@Injectable({ providedIn: "root" })
class Renders {
  readonly #app = inject(ApplicationRef)
  readonly #errors = inject(ErrorHandler)
  #queued = false

  soon() {
    if (this.#queued) {
      return
    }
    this.#queued = true
    queueMicrotask(() => {
      this.#queued = false
      if (this.#app.destroyed) {
        return
      }
      // `tick()` throws what a template threw, where Angular's own renders
      // hand it to the app's error handler.
      try {
        this.#app.tick()
      } catch (error) {
        this.#errors.handleError(error)
      }
    })
  }
}

// An id for a part that needs one and wasn't given a value, like an accordion's item.
const useId = () => inject(Ids).next()

/**
 * What `usePrimitive` returns, and what a root directive holds for its parts.
 * @experimental
 */
type PrimitiveHandle<P extends Primitive> = {
  /** The core instance, made the first time something reads it. */
  readonly instance: ReturnType<P>
  /** The methods its definition declares, like Tabs' `setValue`. */
  readonly api: TypesOf<P>["api"]
}

/**
 * Creates the instance for a root directive's life. Call it in a field
 * initializer. `options` is read in an effect, so the inputs it reads stay
 * in sync.
 * @experimental
 */
function usePrimitive<P extends Primitive>(
  primitive: P,
  options: () => OptionsOf<P>
) {
  const id = inject(Ids).next()
  const renders = inject(Renders)
  let instance: ReturnType<P> | undefined
  const features = new Set<Feature>()
  // Inputs arrive after the constructor, so the instance waits for a reader.
  let destroyed = false
  // Tearing down can still report a change, like a highlight that's lost its
  // item, and by then the directive's outputs are destroyed too.
  const whileAlive = (given: OptionsOf<P>) => {
    const next: Record<string, unknown> = { ...given, id }
    for (const [key, value] of Object.entries(next)) {
      if (typeof value === "function" && /^on[A-Z]/.test(key)) {
        // A parent writes a bound value as the change emits, and the input
        // here follows once Angular renders: a frame later without Zone.js.
        // Rendering in the same task hands it to core before the next event.
        const changes = key.endsWith("Change")
        next[key] = (...args: unknown[]) => {
          if (destroyed) {
            return undefined
          }
          const result = value(...args)
          if (changes && !NgZone.isInAngularZone()) {
            renders.soon()
          }
          return result
        }
      }
    }
    return next as OptionsOf<P>
  }
  // Angular evaluates a class binding on the root's own element before it
  // sets the inputs. A state read there makes the instance without a bound
  // default, which only the first options can set, so it's made again.
  let early: Record<string, unknown> | undefined
  let synced = false
  const remade = signal(0)
  const make = () => {
    if (!instance) {
      const first = untracked(options)
      early = synced ? undefined : first
      instance = primitive(whileAlive(first)) as ReturnType<P>
      features.forEach((feature) => instance?.use(feature))
    }
    return instance
  }
  effect(() => {
    const next: Record<string, unknown> = options()
    untracked(() => {
      const before = early
      early = undefined
      synced = true
      if (
        before &&
        Object.keys(next).some(
          (key) =>
            key.startsWith("default") && !Object.is(next[key], before[key])
        )
      ) {
        instance?.destroy()
        instance = undefined
        remade.update((count) => count + 1)
      }
      make().setOptions(whileAlive(next as OptionsOf<P>))
    })
  })
  inject(DestroyRef).onDestroy(() => {
    destroyed = true
    instance?.destroy()
  })
  const handle: PrimitiveHandle<P> = {
    get instance() {
      remade()
      return make()
    },
    get api() {
      remade()
      return make().api as TypesOf<P>["api"]
    },
  }
  adding.set(handle, (feature) => {
    features.add(feature)
    instance?.use(feature)
  })
  return handle
}

// The instance's whole state as a signal, for what no part's state carries,
// like the items a data list renders.
function useStore<P extends Primitive>(owner: PrimitiveHandle<P>) {
  const changes = signal(0)
  effect((onCleanup) =>
    onCleanup(
      owner.instance.subscribe(() => changes.update((count) => count + 1))
    )
  )
  return computed(
    () => {
      changes()
      return owner.instance.get() as TypesOf<P>["state"]
    },
    { equal: () => false }
  )
}

const adding = new WeakMap<object, (feature: Feature) => void>()

// Adds the feature that ships a part's slot, like a menu's checkbox items,
// before the part reads it. The instance may not exist yet.
function useFeature(owner: PrimitiveHandle<any>, feature: Feature) {
  adding.get(owner)?.(feature)
}

const sameState = (a: object, b: object) => {
  const keys = Object.keys(a)
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) =>
      sameSlotState(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    )
  )
}

// The first part of a slot keeps core's own key, so the ids other parts point
// at before anything binds, like a field label's, are the ones it renders.
// Another part of that slot, like a dialog's second Close, takes its own.
const lone = new WeakMap<object, Map<string, string>>()

function claim(instance: object, slot: string, holder: string) {
  const slots = lone.get(instance) ?? new Map<string, string>()
  lone.set(instance, slots)
  if (!slots.has(slot)) {
    slots.set(slot, holder)
  }
  return slots.get(slot) === holder
}

function release(instance: object, slot: string, holder: string) {
  const slots = lone.get(instance)
  if (slots?.get(slot) === holder) {
    slots.delete(slot)
  }
}

const SAFE_URL = /^(?!javascript:)(?:[a-z\d+.-]+:|[^:/?#]*(?:[/?#]|$))/i

// Core writes an `href` itself, so it gets the check Angular gives an `[href]`
// binding: `javascript:` and a malformed scheme get `unsafe:` in front. An
// app's own `Sanitizer` decides instead, when it provides one.
function checked(attrs: Attrs, sanitizer: Sanitizer | null) {
  const href = attrs["href"]
  if (href === undefined) {
    return attrs
  }
  const safe = sanitizer
    ? (sanitizer.sanitize(SecurityContext.URL, href) ?? "")
    : SAFE_URL.test(href)
      ? href
      : `unsafe:${href}`
  return safe === href ? attrs : { ...attrs, href: safe }
}

// A second part on the same element, like a field's control part on a
// switch: its attributes merge into the element's own part and it binds too.
type Joined = {
  part: () => Parameters<typeof partAttrs>[0] | undefined
  merge: (own: Attrs, joined: Attrs) => Attrs
}

/**
 * Where a popup renders: an element to move into, or nothing to stay in place.
 * @experimental
 */
type PopupContainer = Element | DocumentFragment | null | undefined

/**
 * What `usePart` takes after the props.
 * @experimental
 */
type PartOptions = {
  /** A field's control part for the same element, from `useFieldControl`. */
  joined?: Joined
  /** Moves the element into a container while the part is present. `false` keeps it in place. */
  portal?: () => PopupContainer | false
  /** A popup's `viewport` part. While it's present, the element sits in a full-screen element made for it, which is what moves into the container. */
  viewport?: () => Parameters<typeof partAttrs>[0] | undefined
  /** A popup's `header` part. While it's present, an element made for it sits at the element's top, and `record` hears which. */
  header?: {
    part: () => Parameters<typeof partAttrs>[0] | undefined
    record: (el: HTMLElement | null) => void
  }
}

// What an element shows while the component it belongs to isn't on the page yet.
type Plain = () => Attrs

// Binds an element to a part of whichever component `ownerOf` names now. With
// none yet, like a trigger whose dialog hasn't mounted, the element is plain.
function bindPart<P extends Primitive, S extends SlotName<P>>(
  ownerOf: () => PrimitiveHandle<P> | undefined,
  slot: S,
  props: () => PropsOf<P, S>,
  { joined, portal, viewport, header }: PartOptions,
  plain?: Plain,
  unsettled?: StateOf<P, S>
) {
  const host =
    inject<ElementRef<HTMLElement | Comment>>(ElementRef).nativeElement
  const template = inject(TemplateRef, { optional: true })
  if (!template && host.nodeType !== 1) {
    throw new Error(
      `The "${slot}" part needs an element. Put its directive on one, not on an <ng-container>.`
    )
  }
  const container = template ? inject(ViewContainerRef) : undefined
  const own = inject(Ids).next()
  const renders = inject(Renders)
  const sanitizer = inject(Sanitizer, { optional: true })
  const channel = `render:${own}`
  let claimed: { instance: object; lone: boolean } | undefined
  // Angular evaluates a class binding on the part's own element before it sets
  // the inputs, and reading a required one throws until then.
  const settled = signal(!unsettled)
  const ready = () => {
    try {
      untracked(() => (ownerOf()?.instance, props()))
      return true
    } catch {
      return false
    }
  }
  // Core keeps one part per key and gives it the new props, so the same
  // object comes back and only this computed can say that it changed.
  const part = computed(
    () => {
      const instance = ownerOf()?.instance
      if (!instance) {
        return undefined
      }
      const given = props() as PropsOf<P, S> & { id?: string; value?: unknown }
      if (given.value !== undefined || given.id !== undefined) {
        return instance.part(slot, given)
      }
      if (claimed?.instance !== instance) {
        if (claimed?.lone) {
          release(claimed.instance, slot, own)
        }
        claimed = { instance, lone: claim(instance, slot, own) }
      }
      return instance.part(slot, claimed.lone ? given : { ...given, id: own })
    },
    { equal: () => false }
  )
  const keyed = computed(() => part())
  const selection = computed(() => {
    const current = part()
    return current && selectedKeys(current)
  })
  const element = signal(template ? null : (host as HTMLElement))
  const changes = signal(0)
  const stateChanges = signal(0)
  // What `let` reads in the `*` form, like `*uiDialogContent="let dialog"`.
  const context = {
    get $implicit() {
      return state()
    },
  }
  let view: EmbeddedViewRef<unknown> | undefined
  let inPage = false
  // A view created after the first render has no content until Angular
  // renders it, and core measures content when it binds.
  let fresh = false
  let shown = false
  let destroyed = false
  let bound:
    | {
        el: HTMLElement
        part: unknown
        joined: unknown
        framed: boolean
        unbind: () => void
      }
    | undefined
  let moved: { el: HTMLElement; home: Comment } | undefined
  let frame: HTMLElement | undefined
  let top: HTMLElement | undefined

  // A sheet's header, where an input moves while its popup is one.
  const head = (el: HTMLElement | undefined) => {
    const current = el && header?.part()
    if (!el || !current || !isPresent(current)) {
      if (top) {
        header?.record(null)
        top.remove()
        top = undefined
      }
      return
    }
    top ??= el.ownerDocument.createElement("div")
    applyAttrs(top, partAttrs(current), `${channel}:header`)
    if (top.parentNode !== el) {
      el.prepend(top)
      header?.record(top)
    }
  }

  const goHome = () => {
    const current = moved
    moved = undefined
    if (!current) {
      return
    }
    if (current.home.isConnected) {
      current.home.before(current.el)
    } else {
      current.el.remove()
    }
    current.home.remove()
    if (frame && !frame.hasChildNodes()) {
      frame.remove()
    }
  }

  // Presented as a sheet, a popup sits in a full-screen element, which goes
  // where the popup would have: into its container, or in place.
  const isFramed = () => {
    const wrapper = viewport?.()
    return !!wrapper && isPresent(wrapper)
  }

  const frameIn = (
    el: HTMLElement,
    target: Element | DocumentFragment | null
  ) => {
    const wrapper = viewport?.()
    if (!wrapper || !isPresent(wrapper)) {
      return undefined
    }
    frame ??= el.ownerDocument.createElement("div")
    applyAttrs(frame, partAttrs(wrapper), `${channel}:viewport`)
    const anchor = moved?.el === el ? moved.home : el
    if (frame.parentNode !== (target ?? anchor.parentNode)) {
      if (target) {
        target.append(frame)
      } else {
        anchor.before(frame)
      }
    }
    return frame
  }

  const unbind = () => {
    const current = bound
    bound = undefined
    current?.unbind()
  }

  // A popup moves into its container once it's in the page, and goes back
  // before it stops being present, so Angular finds it where it rendered it.
  const move = (el: HTMLElement) => {
    const wanted = portal?.()
    const container = wanted === false ? null : portalTarget(wanted)
    const target = frameIn(el, container) ?? container
    // A part binds again where it lands, as it does when another framework
    // renders it there: an input takes focus back in a sheet's header.
    if (moved && (moved.el !== el || el.parentNode !== target)) {
      unbind()
      goHome()
    }
    if (!target || el.parentNode === target) {
      return
    }
    unbind()
    const home = el.ownerDocument.createComment("")
    el.before(home)
    target.append(el)
    moved = { el, home }
  }

  // Core writes the attributes and binds the element itself, so a state
  // change reaches the page without change detection.
  const sync = (rendering = true) => {
    const el = untracked(element)
    if (!el || destroyed) {
      return
    }
    const current = untracked(part)
    if (!current) {
      unbind()
      goHome()
      if (plain) {
        applyAttrs(el, untracked(plain), channel)
      } else if (shown) {
        releaseAttrs(el, channel)
      }
      shown = false
      return
    }
    const present = isPresent(current)
    const other = joined && untracked(joined.part)
    const attrs = checked(
      other
        ? joined.merge(partAttrs(current), partAttrs(other))
        : partAttrs(current),
      sanitizer
    )
    if (present) {
      if (
        attrs["hidden"] === undefined &&
        (conditional(current) || "hidden" in attrs)
      ) {
        el.removeAttribute("hidden")
      }
      applyAttrs(el, attrs, channel)
      // A bare `disabled` in the template stays on the element, where it
      // would take a part that's disabled but focusable out of the tab order.
      if (
        attrs["aria-disabled"] === "true" &&
        attrs["disabled"] === undefined
      ) {
        el.removeAttribute("disabled")
      }
    } else {
      if (shown) {
        applyAttrs(el, attrs, channel)
      }
      el.setAttribute("hidden", "")
      if (attrs["data-slot"]) {
        el.setAttribute("data-slot", attrs["data-slot"])
      }
    }
    shown = present
    // A part that left stays bound until Angular renders, as it does where a
    // framework unmounts it, so what replaces it mounts in the same pass.
    if (bound && !present && !rendering) {
      renders.soon()
      return
    }
    const framed = untracked(isFramed)
    const reframed = !!bound && bound.framed !== framed
    if (
      bound &&
      (!present ||
        bound.el !== el ||
        bound.part !== current ||
        bound.joined !== other ||
        reframed)
    ) {
      unbind()
    }
    // An element kept in the page binds again inside its viewport, which is
    // the popover now.
    if (reframed) {
      el.removeAttribute("popover")
    }
    if (!present) {
      goHome()
    }
    if (header) {
      untracked(() => head(inPage && present ? el : undefined))
    }
    if (inPage && present && !fresh) {
      if (portal || viewport) {
        untracked(() => move(el))
      }
      if (!bound) {
        const binding = {
          el,
          part: current,
          joined: other,
          framed,
          unbind: () => {},
        }
        bound = binding
        const unbindOwn = bind(current, el)
        const unbindOther = other && bind(other, el)
        binding.unbind = () => {
          unbindOther?.()
          unbindOwn()
        }
      }
    }
  }

  const render = () => {
    if (!template || !container) {
      return
    }
    const current = untracked(part)
    // With no component yet, the element renders plain.
    const present = current ? isPresent(current) : true
    // A popup that turns into a sheet while it's bound, like a select's list
    // on its first touch, renders again, so nothing of the popover stays on it.
    if (present && view && bound && bound.framed !== isFramed()) {
      unbind()
      head(undefined)
      goHome()
      container.clear()
      view = undefined
      shown = false
    }
    if (present && !view) {
      view = container.createEmbeddedView(template, context)
      fresh = true
      const root = view.rootNodes.find(
        (node: Node): node is HTMLElement => node.nodeType === 1
      )
      element.set(root ?? null)
    } else if (!present && view) {
      unbind()
      head(undefined)
      goHome()
      container.clear()
      view = undefined
      shown = false
      element.set(null)
    }
  }

  effect((onCleanup) => {
    untracked(() => settled.set(true))
    const current = keyed()
    selection()
    if (!current) {
      return
    }
    const unsubscribe = untracked(() =>
      subscribe(current, (liveOnly: boolean) => {
        // A template may read state that only live attributes show, like `pending`.
        stateChanges.update((count) => count + 1)
        if (liveOnly && !conditional(current)) {
          return
        }
        if (!template) {
          sync(false)
        } else if (isPresent(current) !== !!view) {
          renders.soon()
        }
        changes.update((count) => count + 1)
      })
    )
    onCleanup(unsubscribe)
  })

  if (joined) {
    effect((onCleanup) => {
      const other = joined.part()
      if (!other) {
        return
      }
      onCleanup(
        untracked(() =>
          subscribe(other, () => {
            sync()
            changes.update((count) => count + 1)
          })
        )
      )
    })
  }

  effect(() => {
    changes()
    const current = part()
    joined?.part()
    portal?.()
    plain?.()
    element()
    untracked(() => {
      render()
      const el = element()
      const id = el?.getAttribute("id")
      if (current && !shown && id) {
        takeOwnId(current, id)
      }
      sync()
    })
  })

  afterRenderEffect(() => {
    element()
    inPage = true
    fresh = false
    untracked(sync)
  })

  inject(DestroyRef).onDestroy(() => {
    // Unbinding can change state, and a part that hears it must not bind again.
    destroyed = true
    unbind()
    head(undefined)
    goHome()
    if (claimed?.lone) {
      release(claimed.instance, slot, own)
    }
    const el = untracked(element)
    if (el) {
      releaseAttrs(el, channel)
    }
  })

  const state = computed(
    () => {
      if (!settled() && !ready()) {
        return unsettled
      }
      stateChanges()
      const current = part()
      return current && (partState(current) as StateOf<P, S>)
    },
    {
      equal: (a, b) =>
        a === b || (!!a && !!b && sameState(a as object, b as object)),
    }
  )
  const present = computed(() => {
    stateChanges()
    const current = part()
    return !!current && isPresent(current)
  })
  const attrs = computed(
    () => {
      changes()
      const current = part()
      return current ? partAttrs(current) : {}
    },
    { equal: () => false }
  )
  return { attrs, element: element.asReadonly(), present, state }
}

/**
 * Binds the directive's element to one part of a component. Call it in a
 * field initializer. On an element, the part stays in the page and is hidden
 * while it isn't present. On an `<ng-template>`, which the `*` form makes,
 * the element exists only while the part is present.
 * @experimental
 */
function usePart<P extends Primitive, S extends SlotName<P>>(
  owner: PrimitiveHandle<P>,
  slot: S,
  props: () => PropsOf<P, S> = () => ({}) as PropsOf<P, S>,
  options: PartOptions = {}
) {
  const { element, present, state } = bindPart(
    () => owner,
    slot,
    props,
    options,
    undefined,
    {} as StateOf<P, S>
  )
  return { element, present, state: state as Signal<StateOf<P, S>> }
}

// `usePart` for a part that may sit outside its component, like a trigger in
// a table row for a dialog elsewhere: `owner` reads the component it belongs
// to now. Until there's one, the element is plain and `state()` is undefined.
function useOutsidePart<P extends Primitive, S extends SlotName<P>>(
  owner: () => PrimitiveHandle<P> | undefined,
  slot: S,
  props: () => PropsOf<P, S> = () => ({}) as PropsOf<P, S>,
  options: PartOptions = {},
  plain?: Plain
) {
  return bindPart(owner, slot, props, options, plain)
}

export {
  type Joined,
  type PartOptions,
  type PopupContainer,
  type PrimitiveHandle,
  Renders,
  useFeature,
  useId,
  useOutsidePart,
  usePart,
  usePrimitive,
  useStore,
}
