import { chronology } from "@ui-sdk/core/chronology"
import { createParts } from "./define-element"

// <ui-chronology> and its parts. Every part inside an item is optional, and
// <ui-chronology-time> wraps a <time datetime>. `feed` makes the events a
// feed of articles, and `busy` sets `aria-busy` on it.
function defineChronologyElements() {
  createParts(chronology, {
    root: {
      tag: "ui-chronology",
      display: "block",
      defaults: { loop: true },
      api: ["focus"],
    },
    item: { tag: "ui-chronology-item", display: "block" },
    marker: { tag: "ui-chronology-marker", display: "block" },
    connector: { tag: "ui-chronology-connector", display: "block" },
    // Binds to the <time> inside it, so its `datetime` stays machine readable.
    time: {
      tag: "ui-chronology-time",
      display: "block",
      target: (el) => el.querySelector<HTMLElement>(":scope > time") ?? el,
    },
    title: { tag: "ui-chronology-title", display: "block" },
    description: { tag: "ui-chronology-description", display: "block" },
  })
}

export { defineChronologyElements }
