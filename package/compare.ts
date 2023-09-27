import { ErrorMessage, CacheSchemaObject, queryObject } from './types';

// function takes in cached schema and mapped query object
// to generate object containing invalid fields

function compare(schema: CacheSchemaObject, queryObj: queryObject) {
  const errorObj: ErrorMessage = {};
  function helper(object: any, type: string) {
    for (const key in object) {
      if (schema[type][key]) {
        for (let i = 0; i < object[key].length; i++) {
          if (typeof object[key][i] !== 'object') {
            if (!schema[type][key][object[key][i]]) {
              if (object[key][i][0] !== '_') {
                if (errorObj[key] && !errorObj[key].includes(object[key][i])) {
                  errorObj[key].push(object[key][i]);
                } else {
                  errorObj[key] = [object[key][i]];
                }
              }
            }
          } else {
            // recursively call function if original query is nested
            helper(object[key][i], type);
          }
        }
      }
    }
  }

  helper(queryObj.query, 'query');
  helper(queryObj.mutation, 'mutation');

  return errorObj;
}

module.exports = compare;
