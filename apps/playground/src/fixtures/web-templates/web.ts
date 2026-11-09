import { createOverlays, createToaster } from "@ui-sdk/web"

// Elements that render their parts from data, each with a <template> whose
// parts they copy. See tests/specs/web-templates.spec.ts.

const toaster = createToaster()
const overlays = createOverlays()
const hostToaster = createToaster({ overlays })

async function mount(root: HTMLElement) {
  await Promise.all([
    import("@ui-sdk/web/select"),
    import("@ui-sdk/web/combobox"),
    import("@ui-sdk/web/menu"),
    import("@ui-sdk/web/tree"),
    import("@ui-sdk/web/toast"),
    import("@ui-sdk/web/overlays"),
  ])
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>

      <ui-select>
        <ui-select-label class="label">Plan</ui-select-label>
        <ui-select-trigger><button class="trigger"><ui-select-value></ui-select-value></button></ui-select-trigger>
        <template>
          <ui-select-content class="popup plan-content">
            <ui-select-item class="plan-item">
              <ui-select-item-text class="plan-text"></ui-select-item-text>
              <ui-select-item-indicator class="plan-indicator">✓</ui-select-item-indicator>
            </ui-select-item>
          </ui-select-content>
        </template>
      </ui-select>

      <ui-combobox multiple default-value="red, blue">
        <ui-combobox-label class="label">Colors</ui-combobox-label>
        <ui-combobox-chips class="chips">
          <ui-combobox-input><input class="input" /></ui-combobox-input>
        </ui-combobox-chips>
        <template>
          <ui-combobox-chip class="color-chip">
            <ui-combobox-chip-remove><button type="button" class="color-chip-remove">×</button></ui-combobox-chip-remove>
          </ui-combobox-chip>
        </template>
      </ui-combobox>

      <ui-menu>
        <ui-menu-trigger><button class="trigger">View</button></ui-menu-trigger>
        <template>
          <ui-menu-content class="popup view-content">
            <ui-menu-checkbox-item class="view-checkbox">
              <ui-menu-item-indicator class="view-check">✓</ui-menu-item-indicator>
            </ui-menu-checkbox-item>
            <ui-menu-radio-item class="view-radio">
              <ui-menu-item-indicator class="view-dot">•</ui-menu-item-indicator>
            </ui-menu-radio-item>
            <ui-menu-sub-trigger class="view-sub-trigger"><span class="view-chevron">›</span></ui-menu-sub-trigger>
            <ui-menu-sub-content class="popup view-sub-content"></ui-menu-sub-content>
          </ui-menu-content>
        </template>
      </ui-menu>

      <ui-tree aria-label="Docs" default-expanded="guides">
        <template>
          <ui-tree-item class="docs-item">
            <ui-tree-item-indicator class="docs-indicator">›</ui-tree-item-indicator>
            <ui-tree-item-label class="docs-label"></ui-tree-item-label>
            <ui-tree-group class="docs-group"></ui-tree-group>
          </ui-tree-item>
        </template>
      </ui-tree>

      <button data-toast="cancel">Toast with cancel</button>
      <button data-toast="plain">Toast without cancel</button>
      <button data-toast="host">Toast from the host</button>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>

      <ui-toast-region>
        <template>
          <ui-toast class="toast">
            <ui-toast-title class="toast-title"></ui-toast-title>
            <ui-toast-close><button class="toast-cancel"></button></ui-toast-close>
          </ui-toast>
        </template>
      </ui-toast-region>
    </div>
  `
  const output = root.querySelector("output")!

  root.querySelector("ui-select")!.items = [
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
  ]

  Object.assign(root.querySelector("ui-combobox")!, {
    items: [
      { value: "red", label: "Red" },
      { value: "green", label: "Green" },
      { value: "blue", label: "Blue" },
    ],
  })

  root.querySelector("ui-menu")!.items = [
    { type: "checkbox", value: "ruler", label: "Ruler", defaultChecked: true },
    {
      type: "radio-group",
      name: "zoom",
      defaultValue: "fit",
      items: [
        { value: "fit", label: "Fit" },
        { value: "full", label: "Full size" },
      ],
    },
    {
      type: "submenu",
      label: "Panels",
      items: [{ value: "layers", label: "Layers" }],
    },
  ]

  root.querySelector("ui-tree")!.items = [
    {
      value: "guides",
      label: "Guides",
      children: [
        { value: "install", label: "Install", href: "#install" },
        { value: "theming", label: "Theming" },
      ],
    },
  ]

  Object.assign(root.querySelector("ui-toast-region")!, { toaster })

  // The host renders its toasts from `toast.template`.
  const template = document.createElement("template")
  template.innerHTML = `<ui-toast class="host-toast"><ui-toast-title class="host-toast-title"></ui-toast-title></ui-toast>`
  root.append(
    Object.assign(document.createElement("ui-overlay-host"), {
      overlays,
      toast: { template },
    })
  )

  root.addEventListener("click", (event) => {
    const kind = (event.target as Element).closest<HTMLElement>("[data-toast]")
      ?.dataset.toast
    if (kind === "cancel") {
      toaster("Draft deleted", {
        cancel: {
          label: "Undo",
          onCancel: () => (output.textContent = "cancel"),
        },
      })
    }
    if (kind === "plain") {
      toaster("Draft saved")
    }
    if (kind === "host") {
      hostToaster("Synced")
    }
  })
}

export { mount }
