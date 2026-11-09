/**
 * Serves some paths of the docs site, which sits behind Deployment Protection,
 * from this public host, with the docs project's Protection Bypass for
 * Automation secret. A path ending in `*` matches everything under it.
 *
 * A redirect to the docs site points back at this host, so `/web.js` still
 * lands on one release and imports every file from it here.
 */
function createDocsProxy(options: {
  /** The docs site, like `https://ui.labs.vercel.dev`. */
  origin: string
  /** The docs project's Protection Bypass for Automation secret. */
  bypass: string | undefined
  /** The paths to serve, like `/web.js` or `/web@*`. */
  paths: string[]
  fetch?: typeof fetch
}) {
  const send = options.fetch ?? fetch
  const matches = (pathname: string) =>
    options.paths.some((path) =>
      path.endsWith("*")
        ? pathname.startsWith(path.slice(0, -1))
        : pathname === path
    )

  return async (request: Request) => {
    const url = new URL(request.url)
    if (!matches(url.pathname)) {
      return null
    }
    if (!options.bypass) {
      return new Response("Not Found", { status: 404 })
    }

    const upstream = await send(
      new URL(url.pathname + url.search, options.origin),
      {
        headers: { "x-vercel-protection-bypass": options.bypass },
        redirect: "manual",
      }
    )
    const headers = new Headers()
    for (const name of [
      "content-type",
      "cache-control",
      "access-control-allow-origin",
      "etag",
      "last-modified",
    ]) {
      const value = upstream.headers.get(name)
      if (value) {
        headers.set(name, value)
      }
    }
    const location = upstream.headers.get("location")
    if (location) {
      const target = new URL(location, options.origin)
      headers.set(
        "location",
        target.origin === new URL(options.origin).origin
          ? new URL(target.pathname + target.search, url.origin).href
          : target.href
      )
    }
    return new Response(upstream.body, { status: upstream.status, headers })
  }
}

export { createDocsProxy }
