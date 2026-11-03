import "@ui-sdk/web/tooltip"
import { registerShortcut } from "@ui-sdk/web"
import { createElement, Save, Share2 } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <ui-tooltip shortcut="mod+s">
          <ui-tooltip-trigger><button data-action="save">${createElement(Save, { "aria-hidden": "true" }).outerHTML}</button></ui-tooltip-trigger>
          <ui-tooltip-content>
            Save
            <ui-tooltip-shortcut></ui-tooltip-shortcut>
          </ui-tooltip-content>
        </ui-tooltip>
        <ui-tooltip shortcut="mod+shift+e">
          <ui-tooltip-trigger><button data-action="share">${createElement(Share2, { "aria-hidden": "true" }).outerHTML}Share</button></ui-tooltip-trigger>
          <ui-tooltip-content>
            Share with your team
            <ui-tooltip-shortcut></ui-tooltip-shortcut>
          </ui-tooltip-content>
        </ui-tooltip>
      </div>
      <output data-slot="output">Nothing yet</output>
    </div>
  `
  const output = root.querySelector("output")!
  const actions = { save: () => (output.textContent = "Saved"), share: () => (output.textContent = "Shared") }
  root.querySelector('[data-action="save"]')!.addEventListener("click", actions.save)
  root.querySelector('[data-action="share"]')!.addEventListener("click", actions.share)

  const offs = [registerShortcut("mod+s", actions.save), registerShortcut("mod+shift+e", actions.share)]
  return () => offs.forEach((off) => off())
}

export { mount }
