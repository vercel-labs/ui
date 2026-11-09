// What every Meter fixture renders. Labels, values and order are the
// contract the specs rely on, so change them here and nowhere else.
const meterFixture = {
  // Raised by "Fill" in steps of 20, past the maximum, and back to 60 with "Reset".
  storage: { label: "Storage", value: 60, step: 20 },
  // Read out with a value label.
  requests: {
    label: "Requests",
    value: 750,
    max: 1000,
    valueLabel: (value: number) => `${value} of 1000 requests`,
  },
  // A unit instead of a percent.
  disk: {
    label: "Disk",
    value: 128,
    max: 512,
    format: { style: "unit", unit: "gigabyte" } as const,
  },
  // Bounds other than 0 and 100: 3 of 1 to 5 is half way.
  score: { label: "Score", value: 3, min: 1, max: 5 },
}

export { meterFixture }
