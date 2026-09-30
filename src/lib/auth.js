import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('redlife');

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  user: {
    additionalFields: {
      // role and status are set by the server/admin only, never from the signup form
      role: {
        type: "string",
        defaultValue: "donor", // "donor" | "volunteer" | "admin"
        input: false,
      },
      status: {
        type: "string",
        defaultValue: "active", // "active" | "blocked"
        input: false,
      },
      number: {
        type: "string",
        defaultValue: "",
      },
      bloodGroup: {
        type: "string",
        defaultValue: "",
      },
      district: {
        type: "string",
        defaultValue: "",
      },
      upazila: {
        type: "string",
        defaultValue: "",
      },
      donorId: {
        type: "string",
        defaultValue: "",
      }
    }
  },
  emailAndPassword: { 
    enabled: true, 
  },
  plugins: [
    // Issues short-lived JWTs (GET /api/auth/token) for the Express API.
    // The server verifies them against the public keys at /api/auth/jwks.
    jwt({
      jwt: {
        expirationTime: "15m",
        // Keep the token small; the API reads role/status fresh from the DB
        definePayload: ({ user }) => ({ email: user.email, role: user.role }),
      },
    }),
  ],
});