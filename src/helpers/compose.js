/**************************************************
 * Created by nanyuantingfeng on 2018/6/14 16:22.
 **************************************************/
function compose(middlewares) {

  if (!Array.isArray(middlewares)) {
    throw new Error('middlewares must be an Array<Function>');
  }

  return function (context, superNext) {
    let index = 0;

    function next() {
      index++;
      if (index < middlewares.length) {
        middlewares[index](context, next);
        return;
      }
      if (superNext) {
        superNext(context);
        return;
      }
    };

    middlewares[0](context, next);
    return context;
  };
};

module.exports = compose;


