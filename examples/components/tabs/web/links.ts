import "@ui-sdk/web/tabs"

const pages = [
  { value: "overview", href: "#project-overview", label: "Overview", content: "Everything at a glance." },
  { value: "activity", href: "#project-activity", label: "Activity", content: "What changed this week." },
  { value: "members", href: "#project-members", label: "Members", content: "Who can edit the project." },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tabs default-value="overview">
      <ui-tabs-list aria-label="Project">
        ${pages
          .map(
            (page) => `
              <ui-tabs-tab value="${page.value}">
                <a href="${page.href}">${page.label}</a>
              </ui-tabs-tab>`,
          )
          .join("")}
        <ui-tabs-indicator></ui-tabs-indicator>
      </ui-tabs-list>
      ${pages.map((page) => `<ui-tabs-panel value="${page.value}">${page.content}</ui-tabs-panel>`).join("")}
    </ui-tabs>
  `
}

export { mount }
