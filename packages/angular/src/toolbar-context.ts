import { inject, InjectionToken } from "@angular/core"
import type { toolbar } from "@ui-sdk/core/toolbar"
import type { PrimitiveHandle } from "./use-primitive.ts"

// The toolbar's tokens, apart from the toolbar, so a toggle or a toggle group
// can join one without bundling it.
const ToolbarHandle = new InjectionToken<PrimitiveHandle<typeof toolbar>>(
  "ui-sdk toolbar"
)

// Whether the toolbar group an item, toggle or toggle group sits in is disabled.
const ToolbarGroupDisabled = new InjectionToken<() => boolean>(
  "ui-sdk toolbar group"
)

// The arrow keys and tab stop of the toolbar a toggle or a toggle group sits
// in, if any. A getter, so options that read it follow the group's disabled.
function useToolbarScope() {
  const owner = inject(ToolbarHandle, { optional: true })
  const groupDisabled =
    inject(ToolbarGroupDisabled, { optional: true }) ?? (() => false)
  return () => {
    if (!owner) {
      return undefined
    }
    const disabled = groupDisabled()
    return () => owner.api.internal.scopeIn(disabled)
  }
}

export { ToolbarGroupDisabled, ToolbarHandle, useToolbarScope }
