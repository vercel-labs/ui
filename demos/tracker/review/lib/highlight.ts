import { codeToHtml, type BundledLanguage } from "shiki"

const languages: Record<string, BundledLanguage> = {
  ts: "ts",
  tsx: "tsx",
  js: "js",
  mjs: "js",
  jsx: "jsx",
  svelte: "svelte",
  vue: "vue",
  css: "css",
  json: "json",
  html: "html",
  md: "md",
}

function languageOf(file: string) {
  return languages[file.split(".").pop() ?? ""]
}

async function highlight(code: string, file: string) {
  return codeToHtml(code, {
    lang: languageOf(file) ?? "text",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    transformers: [
      {
        line(node, line) {
          node.properties["data-line"] = line
          node.properties.id = `L${line}`
        },
      },
    ],
  })
}

export { highlight }
