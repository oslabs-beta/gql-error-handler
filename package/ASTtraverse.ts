import {
  parse,
  DocumentNode,
  visit,
  FieldNode,
  SelectionSetNode,
  OperationDefinitionNode,
} from 'graphql';
import { ErrorMessage, SchemaObj } from './types';
// const { gql } = require('apollo-server');
// const { ApolloServer } = require('apollo-server');
// const typeDefs = gql`
//   type Character {
//     id: ID
//     name: String
//     height: Int
//     gender: String
//     birthYear: String
//     eyeColor: String
//     skinColor: String
//     hairColor: String
//     mass: String
//     films: [Film]
//   }

//   type Film {
//     id: ID
//     title: String
//     director: String
//     releaseDate: String
//     characters: [Character]
//   }

//   type Query {
//     characters(id: ID): [Character]
//     films: [Film]
//   }

//   type Mutation {
//     createCharacter(
//       name: String
//       height: Int
//       gender: String
//       birthYear: String
//       eyeColor: String
//       skinColor: String
//       hairColor: String
//       mass: String
//     ): Character
//   }
// `;

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

/*sample queryObj

{ 
  query: { 
  'characters': ['name', 'test', { 'films': ['title'] } ], 
  'films': ['title'],
  },
  mutation: { 
    'createCharacter': ['name', 'height', 'gender' ] 
  } 
}
  */

// exact expected:
// output: {character: [test]}

function compare(schema: SchemaObj, queryObj: ErrorMessage) {
  const errorObj: ErrorMessage = {};

  function helper(object: any, type: string) {
    for (const key in object) {
      if (schema[type][key]) {
        for (let i = 0; i < object[key].length; i++) {
          if (typeof object[key][i] !== 'object') {
            if (!schema[type][key][object[key][i]]) {
              if (object[key][i][0] !== '_') {
                if (errorObj[key]) {
                  errorObj[key].push(object[key][i]);
                } else {
                  errorObj[key] = [object[key][i]];
                }
              }
            }
          } else {
            // this is the case if an object exists in the array
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


// errorObj (to be returned from compare):

// const errorObj = {
//   characters: ['height'],
//   films: ['The Phantom Menace', 'A New Hope'],
// }; 

// Previous compare() code:

  // for (let keys in queryObj) {

    //     if (schema[keys]) {
    //       //identify types of the schema, 1st object keys, then count schema object keys
    //       // after 1+ count, we have the 2nd type word in the queryObj array, compare it with schema type
    //       // compare the field after schema type
    
    //       //recursion function
    //       //base case if the 1st array element in the object value not equals to schema type, call errorConstructor, passing in query and type, testError
    //       for (let type in schema[keys]) {
    //         if (type !== queryObj[keys][0]) {
    //           return errorConstructor(keys, type, errorObj);
    //         }
    //         //if the schema type matches(character/createCharacter), extract the type, and value of schema, and the queryObj type and field
    // //type would be characters and film, or createCharacter
    //         if(type === queryObj[keys][0]){
    //   let schemaType = type;
    //   //count the keys in schema[keys][type],{name, height, film}
    //   let keys= 3;//need function to extract this number
    
    
    // }
    //       }
    
    //       //recursive case, compare the 1st array element in the object value equals to schema type, if matches
    //       //compare
    //       if (queryObj[keys][0] === schema[keys]) {
    //       }
    //     }
    //   }