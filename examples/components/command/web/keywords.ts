import "@ui-sdk/web/command"

const commands = [
  { value: "calendar", label: "Calendar" },
  { value: "emoji", label: "Search Emoji", keywords: ["smiley", "face"] },
  { value: "calculator", label: "Calculator" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-command>
      <ui-command-input>
        <input aria-label="Search commands" placeholder="Try “smiley”" />
      </ui-command-input>
      <ui-command-empty>No results found.</ui-command-empty>
      <ui-command-list>
        ${commands
          .map(
            (item) => `
              <ui-command-item value="${item.value}" label="${item.label}" ${item.keywords ? `keywords="${item.keywords.join(",")}"` : ""}>
                <strong>${item.label}</strong>
              </ui-command-item>
            `,
          )
          .join("")}
      </ui-command-list>
    </ui-command>
  `
}

export { mount }
