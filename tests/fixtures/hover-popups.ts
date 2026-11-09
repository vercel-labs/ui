// Popups that open on hover, in every implementation, to check what their
// callbacks report. Labels and order are the contract the specs rely on, so
// change them here and nowhere else.
//
// Page: Before, two days that share one tooltip, two people who share one
// hover card, a popover that opens on hover, and the last change reported.
const hoverPopupsFixture = {
  days: ["Mon", "Tue"],
  people: ["Ada", "Grace"],
  popover: { trigger: "Settings", content: "Settings popover" },
}

// What a callback reports, with the text of its event's target: "tooltip open: Mon",
// or "tooltip payload tue: Tue" when the Tue trigger hands the tooltip its payload.
function describeChange(component: string, change: string, event?: Event) {
  const target =
    event?.target instanceof Element
      ? event.target.textContent?.trim()
      : "no target"
  return `${component} ${change}: ${target}`
}

export { describeChange, hoverPopupsFixture }
