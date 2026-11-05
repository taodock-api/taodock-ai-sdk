export { TAODOCK_BASE_URL } from './config.js'
export {
  createTaoDock,
  type TaoDockProvider,
  type TaoDockProviderSettings,
} from './provider.js'

import { createTaoDock } from './provider.js'

/** Default provider using `TAODOCK_API_KEY` and, when set, `TAODOCK_BASE_URL`. */
export const taodock = createTaoDock()
