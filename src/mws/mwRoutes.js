/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 14:47.
 **************************************************/
const path = require('../helpers/path.plus');
const genName = require('../helpers/gen.name');

module.exports = function (context, next) {
  const {tree, options, root, outputs, demoFileName} = context;

  const opt = {
    ...options,
    root,
    demoFileName,
  };

  const contents = createRoutesIndexJS(outputs, opt);

  context.routes = {
    name: path.relativePath(options.cwd, options.routes),
    contents,
  };

  next();
};

function createRoutesIndexJS(outputs, options) {
  const {routes, demoFileName, cwd} = options;
  const pathArr = outputs.map(line => line.name);
  const pathRelArr = path.relativePaths(path.dirname(routes), pathArr);
  const names = pathRelArr.map(n => genName(n));

  const oo = [];

  names.forEach((name, index) => {
    oo.push(`import ${name} from '${pathRelArr[index]}';`);
  });

  oo.push(`const oo = [];`);

  pathRelArr.forEach((p0, index) => {
    let p1 = p0.replace('/' + demoFileName, '');
    let p2 = p1.slice(p1.lastIndexOf('/'));
    oo.push(`oo.push({
    ref: '/', 
    path: '${p2}',
    component: ${names[index]},
    menuName: ${names[index]}.label,
    })`);
  });

  oo.push(`module.exports = oo;`);

  return oo.join('\n');
}


