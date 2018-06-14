'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var constants = _interopDefault(require('constants'));
var path = _interopDefault(require('path'));

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
      const fs = (this && this.fileSystem) || compiler.inputFileSystem;
      const join = (this && this.join) || path.join;

      if (!modulePath) {
        modulePath = join(compiler.context, moduleName);
      }

      const resolve = (data) => {
        VirtualModulePlugin.populateFilesystem({
          fs,
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
    const fs = options.fs;
    const modulePath = options.modulePath;
    const contents = options.contents;
    const mapIsAvailable = typeof Map !== 'undefined';
    const statStorageIsMap = mapIsAvailable && fs._statStorage.data instanceof Map;
    const readFileStorageIsMap = mapIsAvailable && fs._readFileStorage.data instanceof Map;

    if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      if (fs._readFileStorage.data.has(modulePath)) {
        return;
      }
    } else if (fs._readFileStorage.data[modulePath]) { // enhanced-resolve@3.3.0 or lower
      return;
    }
    const stats = VirtualModulePlugin.createStats(options);
    if (statStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      fs._statStorage.data.set(modulePath, [null, stats]);
    } else { // enhanced-resolve@3.3.0 or lower
      fs._statStorage.data[modulePath] = [null, stats];
    }
    if (readFileStorageIsMap) { // enhanced-resolve@3.4.0 or greater
      fs._readFileStorage.data.set(modulePath, [null, contents]);
    } else { // enhanced-resolve@3.3.0 or lower
      fs._readFileStorage.data[modulePath] = [null, contents];
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

module.exports = VirtualModulePlugin_1;
