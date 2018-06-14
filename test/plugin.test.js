/**************************************************
 * Created by nanyuantingfeng on 2018/6/1 18:25.
 **************************************************/
const path = require('path');
const hollow = require('hollow-cli');
const build = hollow.build;
const DocDogPlugin = require('../src/DocDogPlugin');

build({

  config: async (context) => {

    context.entry = '../docsite/x.js';

    context.rules.push({
      test: /\.mdx?$/,
      use: [{loader: 'babel-loader'}, {loader: 'markdown-component-loader'}],
    });

    context.plugins.push(new DocDogPlugin({
      root: '../components',
      routes: '../docsite/routes.js',
      wrapper: '../docsite/template/Content.js',
      cwd: __dirname,
    }));
  }
});

