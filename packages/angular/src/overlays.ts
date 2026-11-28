import {
  ChangeDetectionStrategy,
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from "@angular/core"
import type { ConfirmEntry } from "@ui-sdk/core/dialog"
import {
  overlays as sharedOverlays,
  type OverlayEntry,
  type Overlays,
} from "@ui-sdk/core/overlays"
import type { Toaster } from "@ui-sdk/core/renderer"
import {
  HostedConfirm,
  HostedToaster,
  type OverlayHostToastProps,
} from "./overlay-parts.ts"

/**
 * Renders what `toast()` and `confirm()` open, from anywhere in the app. Put
 * it once near the root, like `<div uiOverlayHost></div>`; its element takes
 * no space. A `uiToastRegion` you place yourself takes over its toaster.
 * @stable
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "[uiOverlayHost]",
  exportAs: "uiOverlayHost",
  host: { style: "display: contents" },
  imports: [HostedConfirm, HostedToaster],
  template: `
    @for (entry of entries(); track entry.id) {
      @if (entry.type === "toaster") {
        <ui-hosted-toaster [toaster]="toasterOf(entry)" [props]="toast()" />
      } @else if (entry.type === "confirm") {
        <ui-hosted-confirm [entry]="confirmOf(entry)" />
      }
    }
  `,
})
class OverlayHost {
  /** The registry it renders. Defaults to the shared `overlays`, which `toast()` and `confirm()` open into. */
  readonly overlays = input<Overlays>()
  /** What the toast regions it renders take, like `{ side: "top" }`. */
  readonly toast = input<OverlayHostToastProps>()

  // Read once it renders: the server renders no overlays, so hydration
  // matches, and the host counts only while it's on the page.
  protected readonly entries = signal<readonly OverlayEntry[]>([])

  constructor() {
    let stop = () => {}
    afterNextRender(() => {
      const registry = this.overlays() ?? sharedOverlays
      this.entries.set(registry.entries())
      const unsubscribe = registry.subscribe(() =>
        this.entries.set(registry.entries())
      )
      const release = registry.attachHost()
      stop = () => {
        unsubscribe()
        release()
      }
    })
    inject(DestroyRef).onDestroy(() => stop())
  }

  protected toasterOf(entry: OverlayEntry) {
    return (entry.data as { toaster: Toaster }).toaster
  }

  protected confirmOf(entry: OverlayEntry) {
    return entry.data as ConfirmEntry
  }
}

export { createOverlays, overlays } from "@ui-sdk/core/overlays"
export type { OverlayEntry, Overlays } from "@ui-sdk/core/overlays"

export { OverlayHost, type OverlayHostToastProps }
