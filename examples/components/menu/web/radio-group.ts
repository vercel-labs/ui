import "@ui-sdk/web/menu"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-trigger>
          <button>Panel</button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-radio-group name="position" value="bottom">
            <ui-menu-group-label>Position</ui-menu-group-label>
            ${["Top", "Bottom", "Right"]
              .map(
                (option) => `
                  <ui-menu-radio-item value="${option.toLowerCase()}">
                    <ui-menu-item-indicator></ui-menu-item-indicator>
                    ${option}
                  </ui-menu-radio-item>
                `,
              )
              .join("")}
          </ui-menu-radio-group>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-radio-group default-value="comfortable">
            <ui-menu-group-label>Density</ui-menu-group-label>
            ${["Compact", "Comfortable"]
              .map(
                (option) => `
                  <ui-menu-radio-item value="${option.toLowerCase()}">
                    <ui-menu-item-indicator></ui-menu-item-indicator>
                    ${option}
                  </ui-menu-radio-item>
                `,
              )
              .join("")}
          </ui-menu-radio-group>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">Panel at the bottom</output>
    </div>
  `
  const position = root.querySelector("ui-menu-radio-group")!
  position.addEventListener("valuechange", (event) => {
    const { value } = (event as CustomEvent<{ value: string }>).detail
    position.setAttribute("value", value)
    root.querySelector("output")!.textContent = `Panel at the ${value}`
  })
}

export { mount }
