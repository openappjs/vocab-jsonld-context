# vocab-jsonld-context

returns a [jsonld](http://json-ld.org) `@context` from a [vocab](https://github.com/openvocab).

built on [schema-jsonld-context](https://github.com/openappjs/schema-jsonld-context).

work in progress, pull requests welcome!

## install

with [npm](http://npmjs.org), do:

```
npm i --save vocab-jsonld-context
```

## example

```
var vocabJsonldContext = require('vocab');

var personVocab = {
  id: "http://example.org/vocabs/Person.json#",
  prefixes: {
    "": "http://vocab.org/",
    "foaf": "http://xmlns.com/foaf/0.1/",
  },
  context: "foaf:Person",
  properties: {
    name: {
      context: "name",
      type: "string",
    },
    nick: {
      context: "foaf:nick",
      type: "string",
    },
  },
};

var personContext = vocabJsonldContext(personVocab);

console.log(JSON.stringify(personContext, null, 2));
// {
//  "@vocab": "http://vocab.org/",
//  "foaf": "http://xmlns.com/foaf/0.1/",
//  "Person": "foaf:Person",
//  "nick": "foaf:nick"
// }
```

## license

AGPLv3
