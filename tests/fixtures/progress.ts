// What every Progress fixture renders. Labels, values and order are
// the contract the specs rely on, so change them here and nowhere else.
const progressFixture = {
  // Advanced by "Advance" in steps of 20, and back to 40 with "Restart".
  upload: { label: "Uploading", value: 40, step: 20 },
  // No value: under way, but how far is unknown.
  loading: { label: "Loading" },
  // Read out with a value label.
  files: {
    label: "Files",
    value: 3,
    max: 12,
    valueLabel: (value: number) => `${value} of 12 files`,
  },
  // A unit instead of a percent.
  disk: {
    label: "Disk",
    value: 128,
    max: 512,
    format: { style: "unit", unit: "gigabyte" } as const,
  },
}

export { progressFixture }
