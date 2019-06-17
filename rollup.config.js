import babel from 'rollup-plugin-babel';
import localResolve from 'rollup-plugin-local-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {  
  output: {
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    localResolve(),
    commonjs(),
    babel({
      presets: [
        [
          '@babel/preset-env', 
          {
            modules: false,
            targets: {
              node: '8.11',
              browsers: [
                'Firefox 57',
                'Chrome 60',
                'iOS 10',
                'Safari 10'
              ]
            }
          }
        ]
      ]
    })
  ]
};
