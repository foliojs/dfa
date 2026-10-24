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
  ]
};
