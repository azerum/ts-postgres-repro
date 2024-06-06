import { test } from 'vitest'
import { DatabaseManager } from './DatabaseManager.js'
import { ClientLike, Driver } from './Driver.js'

export interface DatabaseTestContext {
    client: ClientLike
}

export function databaseTest(driver: Driver) {
    const nextDatabaseName = makeDatabaseNamesGenerator()

    return test.extend<DatabaseTestContext>({
        client: async ({ }, use) => {
            const manager = await DatabaseManager.connectToSystemDatabase(driver)

            const databaseName = nextDatabaseName()
            await manager.createFreshDatabase(databaseName)

            const client = await driver.connect(databaseName)
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
}

function makeDatabaseNamesGenerator() {
    const uniquePart = process.hrtime.bigint()
    let nextId = 0

    return () => {
        const name = `test_${uniquePart}${nextId}`
        ++nextId

        return name
    }
}
