import { NextResponse, type NextRequest } from "next/server"

// The newest `@ui-sdk/web` release of each major, and of all as `latest`,
// from `next.config.mjs`, with and without a stylesheet.
const newest: Record<string, string> = JSON.parse(process.env.WEB_RELEASES ?? "{}")
const newestStyle: Record<string, string> = JSON.parse(process.env.WEB_STYLE_RELEASES ?? "{}")

/**
 * Sends a major, like `/web@1.js`, `/web@1.css` or `/web@1/tabs.js`, to its
 * newest release, and `/web.js`, `/web.css` or `/web/tabs.js` to the newest
 * release of all.
 * A redirect, not a rewrite: the loader then imports every file from the
 * release it came from, so a page never mixes two releases' code. The
 * redirect allows other sites too, since CORS applies at every hop, which
 * `headers` in `next.config.mjs` doesn't reach.
 */
function proxy(request: NextRequest) {
  const [match, major = "latest", rest] =
    request.nextUrl.pathname.match(/^\/web(?:@(\d+))?(\.js|\.css|\/.+)$/) ?? []
  const version = match && (rest === ".css" ? newestStyle : newest)[major]
  if (!version) return NextResponse.next()
  const response = NextResponse.redirect(new URL(`/web@${version}${rest}`, request.url), 307)
  response.headers.set("Access-Control-Allow-Origin", "*")
  // Five minutes, so a page picks up a release soon after it ships.
  response.headers.set("Cache-Control", "public, max-age=300")
  return response
}

export { proxy }

export const config = {
  matcher: [
    "/web.js",
    "/web.css",
    "/web/:path*",
    "/:file(web@\\d+\\.js)",
    "/:file(web@\\d+\\.css)",
    "/:folder(web@\\d+)/:path*",
  ],
}
