/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 12:21.
 **************************************************/
const fs = require('fs');
const path = require('path');

function recurisveAsTree(pathStr, options) {
  options = options || {level: 0};
  const level = options.level;

  const oo = {
    path: pathStr,
    name: path.basename(pathStr),
    type: 'directory',
    level: level,
  };

  const files = fs.readdirSync(pathStr);

  oo.children = files.map((file) => {
    const level2 = level + 1;
    const subPathStr = path.resolve(pathStr, file);
    const stats = fs.statSync(subPathStr);

    if (stats.isDirectory()) {
      return recurisveAsTree(subPathStr, {level: level2});
    }

    return {
      path: subPathStr,
      name: file,
      ext: path.extname(file),
      type: 'file',
      level: level2,
    };
  });

  return oo;
}

function relativePaths(a, array) {
  return array.map(b => relativePath(a, b));
}

function relativePath(a, b) {
  const aX = path.resolve(a);
  const bX = path.resolve(b);
  return path.relative(aX, bX);
}

function depthFirstVisit(node, fn) {

  if (!node) {
    return;
  }

  fn(node);

  if (!node.children || !node.children.length) {
    return;
  }

  node.children.forEach(item => {
    depthFirstVisit(item, fn);
  });
}

function widthFirstVisit(node, fn) {
  if (!node || !node.children) {
    return;
  }

  let queue = [];
  queue.push(node);

  while (queue.length) {
    let curNode = queue.shift();

    fn(curNode);

    if (curNode.children && curNode.children.length) {
      queue = queue.concat(curNode.children);
    }
  }
}

module.exports = path;
module.exports.recurisveAsTree = recurisveAsTree;
module.exports.relativePath = relativePath;
module.exports.relativePaths = relativePaths;
module.exports.depthFirstVisit = depthFirstVisit;
module.exports.widthFirstVisit = widthFirstVisit;


