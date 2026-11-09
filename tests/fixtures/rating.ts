// The ratings every implementation renders. Names and scores are the contract
// the specs rely on, so change them here and nowhere else.
const ratingFixture = {
  // Whole stars, in a form, with a default score.
  quality: { label: "Quality", name: "quality", defaultValue: 3 },
  // Half stars that a press on the checked one clears.
  value: { label: "Value for money", name: "value", step: 0.5 },
  // An average that only shows, named by its label.
  average: {
    value: 4.2,
    getValueLabel: (value: number, max: number) =>
      `Average rating: ${value} out of ${max}`,
  },
}

export { ratingFixture }
