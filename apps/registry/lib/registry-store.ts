import { get as getBlob } from "@vercel/blob"
import { createClient } from "@vercel/global-config"

/**
 * The registry's store on Vercel: files in a private Blob store
 * (`BLOB_STORE_ID` with OIDC, or `BLOB_READ_WRITE_TOKEN`), tokens in Global
 * Config, formerly Edge Config, as `token_<username>` items holding the
 * token's SHA-256 hex.
 */
const registryStore = {
  async read(pathname: string) {
    // Indexes change on every release, so they skip the CDN cache. Tarballs never change.
    const result = await getBlob(pathname, { access: "private", useCache: !pathname.endsWith(".json") })
    return result?.statusCode === 200 ? result.stream : null
  },
  async findTokenHash(username: string) {
    const hash = await tokenConfig().get(`token_${username}`)
    return typeof hash === "string" ? hash : undefined
  },
}

let client: ReturnType<typeof createClient> | undefined

// Created on first use, so a missing connection fails token checks, not the plain root page.
function tokenConfig() {
  // Stores connected since the rename set GLOBAL_CONFIG, older ones EDGE_CONFIG.
  // No stale reads on errors, so an outage can't bring back a revoked token.
  client ??= createClient(process.env.GLOBAL_CONFIG ?? process.env.EDGE_CONFIG, { staleIfError: false })
  return client
}

export { registryStore }
