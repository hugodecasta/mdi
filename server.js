import express from 'express'
import cors from 'cors'
import api from './api.js'
import fs from 'fs'
import * as url from 'url'
import * as icons_engine from './icons_engine.js'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export default async function (PORT) {

    const app = express()

    app.use(cors())

    const api_data = api()
    app.use('/api/', api_data)

    const waiting_dir = __dirname + '/waiting'
    const dist_dir = __dirname + '/dist'
    let funcs = { static: (req, res, next) => express.static(waiting_dir)(req, res, next) }
    icons_engine.listen_to_load(() => funcs.static = (req, res, next) => express.static(dist_dir)(req, res, next))
    app.use((req, res, next) => funcs.static(req, res, next))

    app.on('close', () => console.log('MDI server closed'))
    app.listen(PORT)
    console.log('MDI on', PORT)

    return app
}