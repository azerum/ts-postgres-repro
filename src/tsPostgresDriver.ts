import { connect } from 'ts-postgres'
import { Driver } from './Driver'

export const tsPostgresDriver: Driver = {
    connect(database) {
        return connect({ database })
    },
}
