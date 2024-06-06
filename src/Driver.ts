export interface Driver {
    connect(database: string): Promise<ClientLike>
}

export interface ClientLike {
    query(text: string, values?: unknown[]): Promise<{ rows: unknown[] }>
    end(): Promise<void> 
}
