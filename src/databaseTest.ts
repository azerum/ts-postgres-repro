import { test } from 'vitest'
import { Client, connect } from 'ts-postgres'
import { DatabaseManager } from './DatabaseManager.js'

export interface DatabaseTestContext {
    client: Client
}

export const databaseTest = test.extend<DatabaseTestContext>({
    client: async ({}, use) => {
        const manager = await DatabaseManager.connectToSystemDatabase()

        const databaseName = nextDatabaseName()
        await manager.createFreshDatabase(databaseName)

        const client = await connect({ database: databaseName })
        await use(client)

        try {
            await client.end()
        }
        catch (error) {
            if (
                !(error instanceof Error) || 
                error.message !== 'Connection already closed'
            ) {
                throw error
            }
        }
        finally {
            await manager.dropDatabaseIfExists(databaseName)
        }
    }
})

const nextDatabaseName = databaseNameGenerator()

function databaseNameGenerator() {
    let suffix = 0

    return () => {
        const name = `test_${suffix}`
        ++suffix

        return name
    }
}
