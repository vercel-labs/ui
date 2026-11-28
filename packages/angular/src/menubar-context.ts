import { InjectionToken } from "@angular/core"
import type { menubar } from "@ui-sdk/core/menubar"
import type { PrimitiveHandle } from "./use-primitive.ts"

// The menubar a menu sits in, apart from the menubar's entry, so a menu can
// join one without importing it. A menu provides null to the menus inside it.
const MenubarContext = new InjectionToken<PrimitiveHandle<
  typeof menubar
> | null>("uiMenubar")

export { MenubarContext }
