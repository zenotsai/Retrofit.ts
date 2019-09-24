const { rollup } = require('rollup');
const gulp = require('gulp');
const babel = require('gulp-babel');
const path = require('path');
const typescript = require('rollup-plugin-typescript');

const DIST = path.resolve(__dirname, './dist');
const ENTRY = path.resolve(__dirname, './dest');
function getResPath(endWith) {
  return `${ENTRY}/**/*.${endWith}`;
}
gulp.task('build', async () => {
  const bundleJS = await rollup({
    input: 'src/index.ts',
    external: [
      'query-string',
      'axios',
    ],
    plugins: [
      typescript(),
    ],
  });

  await bundleJS.write({
    file: 'dist/index.js',
    format: 'cjs',
    name: 'retrofit',
    globals: {
      axios: 'axios',
      'query-string': 'query-string',
    },
  });
});
