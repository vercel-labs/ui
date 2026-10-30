// An empty page with toggles, tabs, popovers, dialogs, checkboxes and the elements
// that render content from their state defined, for specs that build
// elements the way frameworks and scripts do.
async function mount(root: HTMLElement) {
  root.innerHTML = `<button>Before</button><div id="stage"></div><button>After</button>`
  await import("@ui-sdk/web/toggle")
  await import("@ui-sdk/web/tabs")
  await import("@ui-sdk/web/popover")
  await import("@ui-sdk/web/dialog")
  await import("@ui-sdk/web/checkbox")
  await import("@ui-sdk/web/radio")
  await import("@ui-sdk/web/combobox")
  await import("@ui-sdk/web/autocomplete")
  await import("@ui-sdk/web/command")
  await import("@ui-sdk/web/select")
  await import("@ui-sdk/web/otp-input")
  await import("@ui-sdk/web/file-input")
  await import("@ui-sdk/web/token-input")
}

export { mount }
