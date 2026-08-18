import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/appliance-card.ts',
  output: [
    {
      file: 'appliance-card.js',
      format: 'es',
      sourcemap: dev,
    },
    {
      file: 'smartthings-card.js',
      format: 'es',
      sourcemap: dev,
    },
  ],
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        '/-->/g': '/--!?>/g',
      },
    }),
    json(),
    resolve(),
    esbuild({
      target: 'es2022',
      tsconfig: './tsconfig.json',
    }),
    image(),
    !dev && terser({ format: { comments: false } }),
  ].filter(Boolean),
};
