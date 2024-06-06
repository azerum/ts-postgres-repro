import { Client } from 'pg'
import { Driver } from './Driver'

export const pgDriver: Driver = {
    async connect(database) {
        const client = new Client({ database })
        await client.connect()

        return client
    },
}
