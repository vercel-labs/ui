import {
  ApplicationRef,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  TemplateRef,
  untracked,
  type EmbeddedViewRef,
} from "@angular/core"
import type { toastRegion } from "@ui-sdk/core/toast"
import { usePart, type PrimitiveHandle } from "./use-primitive.ts"

/**
 * What toasts can say in Angular: text, or a template.
 * @experimental
 */
type ToastContent = string | TemplateRef<unknown>

// The region a toast and its parts belong to.
const ToastRegionContext = new InjectionToken<
  PrimitiveHandle<typeof toastRegion>
>("uiToastRegion")

// Set by the overlay host on the region it renders, which takes a toaster
// only while no region the app placed shows it.
const HostedRegion = new InjectionToken<boolean>("ui-sdk hosted region")

// The list a region renders around its toasts.
@Directive({ selector: "[uiToastList]" })
class ToastList {
  constructor() {
    usePart(inject(ToastRegionContext), "list")
  }
}

// Fills an element the author left empty with a toast's content, and hides
// the element while `shown` says there's nothing for it. `shown` hears
// whether the content is the author's own.
function useContent(
  content: () => ToastContent | null | undefined,
  shown: (own: boolean) => boolean = () => true
) {
  const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  const app = inject(ApplicationRef)
  let filled = false
  let view: EmbeddedViewRef<unknown> | undefined
  const clear = () => {
    if (view) {
      app.detachView(view)
      view.destroy()
      view = undefined
    }
  }
  effect(() => {
    const next = content()
    const own = !filled && el.childNodes.length > 0
    el.toggleAttribute("hidden", !shown(own))
    if (own) {
      return
    }
    filled = true
    untracked(() => {
      clear()
      if (next instanceof TemplateRef) {
        view = next.createEmbeddedView({})
        app.attachView(view)
        el.replaceChildren(...view.rootNodes)
      } else {
        el.textContent = next ?? ""
      }
    })
  })
  inject(DestroyRef).onDestroy(clear)
}

export {
  HostedRegion,
  type ToastContent,
  ToastList,
  ToastRegionContext,
  useContent,
}
