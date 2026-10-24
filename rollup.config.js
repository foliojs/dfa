import localResolve from 'rollup-plugin-local-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {  
  output: {
    format: 'es',
    sourcemap: true
  },
  plugins: [
    localResolve(),
    commonjs(),    
  ]
};
