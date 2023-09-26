import {
  DocumentNode,
  parse,
  visit,
  OperationDefinitionNode,
  FieldNode,
  ObjectTypeDefinitionNode,
} from 'graphql';

// function takes in original query as string
// and converts it to object form where key values are an array of fields

function queryMapper(query: string) {
  const ast: DocumentNode = parse(query);

  const queryMap: Record<string, Record<string, any[]>> = {};

  let operationType: string;

  const buildFieldArray = (node: FieldNode): any => {
    const fieldArray: any[] = [];

    if (node.selectionSet) {
      node.selectionSet.selections.forEach((selection) => {
        if (selection.kind === 'Field') {
          if (selection.selectionSet) {
            fieldArray.push({
              [selection.name.value]: buildFieldArray(selection),
            });
          } else {
            fieldArray.push(...buildFieldArray(selection));
          }
        }
      });
    }

    let temp = fieldArray.length > 0 ? fieldArray : [node.name.value];
    return temp;
  };

  const visitor = {
    OperationDefinition: {
      enter(node: OperationDefinitionNode) {
        operationType = node.operation;
        queryMap[operationType] = {};

        const fieldVisitor = {
          Field(node: FieldNode) {
            if (node.selectionSet) {
              queryMap[operationType][node.name.value] = buildFieldArray(node);
            }
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
