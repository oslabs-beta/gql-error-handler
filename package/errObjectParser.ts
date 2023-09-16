import { GraphQLResponse, ErrorMessage, TypeFieldsCache } from './types';

// const example = {
//   characters: ['height'],
//   films: ['The Phantom Menace', 'A New Hope'],
// };

function errObjectParser(
  errorObj: ErrorMessage,
  typeFieldsCache: TypeFieldsCache
): string[] {
  const errorMessArr = [];

  // iterate through errorObj, check if key(s) matches key(s) in typeFieldsCache
  for (const prop in errorObj) {
    for (let i = 0; i < errorObj[prop].length; i++) {
      errorMessArr.push(
        `Cannot query field "${errorObj[prop][i]}" on type "${typeFieldsCache[prop]}".`
      );
    }
  }

  return errorMessArr;
}

module.exports = errObjectParser;
