import { ClientLike, Driver } from './Driver'

export class DatabaseManager {
    constructor(private readonly client: ClientLike) {}

    static async connectToSystemDatabase(driver: Driver) {
        const client = await driver.connect('postgres')
        return new DatabaseManager(client)
    }

    async end() {
        await this.client.end()
    }

    async createFreshDatabase(name: string) {
        await this.dropDatabaseIfExists(name)
        await this.createDatabaseIfNotExists(name)
    }

    async dropDatabaseIfExists(name: string) {
        try {
            await this.client.query(`drop database ${name}`)
        }
        catch (error) {
            if (looksLikeDatabaseErrorWithCode(error, '3D000')) {
                return
            }

            throw error
        }
    }

    async createDatabaseIfNotExists(name: string) {
        try {
            await this.client.query(`create database ${name}`)
        }
        catch (error) {
            if (looksLikeDatabaseErrorWithCode(error, '42P04')) {
                return
            }

            throw error
        }
    }
}

function looksLikeDatabaseErrorWithCode(error: unknown, code: string) {
    if (typeof error !== 'object' || error === null) {
        return false
    }

    return ('code' in error && error.code === code)
}
