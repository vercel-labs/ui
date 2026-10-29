import { collapsible, type CollapsibleApi } from "@ui-sdk/core/collapsible"
import { createParts, wrappedButton } from "./define-element"

// <ui-collapsible> and its parts. Markup:
//
// <ui-collapsible default-open>
//   <ui-collapsible-trigger><button>Details</button></ui-collapsible-trigger>
//   <ui-collapsible-panel>…</ui-collapsible-panel>
// </ui-collapsible>
//
// The live state is the `open` property. Setting it fires `openchange` like a
// press, and `openchangecomplete` fires once the panel has finished animating.
function defineCollapsibleElements() {
  createParts(collapsible, {
    root: {
      tag: "ui-collapsible",
      display: "block",
      state: {
        open: {
          get: (api: CollapsibleApi) => api.isOpen(),
          set: (api: CollapsibleApi, open: boolean) => api.setOpen(!!open),
        },
      },
      api: ["isOpen", "setOpen", "open", "close", "toggle", "focus"],
    },
    // A wrapper, so the trigger stays a real button with its built-in behavior.
    trigger: { tag: "ui-collapsible-trigger", display: "contents", target: wrappedButton },
    panel: { tag: "ui-collapsible-panel", display: "block" },
  })
}

export { defineCollapsibleElements }
