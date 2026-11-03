import "@ui-sdk/web/menu"
import { Check, createElement, Monitor, ZoomIn, ZoomOut } from "lucide"

function mount(root: HTMLElement) {
  let zoom = 100
  let fit = false

  root.innerHTML = `
    <ui-menu>
      <ui-menu-trigger>
        <button aria-label="Zoom 100%">
          ${createElement(ZoomIn, { "aria-hidden": "true" }).outerHTML}
          <span>100%</span>
        </button>
      </ui-menu-trigger>
      <ui-menu-content>
        <ui-menu-group>
          <ui-menu-group-label>Zoom <span>100%</span></ui-menu-group-label>
          <ui-menu-item value="zoom-in" close-on-select="false">
            ${createElement(ZoomIn, { "aria-hidden": "true" }).outerHTML}
            Zoom in
          </ui-menu-item>
          <ui-menu-item value="zoom-out" close-on-select="false">
            ${createElement(ZoomOut, { "aria-hidden": "true" }).outerHTML}
            Zoom out
          </ui-menu-item>
          <ui-menu-item value="reset">
            Reset to 100%
          </ui-menu-item>
        </ui-menu-group>
        <ui-menu-separator></ui-menu-separator>
        <ui-menu-checkbox-item value="fit" checked="false" close-on-select>
          ${createElement(Monitor, { "aria-hidden": "true" }).outerHTML}
          Fit to window
          ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
        </ui-menu-checkbox-item>
      </ui-menu-content>
    </ui-menu>
  `
  const button = root.querySelector("button")!
  const zoomIn = root.querySelector("[value=zoom-in]")!
  const zoomOut = root.querySelector("[value=zoom-out]")!
  const fitItem = root.querySelector("[value=fit]")!
  const zoomLabel = root.querySelector("ui-menu-group-label span")!

  const show = () => {
    button.setAttribute("aria-label", `Zoom ${fit ? "to fit" : `${zoom}%`}`)
    button.querySelector("span")!.textContent = fit ? "Fit" : `${zoom}%`
    zoomLabel.textContent = `${zoom}%`
    zoomIn.toggleAttribute("disabled", zoom >= 200)
    zoomOut.toggleAttribute("disabled", zoom <= 50)
  }

  root.addEventListener(
    "action",
    (event) => {
      const { value } = (event as CustomEvent<{ value: string }>).detail
      if (value === "zoom-in") zoom = Math.min(200, zoom + 10)
      if (value === "zoom-out") zoom = Math.max(50, zoom - 10)
      if (value === "reset") zoom = 100
      show()
    },
    { capture: true },
  )
  fitItem.addEventListener("checkedchange", (event) => {
    fit = (event as CustomEvent<{ value: boolean }>).detail.value
    fitItem.setAttribute("checked", String(fit))
    show()
  })
}

export { mount }
