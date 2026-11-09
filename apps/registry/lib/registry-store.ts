import { get as getBlob } from "@vercel/blob"

/**
 * The registry's store on Vercel: files in a private Blob store
 * (`BLOB_STORE_ID` with OIDC, or `BLOB_READ_WRITE_TOKEN`).
 */
const registryStore = {
  async read(pathname: string) {
    // Indexes change on every release, so they skip the CDN cache. Tarballs never change.
    const result = await getBlob(pathname, {
      access: "private",
      useCache: !pathname.endsWith(".json"),
    })
    return result?.statusCode === 200 ? result.stream : null
  },
}

export { registryStore }
