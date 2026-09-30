import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

// No baseURL: the auth routes live on this same Next.js app (/api/auth/*),
// so the client uses the current origin in dev and in production.
export const authClient = createAuthClient({
  plugins: [jwtClient()],
})
