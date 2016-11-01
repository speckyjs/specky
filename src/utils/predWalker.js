var fnName = require('./fnName');
var Problem = require('../models/Problem');

function predWalker(spec, walkFn) {
  return function predWalk(x, opts) {
    var conform = { opts };
    if (conform) {
      var predFn = spec.exprs[0];
      if (predFn(x)) {
        return x;
      } else {
        return new Problem(x, spec, [], 'Predicate ' + fnName(predFn) + ' returns false on value ' + JSON.stringify(x));
      }
    } else {
      throw 'no impl';
    }
  }
}

module.exports = predWalker;