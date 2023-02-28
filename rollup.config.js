import path from 'path';
import babel from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import ts from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import copy from 'rollup-plugin-copy';
import image from '@rollup/plugin-image';
import alias from '@rollup/plugin-alias';
import svg from 'rollup-plugin-svg';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json';

process.env.NODE_ENV = 'production';

const getPath = (_path) => path.resolve(__dirname, _path);
const isDev = process.env.ROLLUP_WATCH || false;

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const externalDependencies = ['react', '@web3mq/client','@web3mq/dapp-connect','@web3mq/dapp-connect-react', '@walletconnect/sign-client', '@web3modal/standalone', 'react-dom', '@babel/runtime/helpers/extends'];

const baseConfig = {
  input: getPath('./src/index.ts'),
};

const basePlugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  external(),
  copy({
    targets: [{ src: 'src/assets/*', dest: 'dist/assets' }],
    watch: process.env.ROLLUP_WATCH,
  }),
  alias({
    entries: [
      {
        find: '@',
        replacement: getPath('src'),
        customResolver: resolve({
          extensions: ['.js', '.jsx', 'tsx'],
        }),
      },
    ],
  }),
  postcss({
    extract: 'css/index.css',
    modules: true,
    minimize: !isDev,
    use: ['sass'],
    extensions: ['.css', '.scss'],
  }),
  svg(),
  image(),
  ts({
    tsconfig: getPath('./tsconfig.json'),
    extensions,
  }),
  babel({
    presets: ['@babel/preset-env', '@babel/preset-react'],
    babelHelpers: 'runtime',
    plugins: ['@babel/plugin-transform-runtime'],
    exclude: 'node_modules/**',
    extensions,
  }),
  resolve({ browser: true }, extensions),
  commonjs(),
  isDev ? null : terser(),
];

const config = {
  ...baseConfig,
  external: externalDependencies,
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: isDev,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@web3mq/client': 'Web3MQ',
        '@web3mq/dapp-connect': 'DappConnect',
        '@web3mq/dapp-connect-react': 'DappConnectReact',
      },
    },
  ],
  plugins: [...basePlugins],
};

export default config;
