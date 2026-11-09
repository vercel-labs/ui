import "./index.css"

// The page at / with no fixture: every fixture, with a link per framework
// entry, so a person can browse what the specs run against.
const frameworks = ["react", "vue", "svelte", "web"]

// ./fixtures/menu/react-data.tsx -> ["menu", "react-data"]. Files that aren't
// framework entries, like data.ts or shell.ts, are skipped.
function parseEntry(path: string) {
  const match = path.match(
    /^\.\/fixtures\/([^/]+)\/([a-z]+(?:-[a-z]+)?)\.tsx?$/
  )
  if (!match) {
    return null
  }
  const [, fixture, framework] = match
  return frameworks.includes(framework.split("-")[0])
    ? { fixture, framework }
    : null
}

function groupByFixture(paths: string[]) {
  const groups = new Map<string, string[]>()
  for (const path of paths) {
    const entry = parseEntry(path)
    if (!entry) {
      continue
    }
    const entries = groups.get(entry.fixture) ?? []
    entries.push(entry.framework)
    groups.set(entry.fixture, entries)
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b))
}

// The plain entry first, then -data and -ssr, as the README lists them.
const variants = ["", "data", "ssr"]

function entriesFor(framework: string, entries: string[]) {
  const rank = (entry: string) => variants.indexOf(entry.split("-")[1] ?? "")
  return entries
    .filter((entry) => entry.split("-")[0] === framework)
    .sort((a, b) => rank(a) - rank(b))
}

function link(fixture: string, framework: string) {
  const anchor = document.createElement("a")
  anchor.href = `/?fixture=${fixture}&framework=${framework}`
  anchor.textContent = framework
  return anchor
}

function row(fixture: string, entries: string[]) {
  const tr = document.createElement("tr")
  const name = document.createElement("th")
  name.scope = "row"
  name.textContent = fixture
  tr.append(name)
  for (const framework of frameworks) {
    const cell = document.createElement("td")
    cell.append(
      ...entriesFor(framework, entries).map((entry) => link(fixture, entry))
    )
    tr.append(cell)
  }
  return tr
}

function renderIndex(root: HTMLElement, paths: string[]) {
  const groups = groupByFixture(paths)
  root.className = "index"
  root.innerHTML = `
    <h1>Playground</h1>
    <p>${groups.length} fixtures. Add <code>?sr</code> for the virtual screen reader, <code>&amp;dir=rtl</code> for right-to-left, <code>&amp;animate</code> for motion.</p>
    <table>
      <thead><tr><th scope="col">Fixture</th>${frameworks.map((framework) => `<th scope="col">${framework}</th>`).join("")}</tr></thead>
      <tbody></tbody>
    </table>
  `
  root
    .querySelector("tbody")!
    .append(...groups.map(([fixture, entries]) => row(fixture, entries)))
}

export { renderIndex }
