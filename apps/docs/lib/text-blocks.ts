import type { ShikiTransformer } from "shiki"

// Marks plain-text fences, which wrap and have no line numbers, and prompts,
// like ```text prompt, which get a labeled copy button. A numbered step, like
// "1. Install", gets a hanging indent so its wrapped lines line up.
const textBlocks = {
  name: "text-blocks",
  pre(node) {
    if (this.options.lang !== "text") {
      return
    }
    node.properties["data-text"] = ""
    if (/\bprompt\b/.test(String(this.options.meta?.__raw ?? ""))) {
      node.properties["data-prompt"] = ""
    }
  },
  line(node) {
    if (this.options.lang === "text" && /^\d+\. /.test(text(node))) {
      this.addClassToHast(node, "step")
    }
  },
} satisfies ShikiTransformer

function text(node: {
  type: string
  value?: string
  children?: unknown[]
}): string {
  if (node.type === "text") {
    return node.value ?? ""
  }
  return (node.children ?? [])
    .map((child) => text(child as typeof node))
    .join("")
}

export { textBlocks }
