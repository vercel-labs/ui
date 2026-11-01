import "@ui-sdk/web/radio"
import "@ui-sdk/web/field"

const environments = [
  { value: "kubernetes", title: "Kubernetes", description: "Run GPU workloads on a K8s configured cluster." },
  {
    value: "vm",
    title: "Virtual machine",
    description: "Access a VM configured cluster to run GPU workloads.",
  },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <ui-field-label>Compute environment</ui-field-label>
      <ui-field-description>Select the compute environment for your cluster.</ui-field-description>
      <ui-radio-group name="environment" default-value="kubernetes">
        ${environments
          .map(
            (environment) => `
              <label data-slot="card">
                <span data-slot="stack">
                  <span>${environment.title}</span>
                  <span data-slot="hint">${environment.description}</span>
                </span>
                <ui-radio value="${environment.value}">
                  <ui-radio-indicator></ui-radio-indicator>
                </ui-radio>
              </label>`,
          )
          .join("")}
      </ui-radio-group>
    </ui-field>
  `
}
