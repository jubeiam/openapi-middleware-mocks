import PrunePaths from '../../src/PrunePaths'
import parser from '@apidevtools/swagger-parser'
import { OpenAPIV3 } from 'openapi-types'

let paths

beforeEach(async () => {
    const api = <OpenAPIV3.Document>await parser.dereference('./tests/petstore.yaml')
    paths = api.paths
})

test('PrunePaths remove path', () => {
    const prunedPaths = PrunePaths(paths, ['/pets'])

    expect(prunedPaths['/pets']).toBeFalsy()
    expect(prunedPaths['/pets']).toBeFalsy()
})

test('PrunePaths remove path with method', () => {
    const prunedPaths = PrunePaths(paths, ['GET /pets'])

    expect(prunedPaths['/pets']).toBeTruthy()
    expect(prunedPaths['/pets'].get).toBeFalsy()
})

test('PrunePaths remove path with many methods', () => {
    const prunedPaths = PrunePaths(paths, ['GET POST /pets'])

    expect(prunedPaths['/pets']).toBeTruthy()
    expect(prunedPaths['/pets'].get).toBeFalsy()
    expect(prunedPaths['/pets'].post).toBeFalsy()
})

test('PrunePaths keep path', () => {
    const prunedPaths = PrunePaths(paths, ['/pets'], true)

    expect(prunedPaths['/pets']).toBeTruthy()
    expect(prunedPaths['/pets/{petId}']).toBeFalsy()
})

test('PrunePaths keep path with method', () => {
    const prunedPaths = PrunePaths(paths, ['GET /pets'], true)

    expect(prunedPaths['/pets']).toBeTruthy()
    expect(prunedPaths['/pets'].get).toBeTruthy()
    expect(prunedPaths['/pets'].post).toBeFalsy()
})

test('PrunePaths keep path with many methods', () => {
    const prunedPaths = PrunePaths(paths, ['GET POST /pets'], true)

    expect(prunedPaths['/pets']).toBeTruthy()
    expect(prunedPaths['/pets'].get).toBeTruthy()
    expect(prunedPaths['/pets'].post).toBeTruthy()
    expect(prunedPaths['/pets'].head).toBeFalsy()
})
