import path from 'path'
import request from 'supertest'
import { invoke } from './invoke.util'
import { prepareServer } from './server.utils'

const api = path.join(__dirname, '../', 'petstore.yaml')

describe('Pets mock server', () => {
    let app
    beforeAll(() => {
        return prepareServer({
            openApiFile: api,
            format404() {
                return {
                    message: 'not found',
                }
            },
        }).then((server) => {
            app = server

            app.listen(function (err) {
                if (err) {
                    return process.exit(1)
                }
            })
        })
    })

    test('Get pets list', () => {
        return request(app)
            .get('/pets')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (response) {
                expect(Array.isArray(response.body)).toBeTruthy()
            })
    })

    test('Get pets list with headers', () => {
        return request(app)
            .get('/pets')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (response) {
                expect(response.headers['x-next']).toBeTruthy()
                expect(response.headers['x-total-pets'] * 1).toBeGreaterThanOrEqual(1000)
                expect(response.headers['x-total-pets'] * 1).toBeLessThanOrEqual(1002)
            })
    })

    test('Get Pet by id', () => {
        return request(app)
            .get('/pets/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (response) {
                expect(response.body.id).toBeDefined()
                expect(response.body.name).toBeDefined()
                expect(response.body.tag).toBeDefined()
            })
    })

    test('Get invalid route', () => {
        return request(app)
            .get('/pet')
            .expect('Content-Type', /json/)
            .expect(404)
            .expect(function (response) {
                expect(response.body.message).toBeDefined()
                expect(response.body.message).toEqual('not found')
            })
    })

    test('Add new Pet - bad request', () => {
        return request(app)
            .post('/pets')
            .send({ id: 'john' })
            .expect('Content-Type', /json/)
            .expect(400)
    })

    test('Add new Pet - with valid data', () => {
        return request(app)
            .post('/pets')
            .send({ id: 1, name: 'bar' })
            .expect('Content-Type', /json/)
            .expect(201)
    })

    test('Get random pet', () => {
        return request(app)
            .get('/random-pet')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (response) {
                expect(response.body.id).toBeDefined()
                expect(response.body.name).toBeDefined()
                expect(response.body.tag).toBeDefined()
            })
    })
    test('Force mock valid property', () => {
        return request(app)
            .get('/pets/1')
            .set('X-Force-Mock', '{"name": "Burek"}')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (response) {
                expect(response.body.id).toBeDefined()
                expect(response.body.name).toEqual('Burek')
                expect(response.body.tag).toBeDefined()
            })
    })
    test('Force mock invalid property', () => {
        return request(app)
            .get('/pets/1')
            .set('X-Force-Mock', '{"name1": "Burek"}')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (response) {
                expect(response.body.id).toBeDefined()
                expect(response.body.name).toBeDefined()
                expect(response.body.name1).toBeDefined()
                expect(response.body.tag).toBeDefined()
            })
    })
    test('Force mock malformed', () => {
        return request(app)
            .get('/pets/1')
            .set('X-Force-Mock', 'name1": "Burek"}')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (response) {
                expect(response.body.id).toBeDefined()
                expect(response.body.name).toBeDefined()
                expect(response.body.tag).toBeDefined()
            })
    })
})
