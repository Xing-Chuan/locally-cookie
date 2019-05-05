import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: './src/index.js',
  output: {
    name: 'locally-cookie',
    file: './dist/locally-cookie.min.js',
    format: 'umd',
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
    }),
    uglify(),
  ],
};
