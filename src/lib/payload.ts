import { getPayload as getPayloadInstance } from 'payload'
import config from '@/payload.config'

/**
 * Helper to initialize and retrieve the Payload CMS Local API
 * This is meant to be used on the server side (e.g. Next.js Server Components)
 */
export const getPayload = async () => {
  return await getPayloadInstance({ config })
}
