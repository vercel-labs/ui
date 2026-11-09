// A static server for the browser build specs, with no dependencies, like
// any host a page without a bundler might use.
//
//   node serve.mjs <folder> <port> [<name>=<value>...]
//
// Every response allows other sites, as the docs site's do. In `.html`
// files, `{{name}}` becomes its value, so a page can name the other server.
import { readFile, realpath } from "node:fs/promises"
import { createServer } from "node:http"
import path from "node:path"

const [folder, port, ...pairs] = process.argv.slice(2)
const root = await realpath(folder)
const values = Object.fromEntries(pairs.map((pair) => pair.split("=")))
const types = { ".html": "text/html", ".js": "text/javascript" }

createServer(async (request, response) => {
  try {
    const requested = decodeURIComponent(
      new URL(request.url, "http://host").pathname
    )
    const file = await realpath(path.join(root, requested))
    if (!file.startsWith(root + path.sep)) {
      throw new Error("Outside the served folder.")
    }
    let body = await readFile(file)
    if (file.endsWith(".html")) {
      body = body
        .toString()
        .replace(/\{\{(\w+)\}\}/g, (_, name) => values[name] ?? "")
    }
    response.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
    })
    response.end(body)
  } catch {
    response.writeHead(404).end()
  }
}).listen(Number(port), "127.0.0.1")
