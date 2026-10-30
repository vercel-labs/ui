import { listIssues } from "tracker-data/store"
import type { LayoutServerLoad } from "./$types"

const load: LayoutServerLoad = () => ({
  issues: listIssues().map(({ id, title }) => ({ id, title })),
})

export { load }
