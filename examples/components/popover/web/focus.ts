import "@ui-sdk/web/popover"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-popover>
        <ui-popover-trigger><button>First field</button></ui-popover-trigger>
        <ui-popover-content>
          <ui-popover-title>Rename</ui-popover-title>
          <label data-slot="label">
            Name
            <input value="Quarterly report" />
          </label>
        </ui-popover-content>
      </ui-popover>
      <ui-popover>
        <ui-popover-trigger><button>Specific element</button></ui-popover-trigger>
        <ui-popover-content initial-focus="[data-confirm]">
          <ui-popover-title>Apply changes?</ui-popover-title>
          <ui-popover-description>Focus starts on Apply, not Cancel.</ui-popover-description>
          <div data-slot="row">
            <ui-popover-close><button>Cancel</button></ui-popover-close>
            <ui-popover-close><button data-confirm data-variant="solid">Apply</button></ui-popover-close>
          </div>
        </ui-popover-content>
      </ui-popover>
      <ui-popover>
        <ui-popover-trigger><button>No focus change</button></ui-popover-trigger>
        <ui-popover-content initial-focus="none" final-focus="none">
          <ui-popover-title>Status</ui-popover-title>
          <ui-popover-description>All systems are running.</ui-popover-description>
        </ui-popover-content>
      </ui-popover>
    </div>
  `
}

export { mount }
