import "@ui-sdk/web/chronology"

const events = [
  {
    title: "Deployed to production",
    dateTime: "2026-11-10T14:32",
    time: "Today, 2:32 PM",
    description: "Version 2.4.1 is live in every region.",
  },
  {
    title: "Checks passed",
    dateTime: "2026-11-10T14:20",
    time: "Today, 2:20 PM",
    description: "312 tests and the bundle size budget.",
  },
  {
    title: "Pull request merged",
    dateTime: "2026-11-10T13:58",
    time: "Today, 1:58 PM",
    description: "Ada merged Cache search results into main.",
  },
  {
    title: "Review requested",
    dateTime: "2026-11-09T17:05",
    time: "Yesterday, 5:05 PM",
    description: "Grace and Linus were asked to review.",
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-chronology aria-label="Activity">
      ${events
        .map(
          (event) => `
            <ui-chronology-item>
              <ui-chronology-marker></ui-chronology-marker>
              <ui-chronology-connector></ui-chronology-connector>
              <ui-chronology-title>${event.title}</ui-chronology-title>
              <ui-chronology-time><time datetime="${event.dateTime}">${event.time}</time></ui-chronology-time>
              <ui-chronology-description>${event.description}</ui-chronology-description>
            </ui-chronology-item>`
        )
        .join("")}
    </ui-chronology>
  `
}

export { mount }
