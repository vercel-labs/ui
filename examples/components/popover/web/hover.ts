import "@ui-sdk/web/popover"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-popover open-on-hover delay="200" close-delay="150">
      <ui-popover-trigger><button>@ada</button></ui-popover-trigger>
      <ui-popover-content side-offset="10">
        <ui-popover-arrow></ui-popover-arrow>
        <ui-popover-title>Ada Lovelace</ui-popover-title>
        <ui-popover-description>A collaborator on this project.</ui-popover-description>
      <ui-popover-close><button type="button">Close preview</button></ui-popover-close>
      </ui-popover-content>
    </ui-popover>
  `
}

export { mount }
