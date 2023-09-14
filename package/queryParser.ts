import { parse } from 'graphql';
import { ErrorMessage, SchemaObj } from './types';

const sampleQuery = 
`query Root {
    allPlanets {
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
  }`
  let parsed = parse(sampleQuery)
  console.log(parsed);
  const sampleObj = `{ kind: 'Document',
  definitions: 
   [ { kind: 'OperationDefinition',
       operation: 'query',
       name: 
        { kind: 'Name',
          value: 'Root',
          loc: 
           Location { start: 6,
             end: 10,
             startToken: 
              Token { kind: 'Name',
                start: 6,
                end: 10,
                line: 1,
                column: 7,
                value: 'Root',
                prev: [Object],
                next: [Object] },
             endToken: 
              Token { kind: 'Name',
                start: 6,
                end: 10,
                line: 1,
                column: 7,
                value: 'Root',
                prev: [Object],
                next: [Object] },
             source: 
              Source { body: 'query Root {\n    allPlanets {\n      planets {\n        name\n        id\n        filmConnection {\n          films {\n            title\n          }\n        }\n      }\n    }\n  }',
                name: 'GraphQL request',
                locationOffset: [Object] } } },
       variableDefinitions: [],
       directives: [],
       selectionSet: 
        { kind: 'SelectionSet',
          selections: 
           [ { kind: 'Field',
               alias: undefined,
               name: [Object],
               arguments: [],
               directives: [],
               selectionSet: [Object],
               loc: [Object] } ],
          loc: 
           Location { start: 11,
             end: 170,
             startToken: 
              Token { kind: '{',
                start: 11,
                end: 12,
                line: 1,
                column: 12,
                value: undefined,
                prev: [Object],
                next: [Object] },
             endToken: 
              Token { kind: '}',
                start: 169,
                end: 170,
                line: 13,
                column: 3,
                value: undefined,
                prev: [Object],
                next: [Object] },
             source: 
              Source { body: 'query Root {\n    allPlanets {\n      planets {\n        name\n        id\n        filmConnection {\n          films {\n            title\n          }\n        }\n      }\n    }\n  }',
                name: 'GraphQL request',
                locationOffset: [Object] } } },
       loc: 
        Location { start: 0,
          end: 170,
          startToken: 
           Token { kind: 'Name',
             start: 0,
             end: 5,
             line: 1,
             column: 1,
             value: 'query',
             prev: 
              Token { kind: '<SOF>',
                start: 0,
                end: 0,
                line: 0,
                column: 0,
                value: undefined,
                prev: null,
                next: [Circular] },
             next: 
              Token { kind: 'Name',
                start: 6,
                end: 10,
                line: 1,
                column: 7,
                value: 'Root',
                prev: [Circular],
                next: [Object] } },
          endToken: 
           Token { kind: '}',
             start: 169,
             end: 170,
             line: 13,
             column: 3,
             value: undefined,
             prev: 
              Token { kind: '}',
                start: 165,
                end: 166,
                line: 12,
                column: 5,
                value: undefined,
                prev: [Object],
                next: [Circular] },
             next: 
              Token { kind: '<EOF>',
                start: 170,
                end: 170,
                line: 13,
                column: 4,
                value: undefined,
                prev: [Circular],
                next: null } },
          source: 
           Source { body: 'query Root {\n    allPlanets {\n      planets {\n        name\n        id\n        filmConnection {\n          films {\n            title\n          }\n        }\n      }\n    }\n  }',
             name: 'GraphQL request',
             locationOffset: { line: 1, column: 1 } } } } ],
  loc: 
   Location { start: 0,
     end: 170,
     startToken: 
      Token { kind: '<SOF>',
        start: 0,
        end: 0,
        line: 0,
        column: 0,
        value: undefined,
        prev: null,
        next: 
         Token { kind: 'Name',
           start: 0,
           end: 5,
           line: 1,
           column: 1,
           value: 'query',
           prev: [Circular],
           next: 
            Token { kind: 'Name',
              start: 6,
              end: 10,
              line: 1,
              column: 7,
              value: 'Root',
              prev: [Circular],
              next: 
               Token { kind: '{',
                 start: 11,
                 end: 12,
                 line: 1,
                 column: 12,
                 value: undefined,
                 prev: [Circular],
                 next: [Object] } } } },
     endToken: 
      Token { kind: '<EOF>',
        start: 170,
        end: 170,
        line: 13,
        column: 4,
        value: undefined,
        prev: 
         Token { kind: '}',
           start: 169,
           end: 170,
           line: 13,
           column: 3,
           value: undefined,
           prev: 
            Token { kind: '}',
              start: 165,
              end: 166,
              line: 12,
              column: 5,
              value: undefined,
              prev: 
               Token { kind: '}',
                 start: 159,
                 end: 160,
                 line: 11,
                 column: 7,
                 value: undefined,
                 prev: [Object],
                 next: [Circular] },
              next: [Circular] },
           next: [Circular] },
        next: null },
     source: 
      Source { body: 'query Root {\n    allPlanets {\n      planets {\n        name\n        id\n        filmConnection {\n          films {\n            title\n          }\n        }\n      }\n    }\n  }',
        name: 'GraphQL request',
        locationOffset: { line: 1, column: 1 } } } }`

        /* Sample valid query:
        `query {
          characters {
            name
            films {
              title
            }
          }
        }
        `
        */

        /* Sample invalid query:
        `query {
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
        `
        */

        /*Sample Schema: 
{
  type Query: {
    characters: {name: string, height: number, films: Query.films?? }, 
    films: {title: string}
  }, 
  type Mutation: {
    createCharacter: {name: string, height: number}
  }
}
*/
//schema to be compared?:
//characters: ['name', 'height', 'films']
//createCharacter: ['name', 'height']

 // inputs: client's query / schema object (from group 1)
// const queryparser = (query: string, schema: SchemaObj): void => {
  // define a schemaObj alias (type)
  // check the type of operation (query, mutation), should be exact word, if no match, just return the default error message to the client
// query could be called explicitly or implicitly => query {} or {}
// grab the first word (field) after {, 'Character', and the first word 'films' after
}
// outputs: input query / custom error object (for queryFormatter)

//compare input query and the schema
//if it is correct then keep the query
//if not correct, then output:
// sample error (output) = { links: ['test', 'wobble'], feed: ['text'] };

//parse the SDL into an AST
// const schemaAST: DocumentNode = typeDefs.definitions[0];

// const characterType = schemaAST.definitions.find(
//     (definition) => definition.kind === 'ObjectTypeDefinition' && definition.name.value === 'Character'
// );
// const filmType = schemaAST.definitions.find(
//     (definition) => definition.kind === 'ObjectTypeDefinition' && definition.name.value === 'Film'
//   );

//   console.log('Character type:', characterType);
// console.log('Film type:', filmType);
//   const typeVisitor = {
//     Field: {
//         enter(node: typeof FieldNode) {
//             const parentType = schema.getQueryType() as typeof GraphQLObjectType; // Replace with the appropriate type based on your query
//             const field = parentType.getFields()[node.name.value];
//             if (field) {
//               const fieldType = field.type;
//               console.log(`Field '${node.name.value}' has type '${fieldType}'`);
//             }
//         }
//     }
//   }
//   visit(ast, typeVisitor);
//Function to traverse the AST and extract field types
// function getFieldTypes(node: FieldNode) {
//   console.log(`Field: ${node.name.value}`);

//   // The 'node' represents a field
//   //   console.log(`Field: ${node.name.value}`);
//   if (node.selectionSet) {
//     // If the field has subfields, continue traversing
//     node.selectionSet.selections.forEach((selection) => {
//       if (selection.kind === 'Field') {
//         getFieldTypes(selection as FieldNode); // Explicit type assertion
//       }
//     });
//   }
// }
// console.log(ast.definitions[0].kind);
// // Start traversing the AST from the top-level SelectionSet
// ast.definitions.forEach((definition) => {
//   if (definition.kind === 'OperationDefinition') {
//     console.log(definition.kind);
//     const selectionSet: SelectionSetNode | undefined = definition.selectionSet;
//     if (selectionSet) {
//         console.log(selectionSet);
//       selectionSet.selections.forEach((selection) => {
//         if (selection.kind === 'Field') {
//             console.log(selection.kind);
//           getFieldTypes(selection as FieldNode);
//         }
//       });
//     }
//   }
// });