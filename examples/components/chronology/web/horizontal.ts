import "@ui-sdk/web/chronology"

const milestones = [
  { title: "Kickoff", dateTime: "2026-01", time: "January" },
  { title: "Design review", dateTime: "2026-03", time: "March" },
  { title: "Beta", dateTime: "2026-06", time: "June" },
  { title: "Launch", dateTime: "2026-09", time: "September" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-chronology orientation="horizontal" loop="false" aria-label="Roadmap">
      ${milestones
        .map(
          (milestone) => `
            <ui-chronology-item>
              <ui-chronology-marker></ui-chronology-marker>
              <ui-chronology-connector></ui-chronology-connector>
              <ui-chronology-title>${milestone.title}</ui-chronology-title>
              <ui-chronology-time><time datetime="${milestone.dateTime}">${milestone.time}</time></ui-chronology-time>
            </ui-chronology-item>`
        )
        .join("")}
    </ui-chronology>
  `
}

export { mount }
