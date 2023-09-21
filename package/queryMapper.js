"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
function queryMapper(query) {
    var ast = (0, graphql_1.parse)(query);
    var queryMap = {};
    var operationType;
    var buildFieldArray = function (node) {
        var fieldArray = [];
        if (node.selectionSet) {
            node.selectionSet.selections.forEach(function (selection) {
                var _a;
                if (selection.kind === 'Field') {
                    if (selection.selectionSet) {
                        fieldArray.push((_a = {},
                            _a[selection.name.value] = buildFieldArray(selection),
                            _a));
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
    var visitor = {
        OperationDefinition: {
            enter: function (node) {
                operationType = node.operation;
                queryMap[operationType] = {};
                var fieldVisitor = {
                    Field: function (node) {
                        if (node.selectionSet) {
                            queryMap[operationType][node.name.value] = buildFieldArray(node);
                        }
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
