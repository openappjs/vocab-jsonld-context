var test = require('tape');

var vocabJsonldContext;

test("require module", function (t) {
  vocabJsonldContext = require('../');
  t.ok(vocabJsonldContext);
  t.end();
});

test("empty vocab", function (t) {
  t.deepEqual(vocabJsonldContext({}), {}, "context of empty vocab is correct");
  t.end();
});

test("simple vocabs", function (t) {
  t.deepEqual(vocabJsonldContext({
    id: "http://example.org/Person#",
    prefixes: {
      "": "http://open.vocab/",
    },
    context: "Person",
  }), {
    "@vocab": "http://open.vocab/",
  }, "context of person vocab is correct");
  t.deepEqual(vocabJsonldContext({
    id: "http://example.org/Person#",
    prefixes: {
      vocab: "http://open.vocab/",
    },
    context: "vocab:Person",
  }), {
    vocab: "http://open.vocab/",
    Person: "vocab:Person",
  }, "context of person vocab is correct");
  t.end();
});

test("vocabs with properties", function (t) {
  t.deepEqual(vocabJsonldContext({
    id: "http://example.org/Person#",
    prefixes: {
      vocab: "http://open.vocab/",
    },
    context: "vocab:Person",
    properties: {
      name: {
        context: "vocab:name",
        type: "string",
      },
      bio: {
        context: "vocab:description",
        type: "string",
      },
    },
  }), {
    vocab: "http://open.vocab/",
    Person: "vocab:Person",
    name: "vocab:name",
    bio: "vocab:description",
  }, "context of person vocab with properties is correct");
  t.end();
});

test("allOf/anyOf/oneOf vocabs", function (t) {
  t.deepEqual(vocabJsonldContext({
    id: "http://example.org/Agent#",
    prefixes: {
      vocab: "http://open.vocab/",
    },
    context: "vocab:Agent",
    oneOf: [{
      id: "http://example.org/Person#",
      prefixes: {
        vocab: "http://open.vocab/",
      },
      context: "vocab:Person",
    }, {
      id: "http://example.org/Group#",
      prefixes: {
        org: "http://org.vocab/",
      },
      context: "org:Organization",
    }],
  }), {
    vocab: "http://open.vocab/",
    org: "http://org.vocab/",
    Agent: "vocab:Agent",
    Person: "vocab:Person",
    Group: "org:Organization",
  }, "context of agent vocab is correct");
  t.end();
});

test("allOf/anyOf/oneOf with properties vocabs", function (t) {
  t.deepEqual(vocabJsonldContext({
    id: "http://example.org/Agent#",
    prefixes: {
      vocab: "http://open.vocab/",
    },
    context: "vocab:Agent",
    oneOf: [{
      id: "http://example.org/Person#",
      prefixes: {
        vocab: "http://open.vocab/",
      },
      context: "vocab:Person",
      properties: {
        name: {
          context: "vocab:name",
        },
        bio: {
          context: "vocab:description",
        },
      },
    }, {
      id: "http://example.org/Group#",
      prefixes: {
        org: "http://org.vocab/",
      },
      context: "org:Organization",
      properties: {
        name: {
          context: "vocab:name",
        },
        description: {
          context: "vocab:description",
        },
      },
    }],
  }), {
    vocab: "http://open.vocab/",
    org: "http://org.vocab/",
    Agent: "vocab:Agent",
    Person: "vocab:Person",
    Group: "org:Organization",
    name: "vocab:name",
    bio: "vocab:description",
    description: "vocab:description",
  }, "context of agent vocab is correct");
  t.end();
});

test("allOf/anyOf/oneOf with dependencies", function (t) {
  t.deepEqual(vocabJsonldContext({
    id: "http://example.org/Agent#",
    prefixes: {
      vocab: "http://open.vocab/",
    },
    context: "vocab:Agent",
    oneOf: [{
      $ref: "Person",
    }, {
      $ref: "Group",
    }],
    dependencies: {
      Person: {
        id: "http://example.org/Person#",
        prefixes: {
          vocab: "http://open.vocab/",
        },
        context: "vocab:Person",
        properties: {
          name: {
            context: "vocab:name",
          },
          bio: {
            context: "vocab:description",
          },
        },
      },
      Group: {
        id: "http://example.org/Group#",
        prefixes: {
          org: "http://org.vocab/",
        },
        context: "org:Organization",
        properties: {
          name: {
            context: "vocab:name",
          },
          description: {
            context: "vocab:description",
          },
        },
      },
    },
  }), {
    vocab: "http://open.vocab/",
    org: "http://org.vocab/",
    Agent: "vocab:Agent",
    Person: "vocab:Person",
    Group: "org:Organization",
    name: "vocab:name",
    bio: "vocab:description",
    description: "vocab:description",
  }, "context of agent vocab is correct");
  t.end();
});

test("allOf/anyOf/oneOf with circular dependencies", function (t) {
  var Agent = {
    id: "http://example.org/Agent#",
    prefixes: {
      vocab: "http://open.vocab/",
    },
    context: "vocab:Agent",
  };
  Agent.dependencies = {
    Person: {
      id: "http://example.org/Person#",
      prefixes: {
        vocab: "http://open.vocab/",
      },
      context: "vocab:Person",
      allOf: [{
        $ref: "Agent",  
      }, {
        properties: {
          name: {
            context: "vocab:name",
          },
          bio: {
            context: "vocab:description",
          },
        },
      }],
      dependencies: {
        Agent: Agent,
      },
    },
    Group: {
      id: "http://example.org/Group#",
      prefixes: {
        org: "http://org.vocab/",
      },
      context: "org:Organization",
      allOf: [{
        $ref: "Agent",
      }, {
        properties: {
          name: {
            context: "vocab:name",
          },
          description: {
            context: "vocab:description",
          },
        },
      }],
      dependencies: {
        Agent: Agent,
      },
    },
  };
  t.deepEqual(vocabJsonldContext(Agent), {
    vocab: "http://open.vocab/",
    org: "http://org.vocab/",
    Agent: "vocab:Agent",
    Person: "vocab:Person",
    Group: "org:Organization",
    name: "vocab:name",
    bio: "vocab:description",
    description: "vocab:description",
  }, "context of agent vocab is correct");
  t.end();
});
