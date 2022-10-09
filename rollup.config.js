import commonjs from '@rollup/plugin-commonjs'
import ts from '@wessberg/rollup-plugin-ts'
import pj from '@rollup/plugin-json'

export default {
    input: './src/index.ts',
    plugins: [commonjs(), pj(), ts()],
}
