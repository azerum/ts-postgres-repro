import { expect } from 'vitest'
import { databaseTest } from './databaseTest'

databaseTest(
    'query() sometimes returns duplicating rows when selecting column ' + 
    'with unique constraint', 

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
            const result = await client.query<{ id: number }>(
                'select id from ids'
            )
    
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
