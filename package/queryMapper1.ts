import {
  DocumentNode,
  parse,
  visit,
  OperationDefinitionNode,
  FieldNode,
  ObjectTypeDefinitionNode,
} from 'graphql';

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
            const fieldEntry = { [selection.name.value]: []};
            fieldEntry[selection.name.value] = buildFieldArray(selection);
            console.log(fieldEntry[selection.name.value]);
            fieldArray.push(
              fieldEntry
            );
          // console.log('line28,', selection.name.value);
          } else {
            // console.log(fieldArray);
            // console.log(selection.name.value)
            fieldArray.push(...buildFieldArray(selection));
          }
        }
      });
    }
    
    let temp = fieldArray.length > 0 ? fieldArray : [node.name.value];
    console.log(temp);
    return temp;
  };

  const visitor = {
    OperationDefinition: {
      enter(node: OperationDefinitionNode) {
        operationType = node.operation;
        queryMap[operationType] = {};

        const types = node.selectionSet.selections;
  
        const fieldVisitor = {
          Field(node: FieldNode) {

            Object.values(types).forEach((type: any) => {
              if (!queryMap[operationType][type.name.value] && node.selectionSet) {
                queryMap[operationType][node.name.value] = buildFieldArray(node);
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

const testQuery = `
        query {
          feed {
            id
            tiffany
            links {
                id
                description
                tiffany2
                feed {
                    name
                    tiffany3
                }
            } 
          }
        }
      `;
      const testQuery1 = `
      query {
        feed {
          id
          tiffany
          links {
              id
              description
              tiffany2
          }
        } 
      }
    `;
    const testQuery2 = `
    query {
      links {
        test
        woobae
      } 
      feed {
        id
        tiffany
        links {
            id
            description
            tiffany2
        }
      }
    }
  `;
  const testQuery3 = `
        query {
          feed {
            id
            tiffany
          } 
        }
      `;
console.log(queryMapper(testQuery3));
module.exports = queryMapper;
