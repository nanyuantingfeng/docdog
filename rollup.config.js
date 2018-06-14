import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

const external = ['fs', 'path', 'constants'];

const plugins = [

  resolve({
    modulesOnly: true,
    module: true,
    jsnext: true,
    main: true,
  }),

  commonjs(),
];

export default [
  {
    input: 'src/DocDogPlugin.js',
    output: {
      file: 'lib/DocDogPlugin.js',
      format: 'cjs',       //'amd', 'cjs', 'system', 'esm', 'iife' or 'umd'
      name: 'DocDogPlugin'
    },
    plugins,
    external,
  },
  {
    input: 'src/VirtualModulePlugin.js',
    output: {
      file: 'lib/VirtualModulePlugin.js',
      format: 'cjs',       //'amd', 'cjs', 'system', 'esm', 'iife' or 'umd'
      name: 'VirtualModulePlugin'
    },
    plugins,
    external,
  },
];
