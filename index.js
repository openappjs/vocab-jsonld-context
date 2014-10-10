var traverse = require('traverse');
var extend = require('xtend');
var schemaJsonldContext = require('schema-jsonld-context');

module.exports = function vocabJsonldContext (vocab) {
  var context = {}

  // traverse over each node in vocab
  traverse(vocab).forEach(function () {

    // if root or non-circular dep,
    if (
      this.isRoot || (
        this.path[this.level - 2] === "dependencies" &&
        (!this.circular)
      )
    ) {
      // shallow clone node and remove further deps
      var node = extend(this.node);
      if (node.dependencies) delete node.dependencies;

      // get context of this node
      // TODO handle deps with conflicting prefixes
      var nodeContext = schemaJsonldContext(node);

      // add it to our overall context
      context = extend(context, nodeContext);
    }
  });

  return context;
};
