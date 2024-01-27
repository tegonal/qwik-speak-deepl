import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import json from "@rollup/plugin-json";

export default {
  input: ['src/bin/qwik-speak-deepl.ts', 'src/index.ts'],
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    json(),
    typescript(),
    nodeResolve({preferBuiltins: true, browser: false}),
    commonjs(),
    terser(),
  ],
};
