import 'server-only'
import { Client, Databases } from 'node-appwrite'

let cached: { client: Client; databases: Databases } | null = null

function readEnv(name: string): string {
  const value = process.env[name]
  if (!value || value.length === 0) {
    throw new Error(`Missing required Appwrite env var: ${name}`)
  }
  return value
}

export function getAppwrite() {
  if (cached) return cached
  const client = new Client()
    .setEndpoint(readEnv('APPWRITE_ENDPOINT'))
    .setProject(readEnv('APPWRITE_PROJECT_ID'))
    .setKey(readEnv('APPWRITE_API_KEY'))
  cached = { client, databases: new Databases(client) }
  return cached
}

export function getDatabases(): Databases {
  return getAppwrite().databases
}
