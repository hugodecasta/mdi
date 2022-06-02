import express from 'express'
import * as icons_engine from './icons_engine.js'
import body_parser from 'body-parser'

export default async function () {

    const json_parser = body_parser.json()

    await icons_engine.init()

    const api_router = new express.Router()

    api_router.get('/info', (req, res) => {
        res.json({ hello: 'world' })
    })

    api_router.get('/random', (req, res) => {
        res.json(icons_engine.random())
    })

    api_router.post('/search', json_parser, (req, res) => {
        res.json(icons_engine.search(req.body.text))
    })

    return api_router
}
