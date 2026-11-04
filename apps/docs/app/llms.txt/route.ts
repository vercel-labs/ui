import { frameworkIds, frameworks } from "@/lib/frameworks"

export const dynamic = "force-static"

// Where an agent starts: what ui-sdk is, and the docs it can read as Markdown.
export function GET() {
  const text = `# ui-sdk

> The layer underneath a UI library: how interfaces behave, written once in a framework-free TypeScript core and rendered in React, Vue, Svelte, Solid and web components.

To build something ui-sdk doesn't ship, read Behaviors: build a component, compose behaviors, then explore the ones you need. To render a primitive, or to use what we ship, read your framework's llms.txt: its Rendering page, then every component's parts, props, state and styling hooks. To operate a page, or hand it to the browser's agent, read Agents.

## Behaviors and Agents

- [Behaviors](/docs/behaviors/llms.txt): every behavior by job (focus, selection, dragging, lists, trees, transitions, popups, and canvases), the helpers (text, numbers, dates, platform, and storage), building and testing your own component, and the reference
- [Agents](/docs/agents/llms.txt): the agent bridge and WebMCP, in one file

## Frameworks

${frameworkIds
  .map(
    (id) =>
      `- [${frameworks[id].label}](/docs/${id}/llms.txt): its Rendering page, then every component's reference, in one file. Pages: [Rendering](/docs/${id}/rendering), [Components](/docs/${id}/components)`,
  )
  .join("\n")}
`
  return new Response(text, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
}
