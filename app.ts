import express from 'express'
import {userRouter} from './users/controller'
import {accountRouter} from './accounts/controller'

export const app = express()

app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/accounts', accountRouter)
