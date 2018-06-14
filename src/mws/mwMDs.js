/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 12:55.
 **************************************************/
const genName = require('../helpers/gen.name');
const path = require('../helpers/path.plus');
const relativePath = path.relativePath;
const widthFirstVisit = path.widthFirstVisit;

module.exports = function (context, next) {
  const {tree, options, root} = context;
  const map = createRCMDsIndexJS(tree, {...options, root});
  const outputs = [];
  const cacheName = `__index__.js`;

  Object.keys(map).forEach(key => {
    outputs.push({
      name: relativePath(options.cwd, key) + '/' + cacheName,
      contents: map[key],
    });
  });

  context.outputs = outputs;
  context.demoFileName = cacheName;

  next();
};

function createRCMDsIndexJS(tree, options) {
  const oo = {};
  widthFirstVisit(tree, (node) => {
    if (node.type === 'directory' && node.level === 1) {
      oo[node.path] = createIndexJS(node, options);
    }
  });
  return oo;
}

function createIndexJS(node, options) {
  const {name, path, children} = node;
  const array = [];
  const {root} = options;

  widthFirstVisit(node, (n) => {
    if (n.ext === '.md') {
      array.push(relativePath(root, n.path));
    }
  });

  return createFileContent(name, path, array, options);
}

function createFileContent(dirOrgName, dirOrgPath, array, options) {
  const {wrapper} = options;

  const oo = [];
  oo.push(`import React from 'react';`);
  const names = array.map(line => genName(line));
  const relPathArr = array.map(line => relativePath(dirOrgName, line));
  const indexMdIndex = relPathArr.indexOf('index.md');

  names.forEach((line, i) => {
    oo.push(`import ${names[i]} from './${relPathArr[i]}'`);
  });

  const dirName = genName(dirOrgName);
  const contentPath = relativePath(dirOrgPath, wrapper);

  const indexMdName = names[indexMdIndex];
  const examples = names.filter((_, i) => i !== indexMdIndex);

  oo.push(`import Content from '${contentPath}'`);

  const nn = `export default class ${dirName} extends React.Component {
    render() {
      return (
      <Content 
        header={${indexMdName}}  
        examples={[
        ${examples.join(',\n')}
      ]}/>
      )
    }
  }`;

  oo.push(nn);

  oo.push(`${dirName}.label = ${indexMdName}.label;`);

  return oo.join('\n');
}
