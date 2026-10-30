// Starts the review app and the trackers it shows, each with source locations
// on. Usage: pnpm review [framework...], all of them by default.
import { spawn } from "node:child_process"

const frameworks = ["svelte", "vue", "react", "solid", "web"]
const chosen = process.argv.slice(2).filter((name) => frameworks.includes(name))
const names = chosen.length > 0 ? chosen : frameworks
const reviewPort = Number(process.env.REVIEW_PORT ?? 5610)
const portOf = (name) => reviewPort + 1 + frameworks.indexOf(name)

const children = []
const run = (filter, env) => {
  const child = spawn("pnpm", ["--filter", filter, "dev"], {
    env: { ...process.env, ...env },
    stdio: ["ignore", "inherit", "inherit"],
  })
  children.push(child)
}

for (const name of names) run(`tracker-${name}`, { TRACKER_PORT: String(portOf(name)), TRACKER_REVIEW: "1" })
run("tracker-review", {
  REVIEW_PORT: String(reviewPort),
  ...Object.fromEntries(
    names.map((name) => [`TRACKER_${name.toUpperCase()}_URL`, `http://localhost:${portOf(name)}`]),
  ),
})

console.log(`\nReview app: http://localhost:${reviewPort}/review?fw=${names[0]}\n`)

const stop = () => {
  for (const child of children) child.kill("SIGTERM")
  process.exit()
}
process.on("SIGINT", stop)
process.on("SIGTERM", stop)
