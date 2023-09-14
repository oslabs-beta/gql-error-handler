import {
  DocumentNode,
  parse,
  visit,
  OperationDefinitionNode,
  FieldNode,
  ObjectTypeDefinitionNode,
} from 'graphql';
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

function queryMapper(query: string) {
  const ast: DocumentNode = parse(query);

  const queryMap: Record<string, Record<string, any[]>> = {};

  let operationType: string;

  const buildFieldObject = (node: FieldNode): any => {
    const fieldObject: Record<string, any[]> = [];

    if (node.selectionSet) {
        // console.log(node.selectionSet.selections[2]);
      node.selectionSet.selections.forEach((selection) => {
        if (selection.kind === 'Field') {
          if (selection.selectionSet) {
            fieldObject.push({ [selection.name.value]: buildFieldObject(selection)})
          } else {
            fieldObject.push(...buildFieldObject(selection));
          }
        }
      });
    }
    
    let temp = fieldObject.length > 0
    ? fieldObject
    : [node.name.value];
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
              queryMap[operationType][node.name.value] = buildFieldObject(node);
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

const query = `
  query {
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

const result = queryMapper(query);
console.log(result);
