import { InjectionToken } from "@angular/core"
import type { TextEditorAdapter } from "@ui-sdk/core/trigger-menu"

// The editor a token input provides, apart from its parts, so a trigger menu
// inside it finds its editor without bundling the token input.
const EditorContext = new InjectionToken<() => TextEditorAdapter | undefined>(
  "text-editor"
)

export { EditorContext }
