import {
  DocumentNode,
  parse,
  visit,
  OperationDefinitionNode,
  FieldNode,
} from 'graphql';

// Parse the client's query and traverse the AST object
// Construct a query object queryMap, using the same structure as the cacheSchema for comparison
function queryMapper(query: string) {
  
  const ast: DocumentNode = parse(query);

  const queryMap: Record<string, Record<string, any[]>> = {};

  let operationType: string;

  // Traverse each individual nodes inside the AST object
  // Populate the query object with all the types and fields from the input query
  // Key/value pairs in the returned query object are a type (key) pointing to an array of fields (string) and types (object)
  const buildFieldArray = (node: FieldNode): any => {
    const fieldArray: any[] = [];

    if (node.selectionSet) {
      node.selectionSet.selections.forEach((selection) => {
        if (selection.kind === 'Field') {
          if (selection.selectionSet) {
            const fieldEntry = { [selection.name.value]: []};
            fieldEntry[selection.name.value] = buildFieldArray(selection);
            fieldArray.push(fieldEntry);
          } else {
            fieldArray.push(...buildFieldArray(selection));
          }
        }
      });
    }
    
    let temp = fieldArray.length > 0 ? fieldArray : [node.name.value];
    return temp;
  };

  //graphQL visitor object, that contains callback functions, to traverse AST object
  //it divides the query with 'query' and 'mutation', and populate each type and field for nested types of field
  //by calling visit method on each individual node
  const visitor = {
    OperationDefinition: {
      enter(node: OperationDefinitionNode) {
        operationType = node.operation;
        queryMap[operationType] = {};

        const types = node.selectionSet.selections;
  
        const fieldVisitor = {
          Field(node: FieldNode) {

            // conditions that handle nested types/fields and sibling types
            Object.values(types).forEach((type: any) => {
              if (!queryMap[operationType][type.name.value] && node.selectionSet) {
                if (Object.values(types).includes(node)) {
                  queryMap[operationType][node.name.value] = buildFieldArray(node);
                }
              }
            })
          },
        };
  
        visit(node, fieldVisitor);
      },
    },
  };
  
  visit(ast, visitor);

  return queryMap;
}

module.exports = queryMapper;
