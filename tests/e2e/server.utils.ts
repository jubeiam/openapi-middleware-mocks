import express from 'express'
import main, { Config } from '../../src/index'
import bodyParser from 'body-parser'

export const prepareServer = async (cfg: Config) => {
    const app = express()

    const middleware = await main(cfg)
    app.use(bodyParser.json())
    app.use(middleware)

    return app
}
