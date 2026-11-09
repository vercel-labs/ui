import type { ShikiTransformer } from "shiki"

// Highlights the lines a code fence names in its meta, like ```ts {2,4-6}.
const highlightLines = {
  name: "highlight-lines",
  line(node, line) {
    const ranges = String(this.options.meta?.__raw ?? "").match(
      /\{([\d,\s-]+)\}/
    )?.[1]
    if (ranges && inRanges(line, ranges)) {
      this.addClassToHast(node, "highlighted")
    }
  },
} satisfies ShikiTransformer

function inRanges(line: number, ranges: string) {
  return ranges.split(",").some((range) => {
    const [start, end = start] = range.split("-").map(Number)
    return line >= start && line <= end
  })
}

export { highlightLines }
