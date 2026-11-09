const markup = `
  <div class="fixture">
    <button>Before</button>
    <ui-menu>
      <ui-menu-trigger><button>Edit</button></ui-menu-trigger>
      <ui-menu-content class="popup">
        <ui-menu-item class="item" value="pin">Pin</ui-menu-item>
        <ui-menu-item class="item" value="zoom" close-on-select="false">Zoom in</ui-menu-item>
        <ui-menu-item class="item" value="erase" shortcut="mod+backspace">Erase</ui-menu-item>
        <ui-menu-item class="item" value="window" shortcut="alt+n">New window</ui-menu-item>
        <ui-menu-separator class="separator"></ui-menu-separator>
        <ui-menu-checkbox-item class="item" value="autosave" close-on-select>Autosave</ui-menu-checkbox-item>
        <ui-menu-checkbox-item class="item" value="pinned" checked>Pinned</ui-menu-checkbox-item>
        <ui-menu-radio-group value="left">
          <ui-menu-group-label class="label">Align</ui-menu-group-label>
          <ui-menu-radio-item class="item" value="left">Left</ui-menu-radio-item>
          <ui-menu-radio-item class="item" value="right">Right</ui-menu-radio-item>
        </ui-menu-radio-group>
        <ui-menu-sub>
          <ui-menu-sub-trigger class="item" disabled>Share</ui-menu-sub-trigger>
          <ui-menu-sub-content class="popup">
            <ui-menu-item class="item" value="email">Email</ui-menu-item>
          </ui-menu-sub-content>
        </ui-menu-sub>
        <ui-menu-sub loop="false">
          <ui-menu-sub-trigger class="item">More</ui-menu-sub-trigger>
          <ui-menu-sub-content class="popup">
            <ui-menu-item class="item" value="first">First</ui-menu-item>
            <ui-menu-item class="item" value="last">Last</ui-menu-item>
          </ui-menu-sub-content>
        </ui-menu-sub>
      </ui-menu-content>
    </ui-menu>
    <ui-menu id="offsets">
      <ui-menu-trigger><button>Offsets</button></ui-menu-trigger>
      <ui-menu-content class="popup" side-offset="8" align-offset="-4" collision-padding="24">
        <ui-menu-item class="item" value="one">One</ui-menu-item>
        <ui-menu-item class="item" value="two">Two</ui-menu-item>
      </ui-menu-content>
    </ui-menu>
    <button id="align-right">Align right</button>
    <button>After</button>
    <output role="status" aria-label="Last action"></output>
    <output role="status" aria-label="Selections">0</output>
  </div>
`

async function mount(root: HTMLElement) {
  root.innerHTML = markup
  await import("@ui-sdk/web/menu")
  const group = root.querySelector("ui-menu-radio-group")!
  const selections = root.querySelector('output[aria-label="Selections"]')!
  // Canceling the select event keeps the menu open, like preventDefault() in onSelect.
  root
    .querySelector('ui-menu-item[value="pin"]')!
    .addEventListener("select", (event) => {
      event.preventDefault()
      selections.textContent = String(Number(selections.textContent) + 1)
    })
  // The group is controlled: its value attribute follows each pick.
  group.addEventListener("valuechange", (event) =>
    group.setAttribute(
      "value",
      (event as CustomEvent<{ value: string }>).detail.value
    )
  )
  root
    .querySelector("#align-right")!
    .addEventListener("click", () => group.setAttribute("value", "right"))
  root.addEventListener(
    "action",
    (event) => {
      root.querySelector("output")!.textContent = (
        event as CustomEvent<{ value: string }>
      ).detail.value
    },
    { capture: true }
  )
}

export { mount }
