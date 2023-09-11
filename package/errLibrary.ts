// errLibrary.ts
// object on file as library for all error classifications (key will be regular expression of different error message strings, value will be the string manipulation method needed to parse the error message string)
// take error message from error, compare within classification object
// parse error message with string manip. method to extract faulty field labels

// process string value of message property with regrular expression to return value matching property in library object
// matching property in library: "Cannot query field on type."

// we have the error message string value and

function fieldDoesntExist(error: string): string[] {
  const strArr: string[] = error.split(' ');

  const fields: string[] = [];
  for (let i = 0; i < strArr.length; i++) {
    if (strArr[i][0] === '"') {
      const regex = /[A-Za-z]+/;
      const procEl = strArr[i].match(regex);
      if (procEl) fields.push(procEl[0]);
    }
  }

  return [fields[1], fields[0]];
}

const errLibrary = {
  'Cannot query field on type': fieldDoesntExist,
  // fieldDoesntExist in this case returns a 2-item array
  // first item is the name of the field that doesn't exist
  // second item is the name of the type in the schema

  'Field argument of type is required, but it was not provided.':
    fieldDoesntExist,

  'WHERE parameter has invalid value': fieldDoesntExist,
};

module.exports = errLibrary;
// module.exports = {
//   /Cannot query field|on type/g: () => { // parse through "Cannot query field \"woobae\" on type \"Character\"." to get woobae}
//   }
//   "Cannot query field on type": () => {blah blah blah};
// }
