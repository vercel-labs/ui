import { NextResponse, type NextRequest } from "next/server"
import { frameworkCookie, isFramework, trackerBypass } from "./lib/frameworks"

// Lets the preview reach tracker deployments behind Vercel's deployment protection.
function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/review")) {
    return NextResponse.next()
  }
  const value = request.cookies.get(frameworkCookie)?.value
  const secret = trackerBypass(isFramework(value) ? value : "svelte")
  if (!secret) {
    return NextResponse.next()
  }
  const headers = new Headers(request.headers)
  headers.set("x-vercel-protection-bypass", secret)
  return NextResponse.next({ request: { headers } })
}

export { proxy }
