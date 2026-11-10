import "@ui-sdk/web/chronology"
import "@ui-sdk/web/collapsible"
import { ChevronDown, createElement } from "lucide"

const releases = [
  {
    title: "Version 2.4",
    dateTime: "2026-10-28",
    time: "October 28",
    description: "Faster search and resumable uploads.",
    changes: [
      "Search now matches file contents, not only names.",
      "Uploads resume after the connection drops.",
    ],
  },
  {
    title: "Version 2.3",
    dateTime: "2026-09-30",
    time: "September 30",
    description: "Shared links and a new sidebar.",
    changes: [
      "Shared links remember the folder they were opened from.",
      "The sidebar collapses to icons on narrow screens.",
    ],
  },
  {
    title: "Version 2.2",
    dateTime: "2026-08-26",
    time: "August 26",
    description: "Dark mode follows your system.",
    changes: ["Dark mode follows the system setting.", "Avatars are sharper."],
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-chronology aria-label="Changelog">
      ${releases
        .map(
          (release) => `
            <ui-chronology-item>
              <ui-chronology-marker></ui-chronology-marker>
              <ui-chronology-connector></ui-chronology-connector>
              <ui-chronology-title>${release.title}</ui-chronology-title>
              <ui-chronology-time><time datetime="${release.dateTime}">${release.time}</time></ui-chronology-time>
              <ui-chronology-description>${release.description}</ui-chronology-description>
              <ui-collapsible>
                <ui-collapsible-trigger>
                  <button type="button" aria-expanded="false">
                    What Changed
                    ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
                  </button>
                </ui-collapsible-trigger>
                <ui-collapsible-panel hidden>
                  <ul>
                    ${release.changes.map((change) => `<li>${change}</li>`).join("")}
                  </ul>
                </ui-collapsible-panel>
              </ui-collapsible>
            </ui-chronology-item>`
        )
        .join("")}
    </ui-chronology>
  `
}

export { mount }
