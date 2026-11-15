// The one command an agent runs: node tool.mjs <port> <tool> [args...]
const [port, tool, ...args] = process.argv.slice(2)
const response = await fetch(`http://localhost:${port}`, {
  method: "POST",
  body: JSON.stringify({ tool, args }),
})
console.log(await response.text())
