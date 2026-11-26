// An empty page with toggles, tabs, popups, form controls, fields and labels
// defined, plus `x-label` built on a native label, for specs that build
// elements the way frameworks and scripts do.
async function mount(root: HTMLElement) {
  root.innerHTML = `<button>Before</button><div id="stage"></div><button>After</button>`
  await import("@ui-sdk/web/toggle")
  await import("@ui-sdk/web/tabs")
  await import("@ui-sdk/web/popover")
  await import("@ui-sdk/web/dialog")
  await import("@ui-sdk/web/checkbox")
  await import("@ui-sdk/web/switch")
  await import("@ui-sdk/web/radio")
  await import("@ui-sdk/web/input")
  await import("@ui-sdk/web/combobox")
  await import("@ui-sdk/web/autocomplete")
  await import("@ui-sdk/web/command")
  await import("@ui-sdk/web/select")
  await import("@ui-sdk/web/otp-input")
  await import("@ui-sdk/web/file-input")
  await import("@ui-sdk/web/token-input")
  await import("@ui-sdk/web/field")
  await import("@ui-sdk/web/label")
  await import("@ui-sdk/web/slider")
  await import("@ui-sdk/web/number-input")
  const { createParts, wrappedChild } = await import("@ui-sdk/web")
  const { label } = await import("@ui-sdk/core/label")
  if (!customElements.get("x-label")) {
    createParts(label, {
      root: {
        tag: "x-label",
        target: wrappedChild("label"),
        display: "contents",
      },
    })
  }
}

export { mount }
