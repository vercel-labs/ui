import { frameworkIds, frameworks } from "./frameworks"

// The page at /docs, outside every section. It sends readers to the right one by
// what they came to do, so its copy lives here for the page and its Markdown.

const questions = [
  {
    id: "framework",
    title: "Which framework are you using?",
    description: "Each guide shows you how to set up UI SDK and build your first component.",
    tiles: frameworkIds.map((framework) => ({
      title: frameworks[framework].label,
      description: undefined as string | undefined,
      href: `/docs/${framework}`,
    })),
  },
  {
    id: "components",
    title: "Looking for a component?",
    description: "Pick one, drop it into your app and make it look like yours.",
    tiles: [
      {
        title: "Components",
        description: "Every component, from Accordion to Tree, ready to style.",
        href: "/docs/components",
      },
    ],
  },
  {
    id: "core",
    title: "Building your own?",
    description: "Start from the behaviors underneath every component, like focus, selection and popups.",
    tiles: [
      { title: "Core", description: "The behaviors, and how they fit together.", href: "/docs/core" },
      {
        title: "Build a Component",
        description: "Build a toggle button, then render it in your framework.",
        href: "/docs/core/build-a-component",
      },
    ],
  },
  {
    id: "agents",
    title: "Working with an agent?",
    description: "Agents can build components for you and use the ones in your app.",
    tiles: [
      {
        title: "Build with an Agent",
        description: "Give an agent the right context and let it build a component.",
        href: "/docs/agents/build-with-an-agent",
      },
      {
        title: "Connect an Agent",
        description: "Let an agent read your components and call their actions.",
        href: "/docs/agents/connect-an-agent",
      },
    ],
  },
]

const getStarted = {
  title: "Get Started",
  description: "Pick the question that sounds most like you. Each one takes you to the right place to begin.",
  questions,
  toc: questions.map((question) => ({ title: question.title, url: `#${question.id}`, depth: 2 })),
}

function getStartedMarkdown() {
  const sections = questions.map((question) =>
    [
      `## ${question.title}`,
      question.description,
      question.tiles
        .map((tile) => `- [${tile.title}](${tile.href})${tile.description ? `: ${tile.description}` : ""}`)
        .join("\n"),
    ].join("\n\n"),
  )
  return [`# ${getStarted.title}`, getStarted.description, ...sections].join("\n\n") + "\n"
}

export { getStarted, getStartedMarkdown }
