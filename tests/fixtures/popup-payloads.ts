// Popups that open on press, each shared by two triggers with payloads, in
// every implementation, to check what they report when another trigger takes
// the open popup over. Labels and order are the contract the specs rely on, so
// change them here and nowhere else.
//
// Page: Before, then for each popup its two triggers and the content, which
// shows the payload, then the last open and the last payload change reported.
// The dialog and the drawer aren't modal, so their other trigger stays usable
// while they're open. The popover's content has a button that opens it through
// its controller with another payload, `open({ payload: "linus" })`, while it's open.
const popupPayloadsFixture = {
  menu: { triggers: ["Roadmap", "Budget"], item: "Open" },
  popover: {
    triggers: ["Ada", "Grace"],
    show: { label: "Show Linus", payload: "linus" },
  },
  dialog: { triggers: ["Invoice 1", "Invoice 2"] },
  drawer: { triggers: ["Photo 1", "Photo 2"] },
}

// What the content shows for a payload: "Actions for budget".
const contentFor = (payload: unknown) => `Actions for ${payload}`

// Each trigger's payload: its label in lower case.
const payloadOf = (label: string) => label.toLowerCase()

export { describeChange } from "./hover-popups.ts"

export { contentFor, payloadOf, popupPayloadsFixture }
