import {
  parse,
  DocumentNode,
  visit,
  FieldNode,
  SelectionSetNode,
  OperationDefinitionNode,
} from 'graphql';
import { ErrorMessage, SchemaObj, queryObject } from './types';

// Sample GraphQL query
const sampleQuery = `query Root {
    allPlanets {
      name
      planets {
        name
        id
        filmConnection {
          films {
            title
          }
        }
      }
    }
  }`;

const sampleQuery2 = `query {
    character {
      name
      test
      films {
        title
      }
    }
    films {
      title
    }
  }

  mutation {
    createCharacter {
      name
      height
      gender
    }
  }
  `;

/*Sample Schema: 
cacheSchema: {
[1]   query: {
[1]     characters: {
[1]       id: 'ID',
[1]       name: 'String',
[1]       height: 'Int',
[1]       gender: 'String',
[1]       birthYear: 'String',
[1]       eyeColor: 'String',
[1]       skinColor: 'String',
[1]       hairColor: 'String',
[1]       mass: 'String',
[1]       films: '[Film]'
[1]     },
[1]     films: {
[1]       id: 'ID',
[1]       title: 'String',
[1]       director: 'String',
[1]       releaseDate: 'String',
[1]       characters: '[Character]'
[1]     }
[1]   },
[1]   mutation: {
[1]     createCharacter: {
[1]       id: 'ID',
[1]       name: 'String',
[1]       height: 'Int',
[1]       gender: 'String',
[1]       birthYear: 'String',
[1]       eyeColor: 'String',
[1]       skinColor: 'String',
[1]       hairColor: 'String',
[1]       mass: 'String',
[1]       films: '[Film]'
[1]     }
[1]   }
[1] }
*/

function compare(schema: SchemaObj, queryObj: queryObject) {
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
            // this is the case if an object exists in the array
            console.log(object[key[i]]);
            helper(object[key][i], type);
          }
        }
      }
    }
  }

  helper(queryObj.query, 'query');
  helper(queryObj.mutation, 'mutation');

  // for (const key in errorObj) {
  //   const newSet = new Set([...errorObj[key]]);
  //   errorObj[key] = Array.from(newSet);
  // }
  return errorObj;
}

module.exports = compare;
const schema = {
  query: {
    characters: {
      id: 'ID',
      name: 'String',
      height: 'String',
      gender: 'String',
      birthYear: 'String',
      eyeColor: 'String',
      skinColor: 'String',
      hairColor: 'String',
      mass: 'Float',
      films: {
        id: 'ID',
        title: 'String',
        director: 'String',
        releaseDate: 'String',
        characters: '[Object]',
      },
    },
    character: {
      id: 'ID',
      name: 'String',
      height: 'String',
      gender: 'String',
      birthYear: 'String',
      eyeColor: 'String',
      skinColor: 'String',
      hairColor: 'String',
      mass: 'Float',
      films: {
        id: 'ID',
        title: 'String',
        director: 'String',
        releaseDate: 'String',
        characters: '[Object]',
      },
    },
    films: {
      id: 'ID',
      title: 'String',
      director: 'String',
      releaseDate: 'String',
      characters: {
        id: 'ID',
        name: 'String',
        height: 'String',
        gender: 'String',
        birthYear: 'String',
        eyeColor: 'String',
        skinColor: 'String',
        hairColor: 'String',
        mass: 'Float',
        films: {
          id: 'ID',
          title: 'String',
          director: 'String',
          releaseDate: 'String',
          characters: '[Object]',
        },
      },
    },
    film: {
      id: 'ID',
      title: 'String',
      director: 'String',
      releaseDate: 'String',
      characters: {
        id: 'ID',
        name: 'String',
        height: 'String',
        gender: 'String',
        birthYear: 'String',
        eyeColor: 'String',
        skinColor: 'String',
        hairColor: 'String',
        mass: 'Float',
        films: {
          id: 'ID',
          title: 'String',
          director: 'String',
          releaseDate: 'String',
          characters: '[Object]',
        },
      },
    },
  },
  mutation: {},
};
const resultQueryMapper = {
  query: {
    characters: [
      'jeremy',
      'name',
      'height',
      'gender',
      'birthYear',
      'eyeColor',
      'skinColor',
      'hairColor',
      'mass',
      '__typename',
    ],
  },
};
// compare(schema, resultQueryMapper);
// console.log(compare(schema, resultQueryMapper));
//{characters:[jeremy]}
