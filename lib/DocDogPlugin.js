'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var constants = _interopDefault(require('constants'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));

/**************************************************
 * Created by nanyuantingfeng on 2018/6/4 17:56.
 **************************************************/

/**
 * Used to cache a stats object for the virtual file.
 * Extracted from the `mock-fs` package.
 *
 * @author Tim Schaub http://tschaub.net/
 * @link https://github.com/tschaub/mock-fs/blob/master/lib/binding.js
 * @link https://github.com/tschaub/mock-fs/blob/master/license.md
 */


var VirtualStats_1 = class VirtualStats {
  /**
   * Create a new stats object.
   * @param {Object} config Stats properties.
   * @constructor
   */
  constructor(config) {
    for (const key in config) {
      if (!config.hasOwnProperty(key)) {
        continue;
      }
      this[key] = config[key];
    }
  }

  /**
   * Check if mode indicates property.
   * @param {number} property Property to check.
   * @return {boolean} Property matches mode.
   */
  _checkModeProperty(property) {
    return ((this.mode & constants.S_IFMT) === property);
  }

  /**
   * @return {Boolean} Is a directory.
   */
  isDirectory() {
    return this._checkModeProperty(constants.S_IFDIR);
  }

  /**
   * @return {Boolean} Is a regular file.
   */
  isFile() {
    return this._checkModeProperty(constants.S_IFREG);
  }

  /**
   * @return {Boolean} Is a block device.
   */
  isBlockDevice() {
    return this._checkModeProperty(constants.S_IFBLK);
  }

  /**
   * @return {Boolean} Is a character device.
   */
  isCharacterDevice() {
    return this._checkModeProperty(constants.S_IFCHR);
  }

  /**
   * @return {Boolean} Is a symbolic link.
   */
  isSymbolicLink() {
    return this._checkModeProperty(constants.S_IFLNK);
  }

  /**
   * @return {Boolean} Is a named pipe.
   */
  isFIFO() {
    return this._checkModeProperty(constants.S_IFIFO);
  }

  /**
   * @return {Boolean} Is a socket.
   */
  isSocket() {
    return this._checkModeProperty(constants.S_IFSOCK);
  }
};

/**************************************************
 * Created by nanyuantingfeng on 2018/6/4 17:51.
 **************************************************/



const pluginName = 'VirtualModulePlugin';

var VirtualModulePlugin_1 = class VirtualModulePlugin {

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    if (Array.isArray(this.options)) {
      this.options.forEach(options => this.applyOne(compiler, options));
      return;
    }
    this.applyOne(compiler, this.options);
  }

  applyOne(compiler, options) {
    const moduleName = options.name;
    const ctime = VirtualModulePlugin.statsDate();
    let modulePath = options.path;

    const contents = Promise.resolve(options.contents);

    function resolvered(request, cb) {
      // populate the file system cache with the virtual module
      const fs$$1 = (this && this.fileSystem) || compiler.inputFileSystem;
      const join = (this && this.join) || path.join;

      if (!modulePath) {
        modulePath = join(compiler.context, moduleName);
      }

      const resolve = (data) => {
        VirtualModulePlugin.populateFilesystem({
          fs: fs$$1,
          modulePath,
          contents: data,
          ctime
        });
      };

      const resolved = contents.then(resolve);

      if (!cb) {
        return;
      }

      resolved.then(() => cb());
    }

    compiler.hooks.afterResolvers.tap(pluginName, (compiler) => {
      compiler.hooks.normalModuleFactory.tap(pluginName, (nmf) => {
        nmf.hooks.beforeResolve.tap(pluginName, resolvered);
      });
    });
  }

  static populateFilesystem(options) {
    const fs$$1 = options.fs;
    const modulePath = options.modulePath;
    const contents = options.contents;
    const mapIsAvailable = typeof Map !== 'undefined';
    const statStorageIsMap = mapIsAvailable && fs$$1._statStorage.data instanceof Map;
    const readFileStorageIsMap = mapIsAvailable && fs$$1._readFileStorage.data instanceof Map;

    if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      if (fs$$1._readFileStorage.data.has(modulePath)) {
        return;
      }
    } else if (fs$$1._readFileStorage.data[modulePath]) { // enhanced-resolve@3.3.0 or lower
      return;
    }
    const stats = VirtualModulePlugin.createStats(options);
    if (statStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      fs$$1._statStorage.data.set(modulePath, [null, stats]);
    } else { // enhanced-resolve@3.3.0 or lower
      fs$$1._statStorage.data[modulePath] = [null, stats];
    }
    if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      fs$$1._readFileStorage.data.set(modulePath, [null, contents]);
    } else { // enhanced-resolve@3.3.0 or lower
      fs$$1._readFileStorage.data[modulePath] = [null, contents];
    }
  }

  static statsDate(inputDate) {
    if (!inputDate) {
      inputDate = new Date();
    }
    return inputDate.toString();
  }

  static createStats(options) {
    if (!options) {
      options = {};
    }
    if (!options.ctime) {
      options.ctime = VirtualModulePlugin.statsDate();
    }
    if (!options.mtime) {
      options.mtime = VirtualModulePlugin.statsDate();
    }
    if (!options.size) {
      options.size = 0;
    }
    if (!options.size && options.contents) {
      options.size = options.contents.length;
    }
    return new VirtualStats_1({
      dev: 8675309,
      nlink: 1,
      uid: 501,
      gid: 20,
      rdev: 0,
      blksize: 4096,
      ino: 44700000,
      mode: 33188,
      size: options.size,
      atime: options.mtime,
      mtime: options.mtime,
      ctime: options.ctime,
      birthtime: options.ctime,
    });
  }
};

/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 16:22.
 **************************************************/

/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 12:21.
 **************************************************/



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

var path_plus = path;
var recurisveAsTree_1 = recurisveAsTree;
var relativePath_1 = relativePath;
var relativePaths_1 = relativePaths;
var depthFirstVisit_1 = depthFirstVisit;
var widthFirstVisit_1 = widthFirstVisit;
path_plus.recurisveAsTree = recurisveAsTree_1;
path_plus.relativePath = relativePath_1;
path_plus.relativePaths = relativePaths_1;
path_plus.depthFirstVisit = depthFirstVisit_1;
path_plus.widthFirstVisit = widthFirstVisit_1;

/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 11:43.
 **************************************************/


var mwScan = function (context, next) {
  const options = context.options;
  const {root, wrapper, routes} = options;

  if (!root || !wrapper || !routes) {
    throw new Error('options.root | options.wrapper | options.routes must be an effective path');
  }

  const cwd = options.cwd || process.cwd();
  context.root = path_plus.join(cwd, root);
  const tree = path_plus.recurisveAsTree(context.root);

  context.tree = tree;
  context.options.wrapper = path_plus.join(cwd, wrapper);
  context.options.routes = path_plus.join(cwd, routes);

  next();
};

/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 15:00.
 **************************************************/

var gen_name = function (str) {
  const re = /[-\/\.](\w)/g;
  let oo = str.replace(re, (strFull, strWant) => strWant.toUpperCase());
  oo = oo.replace(/\W/g, '');
  return oo.charAt(0).toUpperCase() + oo.slice(1);
};

/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 12:55.
 **************************************************/


const relativePath$1 = path_plus.relativePath;
const widthFirstVisit$1 = path_plus.widthFirstVisit;

var mwMDs = function (context, next) {
  const {tree, options, root} = context;
  const map = createRCMDsIndexJS(tree, {...options, root});
  const outputs = [];
  const cacheName = `__index__.js`;

  Object.keys(map).forEach(key => {
    outputs.push({
      name: relativePath$1(options.cwd, key) + '/' + cacheName,
      contents: map[key],
    });
  });

  context.outputs = outputs;
  context.demoFileName = cacheName;

  next();
};

function createRCMDsIndexJS(tree, options) {
  const oo = {};
  widthFirstVisit$1(tree, (node) => {
    if (node.type === 'directory' && node.level === 1) {
      oo[node.path] = createIndexJS(node, options);
    }
  });
  return oo;
}

function createIndexJS(node, options) {
  const {name, path: path$$1, children} = node;
  const array = [];
  const {root} = options;

  widthFirstVisit$1(node, (n) => {
    if (n.ext === '.md') {
      array.push(relativePath$1(root, n.path));
    }
  });

  return createFileContent(name, path$$1, array, options);
}

function createFileContent(dirOrgName, dirOrgPath, array, options) {
  const {wrapper} = options;

  const oo = [];
  oo.push(`import React from 'react';`);
  const names = array.map(line => gen_name(line));
  const relPathArr = array.map(line => relativePath$1(dirOrgName, line));
  const indexMdIndex = relPathArr.indexOf('index.md');

  names.forEach((line, i) => {
    oo.push(`import ${names[i]} from './${relPathArr[i]}'`);
  });

  const dirName = gen_name(dirOrgName);
  const contentPath = relativePath$1(dirOrgPath, wrapper);

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

/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 14:47.
 **************************************************/



var mwRoutes = function (context, next) {
  const {tree, options, root, outputs, demoFileName} = context;

  const opt = {
    ...options,
    root,
    demoFileName,
  };

  const contents = createRoutesIndexJS(outputs, opt);

  context.routes = {
    name: path_plus.relativePath(options.cwd, options.routes),
    contents,
  };

  next();
};

function createRoutesIndexJS(outputs, options) {
  const {routes, demoFileName, cwd} = options;
  const pathArr = outputs.map(line => line.name);
  const pathRelArr = path_plus.relativePaths(path_plus.dirname(routes), pathArr);
  const names = pathRelArr.map(n => gen_name(n));

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

/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 18:17.
 **************************************************/





var runner = function (context, next) {
  return compose([mwScan, mwMDs, mwRoutes])(context, next);
};

var DocDogPlugin_1 = class DocDogPlugin {

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const context = runner({options: this.options});
    const {outputs, routes} = context;
    const filesArray = [...outputs, routes];
    new VirtualModulePlugin_1(filesArray).apply(compiler);
  }
};

module.exports = DocDogPlugin_1;
