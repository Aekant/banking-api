import couchbase, {Cluster, Bucket} from 'couchbase'
import {environment} from './../config/index'

const cluster: Cluster = new couchbase.Cluster(environment.couchbasePath)
cluster.authenticate(environment.couchbaseUser, environment.couchbaseUserPassword)

export const bucket = cluster.openBucket(environment.couchbaseBucket, function(err: any) {
    if(err)
        return process.kill(process.pid)
    
    console.log('connection to bucket is successful')
})
