import { Client, Databases, Storage } from "node-appwrite";

// Initialize Appwrite client
export const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "") // Set your Appwrite endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "") // Set your Appwrite project ID
  .setKey(process.env.NEXT_APPWRITE_KEY || ""); // Set your Appwrite API key

export const databases = new Databases(client);
export const storage = new Storage(client);
