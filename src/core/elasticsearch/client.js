import * as dotenv from '@tinyhttp/dotenv';
import { Client } from '@elastic/elasticsearch';
dotenv.config()

const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE;
const ELASTICSEARCH_USER = process.env.ELASTICSEARCH_USER;
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

const client = new Client({
    node: ELASTICSEARCH_NODE,
    auth: {
        username: ELASTICSEARCH_USER,
        password: ELASTICSEARCH_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

export async function search(index, query, value) {
    const result = await client.search({
        index,
        query: {
            match: {
                [query]: '%' + value + '%'
            }
        }
    })
    return result.hits.hits;
}

export async function insert(index, document) {
    await client.index({
        index, document, refresh: true
    })
    return { success: true }
}


export async function bulkinsert(index, document_array) {
    const operations = document_array.flatMap(document => [{ index: { _index: index } }, document])
    await client.bulk({
        index,
        operations
    })
    return { success: true }
}

