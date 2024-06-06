import { Client, connect } from 'ts-postgres'

export class DatabaseManager {
    constructor(private readonly client: Client) {}

    static async connectToSystemDatabase() {
        const client = await connect({
            database: 'postgres'
        })

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
            // DatabaseError is not exported as value, so we 
            // have to do checks on `unknown` instead of 
            // instanceof
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
