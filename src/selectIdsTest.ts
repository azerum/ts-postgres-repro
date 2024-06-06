import { expect } from 'vitest'
import { Driver } from './Driver'
import { databaseTest } from './databaseTest'

export function selectIdsTest(driver: Driver) {
    databaseTest(driver)(
        'query() never returns duplicating rows when selecting column that ' +
        'has unique constraint',

        async ({ client }) => {
            await client.query(`
                create table ids (
                    id int primary key
                )
            `)

            const idsCount = 10_000
            await populateIds(idsCount)

            const queryRunsCount = 10

            for (let i = 0; i < queryRunsCount; ++i) {
                const result = await client.query('select id from ids')
                expect(result.rows.length).toBe(idsCount)
            }

            async function populateIds(count: number) {
                const promises: Promise<any>[] = []

                for (let i = 0; i < count; ++i) {
                    const p = client.query('insert into ids (id) values ($1)', [i])
                    promises.push(p)
                }

                await Promise.all(promises)
            }
        },

        30_000
    )
}
