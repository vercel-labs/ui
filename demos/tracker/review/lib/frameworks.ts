const frameworks = {
  svelte: {
    label: "Svelte",
    app: "SvelteKit",
    port: 5601,
    start: "app/src/routes/+page.svelte",
  },
  vue: {
    label: "Vue",
    app: "Nuxt",
    port: 5602,
    start: "app/app/pages/index.vue",
  },
  react: {
    label: "React",
    app: "Next.js",
    port: 5600,
    start: "app/app/page.tsx",
  },
  solid: {
    label: "Solid",
    app: "Solid with Vite",
    port: 5603,
    start: "app/src/pages/issues.tsx",
  },
  web: {
    label: "Web components",
    app: "lit-html with Vite",
    port: 5604,
    start: "app/src/app.ts",
  },
} as const

type Framework = keyof typeof frameworks

const frameworkCookie = "review-framework"

function isFramework(value: unknown): value is Framework {
  return typeof value === "string" && Object.hasOwn(frameworks, value)
}

// Only trackers with a URL are listed, so a deployment shows the ones it runs. With
// none set, every tracker is assumed on its local port.
function availableFrameworks() {
  const all = Object.keys(frameworks) as Framework[]
  const configured = all.filter(
    (framework) => process.env[`TRACKER_${framework.toUpperCase()}_URL`]
  )
  return configured.length > 0 ? configured : all
}

function trackerOrigin(framework: Framework) {
  return (
    process.env[`TRACKER_${framework.toUpperCase()}_URL`] ??
    `http://localhost:${frameworks[framework].port}`
  )
}

function trackerBypass(framework: Framework) {
  return (
    process.env[`TRACKER_${framework.toUpperCase()}_BYPASS`] ??
    process.env.VERCEL_PROTECTION_BYPASS
  )
}

export {
  availableFrameworks,
  frameworkCookie,
  frameworks,
  isFramework,
  trackerBypass,
  trackerOrigin,
}
export type { Framework }
