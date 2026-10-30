import { del, get, list, put } from "@vercel/blob"
import { readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"
import type { Framework } from "./frameworks"

type Comment = {
  id: string
  framework: Framework
  file: string
  line: number | null
  endLine?: number | null
  quote?: string | null
  path: string
  author: string
  body: string
  createdAt: string
}

type Store = {
  read: () => Promise<Comment[]>
  save: (comment: Comment) => Promise<void>
  remove: (id: string) => Promise<void>
}

const file = path.join(/* turbopackIgnore: true */ process.cwd(), "comments.json")

async function readFileComments(): Promise<Comment[]> {
  try {
    return JSON.parse(await readFile(file, "utf8"))
  } catch {
    return []
  }
}

async function writeFileComments(comments: Comment[]) {
  const temporary = `${file}.${process.pid}.tmp`
  await writeFile(temporary, `${JSON.stringify(comments, null, 2)}\n`)
  await rename(temporary, file)
}

// Saves and removes run one at a time, so two at once can't drop a comment.
let writes = Promise.resolve()

function queueWrite(change: (comments: Comment[]) => Comment[]) {
  const next = writes.then(async () => writeFileComments(change(await readFileComments())))
  writes = next.catch(() => {})
  return next
}

const fileStore: Store = {
  read: readFileComments,
  save: (comment) => queueWrite((comments) => [...comments, comment]),
  remove: (id) => queueWrite((comments) => comments.filter((comment) => comment.id !== id)),
}

// One blob per comment, so two people saving at once never overwrite each other.
const prefix = "review-comments/"

async function readBlob(pathname: string) {
  const result = await get(pathname, { access: "private", useCache: false })
  if (result?.statusCode !== 200) return null
  return JSON.parse(await new Response(result.stream).text()) as Comment
}

const blobStore: Store = {
  async read() {
    const pathnames: string[] = []
    let cursor: string | undefined
    do {
      const page = await list({ prefix, cursor })
      pathnames.push(...page.blobs.map((blob) => blob.pathname))
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
    const comments = await Promise.all(pathnames.map(readBlob))
    return comments
      .filter((comment) => comment !== null)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  },
  async save(comment) {
    await put(`${prefix}${comment.id}.json`, JSON.stringify(comment), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    })
  },
  async remove(id) {
    await del(`${prefix}${id}.json`)
  },
}

// A connected store sets one or the other. Vercel's file system is read-only, so
// there comments need the store.
const blobConnected = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
const store = blobConnected ? blobStore : process.env.VERCEL ? null : fileStore

export { store }
export type { Comment }
