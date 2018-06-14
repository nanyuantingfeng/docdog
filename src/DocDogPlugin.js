/**************************************************
 * Created by nanyuantingfeng on 2018/6/1 18:15.
 **************************************************/
const VirtualModulePlugin = require('./VirtualModulePlugin');
const compose = require('./helpers/compose');
const runner = require('./helpers/runner');

const pluginName = 'DocDogPlugin';

module.exports = class DocDogPlugin {

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const context = runner({options: this.options});
    const {outputs, routes} = context;
    const filesArray = [...outputs, routes];
    new VirtualModulePlugin(filesArray).apply(compiler);
  }
};

