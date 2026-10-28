// What every field-choice-card fixture renders: choice cards, each a
// FieldLabel wrapping a whole Field with a checkbox in it. Titles,
// descriptions and order are the contract the specs rely on, so change them
// here and nowhere else.
const fieldChoiceCardFixture = {
  cards: [
    { name: "backups", title: "Daily backups", description: "Keep a copy of every database each night." },
    { name: "alerts", title: "Usage alerts", description: "Email the team when usage passes its limit." },
  ],
  // With `?later`, a card whose checkbox renders `delay` milliseconds after its label.
  later: {
    name: "reports",
    title: "Weekly reports",
    description: "Send a summary every Monday.",
    delay: 100,
  },
  // With `?alone`, a FieldLabel outside any Field that labels nothing.
  alone: "Orphan label",
}

// What every field-radios fixture renders: a Field labelled "Size" around a
// radio group, with each radio in a Field of its own with a label, between
// two buttons.
const fieldRadiosFixture = {
  label: "Size",
  name: "size",
  sizes: [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ],
}

function fieldChoiceCardOptions() {
  const params = new URLSearchParams(location.search)
  return { alone: params.has("alone"), later: params.has("later") }
}

export { fieldChoiceCardFixture, fieldChoiceCardOptions, fieldRadiosFixture }
