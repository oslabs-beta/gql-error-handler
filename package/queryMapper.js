"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
// Parse the client's query and traverse the AST object
// Construct a query object queryMap, using the same structure as the cacheSchema for comparison
function queryMapper(query) {
    var ast = (0, graphql_1.parse)(query);
    var queryMap = {};
    var operationType;
    // Traverse each individual nodes inside the AST object
    // Populate the query object with all the types and fields from the input query
    // Key/value pairs in the returned query object are a type (key) pointing to an array of fields (string) and types (object)
    var buildFieldArray = function (node) {
        var fieldArray = [];
        if (node.selectionSet) {
            node.selectionSet.selections.forEach(function (selection) {
                var _a;
                if (selection.kind === 'Field') {
                    if (selection.selectionSet) {
                        var fieldEntry = (_a = {}, _a[selection.name.value] = [], _a);
                        fieldEntry[selection.name.value] = buildFieldArray(selection);
                        fieldArray.push(fieldEntry);
                    }
                    else {
                        fieldArray.push.apply(fieldArray, buildFieldArray(selection));
                    }
                }
            });
        }
        var temp = fieldArray.length > 0 ? fieldArray : [node.name.value];
        return temp;
    };
    //graphQL visitor object, that contains callback functions, to traverse AST object
    //it divides the query with 'query' and 'mutation', and populate each type and field for nested types of field
    //by calling visit method on each individual node
    var visitor = {
        OperationDefinition: {
            enter: function (node) {
                operationType = node.operation;
                queryMap[operationType] = {};
                var types = node.selectionSet.selections;
                var fieldVisitor = {
                    Field: function (node) {
                        // conditions that handle nested types/fields and sibling types
                        Object.values(types).forEach(function (type) {
                            if (!queryMap[operationType][type.name.value] && node.selectionSet) {
                                if (Object.values(types).includes(node)) {
                                    queryMap[operationType][node.name.value] = buildFieldArray(node);
                                }
                            }
                        });
                    },
                };
                (0, graphql_1.visit)(node, fieldVisitor);
            },
        },
    };
    (0, graphql_1.visit)(ast, visitor);
    return queryMap;
}
module.exports = queryMapper;
