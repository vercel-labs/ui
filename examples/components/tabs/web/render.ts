import "@ui-sdk/web/tabs"

const folders = [
  { value: "inbox", label: "Inbox", count: 12 },
  { value: "unread", label: "Unread", count: 3 },
  { value: "archived", label: "Archived", count: 0 },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tabs default-value="inbox">
      <ui-tabs-list aria-label="Mail">
        ${folders
          .map(
            (folder) => `
              <ui-tabs-tab value="${folder.value}">
                <button>
                  ${folder.label}
                  ${folder.count > 0 ? `<span data-slot="row">${folder.count}</span>` : ""}
                </button>
              </ui-tabs-tab>`,
          )
          .join("")}
      </ui-tabs-list>
      ${folders
        .map(
          (folder) =>
            `<ui-tabs-panel value="${folder.value}">${folder.count > 0 ? `${folder.count} conversations.` : "Nothing archived yet."}</ui-tabs-panel>`,
        )
        .join("")}
    </ui-tabs>
  `
}
