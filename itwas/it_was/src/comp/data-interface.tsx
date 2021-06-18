export interface DataInterface {
    [item: string]: string[] | DataInterface
}

export interface RequestOptions {
    method: 'POST' | 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: string
};