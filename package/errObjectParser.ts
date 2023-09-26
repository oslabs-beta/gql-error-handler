import { ErrorMessage, TypeFieldsCacheObject } from './types';

// function takes in object containing invalid fields and object mapping custom types to their corresponding field names
// and generates an array containing custom error message strings to be attached to returned partial data

function errObjectParser(
  errorObj: ErrorMessage,
  typeFieldsCache: TypeFieldsCacheObject
): string[] {
  const errorMessArr = [];

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
