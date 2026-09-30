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
  }
});