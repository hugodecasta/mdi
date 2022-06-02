import express from 'express'
import cors from 'cors'
import api from './api.js'
import fs from 'fs'

export default async function (PORT) {

    const app = express()

    app.use(cors())

    const api_data = await api()
    app.use('/api/', api_data)

    const dist_dir = './dist'
    if (fs.existsSync(dist_dir)) {
        app.use(express.static(dist_dir))
        app.use((req, res) => res.sendFile(dist_dir + '/index.html'))
    }

    app.on('close', () => console.log('MDI server closed'))
    app.listen(PORT)
    console.log('MDI on', PORT)

    return app
}