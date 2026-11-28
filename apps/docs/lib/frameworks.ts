const frameworks = {
  react: {
    label: "React",
    short: "React",
    example: "react",
    ext: "tsx",
    lang: "tsx",
  },
  vue: { label: "Vue", short: "Vue", example: "vue", ext: "vue", lang: "vue" },
  svelte: {
    label: "Svelte",
    short: "Svelte",
    example: "svelte",
    ext: "svelte",
    lang: "svelte",
  },
  "web-components": {
    label: "Web Components",
    short: "Web",
    example: "web",
    ext: "ts",
    lang: "ts",
  },
  solid: {
    label: "Solid",
    short: "Solid",
    example: "solid",
    ext: "tsx",
    lang: "tsx",
  },
  angular: {
    label: "Angular",
    short: "Angular",
    example: "angular",
    ext: "ts",
    lang: "angular-ts",
  },
} as const

type Framework = keyof typeof frameworks

const frameworkIds = Object.keys(frameworks) as Framework[]

function isFramework(value: string): value is Framework {
  return value in frameworks
}

// Whether a prop is a callback, like `onOpenChange`.
const isCallback = (name: string) => /^on[A-Z]/.test(name)

/**
 * A callback's name as a framework writes it: `onOpenChange` in React, Svelte
 * and Solid, `@open-change` in Vue, the `openchange` event on web components and `(beforeOpenChange)` in Angular. Names that aren't callbacks come back as they are.
 */
function callbackIn(name: string, framework: Framework) {
  if (!isCallback(name)) {
    return name
  }
  const words = name.slice(2)
  if (framework === "vue") {
    return `@${words.replace(/(?<!^)([A-Z])/g, "-$1").toLowerCase()}`
  }
  if (framework === "web-components") {
    return words.toLowerCase()
  }
  // A change's details and `cancel()` come with the `before` output, like
  // `(beforeValueChange)`; `(valueChange)` carries the value alone.
  if (framework === "angular") {
    const output = words.endsWith("Change") ? `before${words}` : words
    return `(${output[0].toLowerCase()}${output.slice(1)})`
  }
  return name
}

export {
  callbackIn,
  type Framework,
  frameworkIds,
  frameworks,
  isCallback,
  isFramework,
}
