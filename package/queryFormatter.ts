import { parse } from 'graphql';
import { QueryAST } from './types';

// queryFormatter.ts
// one func, query manipulation (closure) {input is query, output is function(formatter{output is sanitized query})}
// intercept original query
// cache original query (or simply assign to const if we pass query on to query parser within scope of current function)
// send it to query parser
// returned function {input is all fields returned by func errorParser.ts (array of strings), output refactored query} would refactor the query after receiving error object (as argument)
// if no error object, should just return the query (do nothing)

// based on this parse of error message, reformat the original querry in the cache (this is the returned function on LINE 6)

const testQuery = `
  query {
    feed {
      links {
        id
        description
        test
      }
    }
  }
`;

const testFields = ['test'];

//after comparison, we need data from the schema, ---fields
function queryFormatter(query: string) {
  let cache = query;
  //parse the cache to object using graphql parse method, parsed is a AST object, abostract sytax tree

  return function (fields: string[]) {
    let parsed = parse(cache);

    function traverseAST(node: QueryAST, value: string): void {
      if (node.definitions === value) {
        //delete the kind
      }
      if (node.children) {
        for (const child of node.children) {
          traverseAST(child, value);
        }
      }
    }
  };
}

const originalQuery = queryFormatter(testQuery);
const modifiedQuery = originalQuery(testFields);
console.log(modifiedQuery);

// query {
// feed {
//links {
//id
//descripton
//}
//}
//} GRAPH_VALIDATION_ERROR: message

//input
// fields = ['jeremy', 'nancy']

//output
// query {
// feed {
//links {
//id
//}
//}
//}

// {
//   kind: 'Document',
//   definitions: [
//     {
//       kind: 'OperationDefinition',
//       operation: 'query',
//       selectionSet: {
//         kind: 'SelectionSet',
//         selections: [
//           {
//             kind: 'Field',
//             name: {
//               kind: 'Name',
//               value: 'user',
//             },
//             arguments: [
//               {
//                 kind: 'Argument',
//                 name: {
//                   kind: 'Name',
//                   value: 'id',
//                 },
//                 value: {
//                   kind: 'StringValue',
//                   value: '123',
//                 },
//               },
//             ],
//             selectionSet: {
//               kind: 'SelectionSet',
//               selections: [
//                 {
//                   kind: 'Field',
//                   name: {
//                     kind: 'Name',
//                     value: 'id',
//                   },
//                 },
//                 {
//                   kind: 'Field',
//                   name: {
//                     kind: 'Name',
//                     value: 'username',
//                   },
//                 },
//               ],
//             },
//           },
//         ],
//       },
//     },
//   ],
// }
