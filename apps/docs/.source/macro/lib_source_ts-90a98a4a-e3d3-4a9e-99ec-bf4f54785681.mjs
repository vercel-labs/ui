// lib/source.ts
import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { applyMdxPreset } from "fumadocs-mdx/config";

// lib/highlight-lines.ts
var highlightLines = {
  name: "highlight-lines",
  line(node, line) {
    const ranges = String(this.options.meta?.__raw ?? "").match(
      /\{([\d,\s-]+)\}/
    )?.[1];
    if (ranges && inRanges(line, ranges)) {
      this.addClassToHast(node, "highlighted");
    }
  }
};
function inRanges(line, ranges) {
  return ranges.split(",").some((range) => {
    const [start, end = start] = range.split("-").map(Number);
    return line >= start && line <= end;
  });
}

// lib/plain-tokens.ts
var plainTokens = {
  name: "plain-tokens",
  pre(node) {
    const color = String(node.properties.style ?? "").toLowerCase().match(/--shiki-light:[^;]*;--shiki-dark:[^;]*/)?.[0];
    if (!color) {
      return;
    }
    for (const code of node.children) {
      if (code.type === "element") {
        for (const line of code.children) {
          if (line.type === "element") {
            line.children = unwrap(line.children, color);
          }
        }
      }
    }
  }
};
function unwrap(nodes, color) {
  const result = [];
  for (const node of nodes) {
    const plain = node.type === "element" && Object.keys(node.properties).length === 1 && String(node.properties.style).toLowerCase() === color;
    for (const child of plain ? node.children : [node]) {
      const last = result.at(-1);
      if (child.type === "text" && last?.type === "text") {
        last.value += child.value;
      } else {
        result.push(child);
      }
    }
  }
  return result;
}

// lib/remark-install.ts
function remarkInstall() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === "code" && [
        void 0,
        null,
        "",
        "bash",
        "sh",
        "shell",
        "npm",
        "package-install"
      ].includes(node.lang) && node.value) {
        const lines = node.value.trim().split("\n");
        const commands = lines.filter((line) => line.trim());
        if (commands.length && commands.every(
          (line) => /^(?:npm\s+|npx\s+|pnpm add\s+)\S/.test(line)
        )) {
          node.lang = "npm";
          node.value = lines.map(
            (line) => line.replace(/^(?:npm add|pnpm add)\s+/, "npm install ")
          ).join("\n");
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

// lib/text-blocks.ts
var textBlocks = {
  name: "text-blocks",
  pre(node) {
    if (this.options.lang !== "text") {
      return;
    }
    node.properties["data-text"] = "";
    if (/\bprompt\b/.test(String(this.options.meta?.__raw ?? ""))) {
      node.properties["data-prompt"] = "";
    }
  },
  line(node) {
    if (this.options.lang === "text" && /^\d+\. /.test(text(node))) {
      this.addClassToHast(node, "step");
    }
  }
};
function text(node) {
  if (node.type === "text") {
    return node.value ?? "";
  }
  return (node.children ?? []).map((child) => text(child)).join("");
}

// lib/source.ts
var docs = globalThis[/* @__PURE__ */ Symbol.for("fumadocs-mdx:macro:150c0e70-58be-4593-adb7-8d60dd2a2ac8")]("lib/source.ts#docs", "defineDocs", {
  dir: "content/docs",
  docs: {
    // A changelog post's date is a quoted string, like "2026-11-05", so YAML keeps it text.
    schema: pageSchema.extend({ date: pageSchema.shape.title.optional() }),
    // The default GitHub themes' comments and strings miss 4.5:1 on our code frames.
    mdxOptions: applyMdxPreset({
      rehypeCodeOptions: {
        themes: { light: "github-light-default", dark: "github-dark-default" },
        // Fumadocs' own, for `// [!code highlight]`, `[!code ++]`, `[!code word:x]` and `[!code focus]`.
        transformers: [
          ...rehypeCodeDefaultOptions.transformers ?? [],
          highlightLines,
          textBlocks,
          plainTokens
        ]
      },
      remarkPlugins: (plugins) => [remarkInstall, ...plugins],
      remarkNpmOptions: { persist: { id: "package-manager" } }
    })
  },
  meta: { schema: metaSchema }
});
