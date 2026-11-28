import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  Injector,
  untracked,
  ViewContainerRef,
  type ComponentRef,
  type Signal,
} from "@angular/core"
import type { Attrs, Primitive, PropsOf, SlotName } from "@ui-sdk/core"
import {
  useOutsidePart,
  usePart,
  type Joined,
  type PrimitiveHandle,
} from "./use-primitive.ts"

const NativeInputPart = new InjectionToken<() => void>("ui-sdk native input")

@Component({
  selector: "input",
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class NativeInput {
  constructor() {
    inject(NativeInputPart)()
  }
}

// Adds the hidden native <input> a control submits through, right after the
// directive's element, so it's in the server's HTML and takes part in a form
// before hydration. Call it in a field initializer. `when` renders it only then.
function useNativeInput<P extends Primitive, S extends SlotName<P>>(
  owner: PrimitiveHandle<P>,
  slot: S,
  props?: () => PropsOf<P, S>,
  joined?: Joined,
  when?: () => unknown
) {
  const injector = Injector.create({
    providers: [
      {
        provide: NativeInputPart,
        useValue: () => usePart(owner, slot, props, { joined }),
      },
    ],
    parent: inject(Injector),
  })
  const container = inject(ViewContainerRef)
  if (!when) {
    container.createComponent(NativeInput, { injector })
    return
  }
  let rendered: ComponentRef<NativeInput> | undefined
  effect(() => {
    if (when()) {
      rendered ??= untracked(() =>
        container.createComponent(NativeInput, { injector })
      )
    } else {
      rendered?.destroy()
      rendered = undefined
    }
  })
}

const FormInputPart = new InjectionToken<() => Signal<Attrs>>(
  "ui-sdk form input"
)

@Component({
  selector: "textarea",
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class FormTextarea {
  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    const attrs = inject(FormInputPart)()
    // A textarea's value is its text, which the server renders too.
    effect(() => {
      const value = attrs()["value"] ?? ""
      el.removeAttribute("value")
      if (el.textContent !== value) {
        el.textContent = value
      }
    })
  }
}

// Adds the hidden textarea a text control submits through, right after the
// directive's element, while `when` holds. Call it in a field initializer.
function useFormTextarea(owner: PrimitiveHandle<any>, when: () => unknown) {
  const container = inject(ViewContainerRef)
  const injector = Injector.create({
    providers: [
      {
        provide: FormInputPart,
        useValue: () => useOutsidePart(() => owner, "form-input").attrs,
      },
    ],
    parent: inject(Injector),
  })
  let rendered: ComponentRef<FormTextarea> | undefined
  effect(() => {
    if (when()) {
      rendered ??= untracked(() =>
        container.createComponent(FormTextarea, { injector })
      )
    } else {
      rendered?.destroy()
      rendered = undefined
    }
  })
}

// The roots whose hidden inputs wait for an element. One on an
// `<ng-container>` has none to put them after, and hydration can't find
// views added to a container that has content.
const owed = new WeakSet<object>()

// Adds the hidden inputs a list submits through, right after the root's
// element: a textarea for the value, and with `multiple` one input per
// selected value, in the value's order. Call it in a field initializer.
function useFormInputs(owner: PrimitiveHandle<any>) {
  if (inject<ElementRef<Node>>(ElementRef).nativeElement.nodeType === 1) {
    renderFormInputs(owner)
  } else {
    owed.add(owner)
  }
}

// Adds them after this directive's element when the root couldn't. Call it
// in the part the form's field is, like a select's trigger.
function useOwedFormInputs(owner: PrimitiveHandle<any> | undefined) {
  if (owner && owed.delete(owner)) {
    renderFormInputs(owner)
  }
}

function renderFormInputs(owner: PrimitiveHandle<any>) {
  const container = inject(ViewContainerRef)
  const parent = inject(Injector)
  const within = (token: InjectionToken<unknown>, useValue: unknown) =>
    Injector.create({ providers: [{ provide: token, useValue }], parent })
  let attrs: Signal<Attrs> | undefined
  container.createComponent(FormTextarea, {
    injector: within(FormInputPart, () => {
      attrs = useOutsidePart(() => owner, "form-input").attrs
      return attrs
    }),
  })
  const inputs = new Map<string, ComponentRef<NativeInput>>()
  effect(() => {
    attrs?.()
    untracked(() => {
      const keys: string[] = owner.instance.get().multiple
        ? owner.api.internal.serialized()
        : []
      for (const [key, input] of inputs) {
        if (!keys.includes(key)) {
          input.destroy()
          inputs.delete(key)
        }
      }
      keys.forEach((key, index) => {
        const input = inputs.get(key)
        if (input) {
          container.move(input.hostView, index + 1)
          return
        }
        inputs.set(
          key,
          container.createComponent(NativeInput, {
            index: index + 1,
            injector: within(NativeInputPart, () =>
              usePart(owner, "value-input", () => ({ id: key, value: key }))
            ),
          })
        )
      })
    })
  })
}

export { useFormInputs, useFormTextarea, useNativeInput, useOwedFormInputs }
