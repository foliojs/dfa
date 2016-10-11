import babel from 'rollup-plugin-babel';
import localResolve from 'rollup-plugin-local-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  format: 'cjs',
  plugins: [
    localResolve(),
    commonjs(),
    babel({
      babelrc: false,
      presets: [['es2015', { modules: false }]],
      plugins: ['transform-runtime'],
      runtimeHelpers: true
    })
  ]
};
