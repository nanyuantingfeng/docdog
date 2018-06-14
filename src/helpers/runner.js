/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 18:17.
 **************************************************/

const compose = require('./compose');
const mwScan = require('../mws/mwScan');
const mwMDs = require('../mws/mwMDs');
const mwRoutes = require('../mws/mwRoutes');

module.exports = function (context, next) {
  return compose([mwScan, mwMDs, mwRoutes])(context, next);
};
