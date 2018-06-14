/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 11:43.
 **************************************************/
const path = require('../helpers/path.plus');

module.exports = function (context, next) {
  const options = context.options;
  const {root, wrapper, routes} = options;

  if (!root || !wrapper || !routes) {
    throw new Error('options.root | options.wrapper | options.routes must be an effective path');
  }

  const cwd = options.cwd || process.cwd();
  context.root = path.join(cwd, root);
  const tree = path.recurisveAsTree(context.root);

  context.tree = tree;
  context.options.wrapper = path.join(cwd, wrapper);
  context.options.routes = path.join(cwd, routes);

  next();
};
