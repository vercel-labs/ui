import "@ui-sdk/web/tabs"

const ranges = [
  { value: "day", label: "Day", content: "128 visitors today." },
  { value: "week", label: "Week", content: "1,024 visitors this week." },
  { value: "month", label: "Month", content: "4,210 visitors this month." },
  { value: "year", label: "Year", content: "48,930 visitors this year." },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tabs default-value="day" loop="false">
      <ui-tabs-list aria-label="Range">
        ${ranges
          .map(
            (range) => `
              <ui-tabs-tab value="${range.value}">
                <button type="button">${range.label}</button>
              </ui-tabs-tab>`,
          )
          .join("")}
      </ui-tabs-list>
      ${ranges
        .map((range) => `<ui-tabs-panel value="${range.value}">${range.content}</ui-tabs-panel>`)
        .join("")}
    </ui-tabs>
  `
}

export { mount }
