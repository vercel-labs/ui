import "@ui-sdk/web/drawer"
import { createElement, Minus, Plus } from "lucide"
const goal = { initial: 350, min: 200, max: 400, step: 10 }

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-drawer>
      <ui-drawer-trigger><button>Open Drawer</button></ui-drawer-trigger>
      <ui-drawer-backdrop></ui-drawer-backdrop>
      <ui-drawer-content>
        <div data-slot="grip" aria-hidden="true"></div>
        
          <div data-slot="stack">
            <ui-drawer-title>Move Goal</ui-drawer-title>
            <ui-drawer-description>Set your daily activity goal.</ui-drawer-description>
          </div>
          
            <div data-slot="row">
              <button type="button" aria-label="Decrease" data-step="-1">${createElement(Minus, { "aria-hidden": "true" }).outerHTML}</button>
              <div data-slot="stack">
                <div aria-live="polite"></div>
                <div data-slot="hint">Calories/day</div>
              </div>
              <button type="button" aria-label="Increase" data-step="1">${createElement(Plus, { "aria-hidden": "true" }).outerHTML}</button>
            </div>
          
          <div data-slot="stack">
            <ui-drawer-close value="submit"><button data-variant="solid">Submit</button></ui-drawer-close>
            <ui-drawer-close><button>Cancel</button></ui-drawer-close>
          </div>
        
      </ui-drawer-content>
    </ui-drawer>
  `
  const value = root.querySelector("[aria-live]")!
  const decrease = root.querySelector<HTMLButtonElement>('[data-step="-1"]')!
  const increase = root.querySelector<HTMLButtonElement>('[data-step="1"]')!
  let calories = goal.initial
  const show = () => {
    value.textContent = String(calories)
    decrease.disabled = calories <= goal.min
    increase.disabled = calories >= goal.max
  }
  decrease.addEventListener("click", () => {
    calories -= goal.step
    show()
  })
  increase.addEventListener("click", () => {
    calories += goal.step
    show()
  })
  show()
}

export { mount }
