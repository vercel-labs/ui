type Project = {
  id: string
  name: string
  create?: string
  needs?: string
  steps?: string[]
  styles?: string
}

type Stack = {
  id: string
  name: string
  pkg?: string
  needs?: string
  note?: string
  quickStart?: string[]
  projects: Project[]
}

const stacks = [
  {
    id: "react",
    name: "React",
    pkg: "react",
    needs: "It needs React 19 or newer.",
    projects: [
      {
        id: "next",
        name: "Next.js",
        create: "npx create-next-app@latest . --yes",
      },
      {
        id: "vite",
        name: "Vite",
        create: "npm create vite@latest . -- --template react-ts",
      },
      {
        id: "start",
        name: "TanStack Start",
        create: "npx @tanstack/cli@latest create . --framework react",
      },
    ],
  },
  {
    id: "vue",
    name: "Vue",
    pkg: "vue",
    needs: "It needs Vue 3.5 or newer.",
    quickStart: [
      `If it's a Nuxt 4 or newer app, add "@ui-sdk/vue" to modules in nuxt.config.ts.`,
    ],
    projects: [
      {
        id: "nuxt",
        name: "Nuxt",
        create:
          "npm create nuxt@latest . -- --template minimal --packageManager npm --no-gitInit --force",
        steps: [`Add "@ui-sdk/vue" to modules in nuxt.config.ts.`],
        styles: `Add the default styles once to css in nuxt.config.ts: css: ["@ui-sdk/core/web.css"]`,
      },
      {
        id: "vite",
        name: "Vite",
        create: "npm create vite@latest . -- --template vue-ts",
      },
    ],
  },
  {
    id: "svelte",
    name: "Svelte",
    pkg: "svelte",
    needs: "It needs Svelte 5.33 or newer.",
    projects: [
      {
        id: "sveltekit",
        name: "SvelteKit",
        create:
          "npx sv create . --template minimal --types ts --no-add-ons --install npm",
      },
      {
        id: "vite",
        name: "Vite",
        create: "npm create vite@latest . -- --template svelte-ts",
      },
    ],
  },
  {
    id: "solid",
    name: "Solid",
    pkg: "solid",
    needs: "It needs Solid 2: solid-js and @solidjs/web 2.0.0-rc.14 or newer.",
    projects: [
      {
        id: "vite",
        name: "Vite",
        create: "npm create vite@latest . -- --template solid-ts",
      },
      {
        id: "start",
        name: "TanStack Start",
        create: "npx @tanstack/cli@latest create . --framework solid",
        // The stable TanStack Start for Solid is on Solid 1.9; only its release
        // candidate supports Solid 2.
        needs:
          "It needs Solid 2: move solid-js, @solidjs/web and @tanstack/solid-start to their 2.0 release candidates, with solid-js and @solidjs/web 2.0.0-rc.14 or newer.",
      },
    ],
  },
  {
    id: "web-components",
    name: "Web Components",
    pkg: "web",
    needs:
      "Each component registers its tags when you import its entry, like @ui-sdk/web/dialog.",
    projects: [
      {
        id: "vite",
        name: "Vite",
        create: "npm create vite@latest . -- --template vanilla-ts",
      },
      { id: "html", name: "HTML" },
    ],
  },
  {
    id: "artifacts",
    name: "Artifacts",
    note: "Copy and paste the following prompt in Claude Code or Cowork.",
    projects: [],
  },
] satisfies Stack[]

type StackId = (typeof stacks)[number]["id"]

const skillStep =
  "If you support skills, run: npx skills add vercel-labs/ui --skill ui-sdk"
const tailwindStyles = `If the app uses Tailwind CSS, start its global stylesheet with these lines instead, in place of its own @import "tailwindcss", so Tailwind's base styles don't reset them:
   @layer ui-sdk;
   @import "tailwindcss";
   @import "@ui-sdk/core/web.css" layer(components);`
const closing = "When you're done, ask me what I'd like to build."

function findStack(id: string) {
  return stacks.find((stack) => stack.id === id) ?? stacks[0]
}

function steps(list: string[]) {
  return list.map((step, index) => `${index + 1}. ${step}`).join("\n")
}

function webTags(site: string) {
  return `   <script type="module" src="${site}/web.js"></script>\n   <link rel="stylesheet" href="${site}/web.css" />`
}

function agentsStep(docs: string) {
  return `Add a note to AGENTS.md, creating it if needed: before using ui-sdk, follow the ui-sdk skill if it's installed, and read ${docs}/llms.txt. To build a new component, also search ${docs}/core.md by heading, and read rendering.md next to it.`
}

function installStep(pkg: string) {
  return `Install @ui-sdk/${pkg} and @ui-sdk/core with the project's package manager. If a release-age policy blocks the install, stop and ask me instead of changing it.`
}

/** The Quick Start prompt for a framework, as content/shared/setup-prompt has it. */
function quickStartPrompt(stackId: StackId) {
  const stack = findStack(stackId)
  if (!stack.pkg) {
    return ""
  }
  return `Set up ui-sdk in this ${stack.name} project. ${stack.needs}

${steps([installStep(stack.pkg), ...(stack.quickStart ?? []), agentsStep(`node_modules/@ui-sdk/${stack.pkg}/docs`), skillStep])}`
}

function artifactPrompt(site: string) {
  return `Build this as a single HTML page with ui-sdk web components. Each component registers its tags the first time they appear on the page.

${steps([
  `Load ui-sdk with these two tags in the <head>. web.css gives every component its default styles:\n${webTags(site)}`,
  `Before you write any code, read ${site}/web.md.`,
  "Keep everything in that one file, with your styles in a <style> tag. Show me the whole file each time.",
])}`
}

function htmlPrompt(site: string) {
  return `Set up ui-sdk in this HTML project, with no build step. Each component registers its tags the first time they appear on the page.

${steps([
  `Add these two tags to the <head> of each page. web.css gives every component its default styles:\n${webTags(site)}`,
  `Add a note to AGENTS.md, creating it if needed: before using ui-sdk, follow the ui-sdk skill if it's installed, and read ${site}/web.md.`,
  skillStep,
])}`
}

function projectPrompt(stack: Stack & { pkg: string }, project: Project) {
  return `Set up ui-sdk in this ${stack.name} project with ${project.name}. ${project.needs ?? stack.needs}
If the folder is empty, create the project first: ${project.create}

${steps([
  installStep(stack.pkg),
  ...(project.steps ?? []),
  `${project.styles ?? `Import the default styles once at the app's entry: import "@ui-sdk/core/web.css"`}. ${tailwindStyles}`,
  agentsStep(`node_modules/@ui-sdk/${stack.pkg}/docs`),
  skillStep,
  "Run the project's build and make sure it passes.",
])}`
}

/**
 * The prompt the Copy Prompt dialog copies: the Quick Start prompt for the
 * framework, with the project's create command and web.css as its styles.
 */
function setupPrompt({
  stackId,
  projectId,
  site,
}: {
  stackId: string
  projectId?: string
  site: string
}) {
  const stack = findStack(stackId)
  const siteUrl = site.replace(/\/+$/, "")
  const project =
    stack.projects.find((item) => item.id === projectId) ?? stack.projects[0]
  const body = !stack.pkg
    ? artifactPrompt(siteUrl)
    : project.id === "html"
      ? htmlPrompt(siteUrl)
      : projectPrompt(stack, project)
  return `${body}\n\n${closing}`
}

export { quickStartPrompt, setupPrompt, type StackId, stacks }
