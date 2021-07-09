import http from 'http'
import {environment} from './config/index'
import {app} from './app'

const server = http.createServer(app)

server.listen(environment.appPort, () => {
    console.log(`server started listening on port ${environment.appPort}...`)
})