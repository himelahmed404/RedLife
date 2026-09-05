import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('redlife');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  user: {
    additionalFields: {
      Role: {
        type: "string",
        defaultValue: "donor",
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
      }
    }
  },
  emailAndPassword: { 
    enabled: true, 
  }
});