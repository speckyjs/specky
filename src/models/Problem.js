function Problem(val, failsPredicate, msg) {
  this.val = val;
  this.name = 'Problem';
  this.failsPredicate = failsPredicate;
  this.problemMessage = msg;
  this.stack = (new Error()).stack;
  this.message = msg;
};

Problem.prototype = new Error;

module.exports = Problem;
