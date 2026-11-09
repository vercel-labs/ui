type Node = {
  type: string
  lang?: string | null
  value?: string
  children?: Node[]
}

// Authors write npm or npx commands. Promote command blocks so remark-npm
// generates package-manager tabs, including when the fence has no language.
function remarkInstall() {
  return (tree: Node) => {
    const visit = (node: Node) => {
      if (
        node.type === "code" &&
        [
          undefined,
          null,
          "",
          "bash",
          "sh",
          "shell",
          "npm",
          "package-install",
        ].includes(node.lang) &&
        node.value
      ) {
        const lines = node.value.trim().split("\n")
        const commands = lines.filter((line) => line.trim())
        if (
          commands.length &&
          commands.every((line) =>
            /^(?:npm\s+|npx\s+|pnpm add\s+)\S/.test(line)
          )
        ) {
          node.lang = "npm"
          // The converter needs `install`; npm's `add` alias isn't supported.
          node.value = lines
            .map((line) =>
              line.replace(/^(?:npm add|pnpm add)\s+/, "npm install ")
            )
            .join("\n")
        }
      }
      node.children?.forEach(visit)
    }
    visit(tree)
  }
}

export { remarkInstall }
