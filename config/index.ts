export const environment = {
    couchbasePath: process.env.COUCHBASE_PATH || 'couchbase://localhost',
    couchbaseBucket: process.env.COUCHBASE_BUCKET || 'test',
    couchbaseUser: process.env.COUCHBASE_USER || 'aekant',
    couchbaseUserPassword: process.env.COUCHBASE_USER_PASSWORD || '123456',
    appPort: process.env.APP_PORT || 3000
}