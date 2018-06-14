/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 15:00.
 **************************************************/

module.exports = function (str) {
  const re = /[-\/\.](\w)/g;
  let oo = str.replace(re, (strFull, strWant) => strWant.toUpperCase());
  oo = oo.replace(/\W/g, '');
  return oo.charAt(0).toUpperCase() + oo.slice(1);
};
