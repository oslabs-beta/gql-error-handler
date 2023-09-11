// errorParser.ts
// identify type of error, error manipulation (classification) {input will be error message, output will be array of unvalidated fields}

const errLib = require('./errLibrary');

// error for fields that don't exist in schema ("code": "GRAPHQL_VALIDATION_FAILED")
const string1 = 'Cannot query field "woobae" on type "Character".';

// error
const string2 =
  'Field "post" argument "description" of type "String!" is required, but it was not provided.';

// error "INTERNAL_SERVER_ERROR"
const string3 = 'WHERE parameter "characterId" has invalid "undefined" value';

function errorParser(error: string): string {
  const strArr = error.split(' ');

  const notFields = [];

  for (let i = 0; i < strArr.length; i++) {
    if (strArr[i][0] !== '"') {
      notFields.push(strArr[i]);
    }
  }

  return notFields.join(' ');
}

// console.log(errorParser(string1));
// console.log(errorParser(string2));
// console.log(errorParser(string3));

//invoke methods corresponding to incoming error message
//methods take in error message as argument
console.log(errLib[errorParser(string1)](string1));
console.log(errLib[errorParser(string2)](string2));
console.log(errLib[errorParser(string3)](string3));
