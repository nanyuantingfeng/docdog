/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 11:46.
 **************************************************/

const fs = require('fs');
const runner = require('../src/helpers/runner');

function test(options) {
  const context = runner({options});

  context.outputs.forEach(line => {
    fs.writeFileSync(line.name, line.contents);
  });

  fs.writeFileSync(context.routes.name, context.routes.contents);
}

test({
  cwd: __dirname,
  root: '../example',
  wrapper: '../example/C.js',
  routes: '../example/routes.js'
});





