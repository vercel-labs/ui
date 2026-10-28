// What every field-choice-card fixture renders: choice cards, each a
// FieldLabel wrapping a whole Field with a checkbox in it. Titles,
// descriptions and order are the contract the specs rely on, so change them
// here and nowhere else.
const fieldChoiceCardFixture = {
  cards: [
    { name: "backups", title: "Daily backups", description: "Keep a copy of every database each night." },
    { name: "alerts", title: "Usage alerts", description: "Email the team when usage passes its limit." },
  ],
  // With `?alone`, a FieldLabel outside any Field that labels nothing.
  alone: "Orphan label",
}

function fieldChoiceCardOptions() {
  const params = new URLSearchParams(location.search)
  return { alone: params.has("alone") }
}

export { fieldChoiceCardFixture, fieldChoiceCardOptions }
