import { readSettings } from "tracker-data"
import * as db from "tracker-data/store"
import type { Actions, PageServerLoad } from "./$types"

const load: PageServerLoad = () => ({ settings: db.getSettings() })

const actions: Actions = {
  default: async ({ request }) => {
    db.updateSettings(readSettings(Object.fromEntries(await request.formData())))
  },
}

export { actions, load }
