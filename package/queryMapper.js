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
                        var fieldEntry = (_a = {}, _a[selection.name.value] = [], _a);
                        fieldEntry[selection.name.value] = buildFieldArray(selection);
                        console.log(fieldEntry[selection.name.value]);
                        fieldArray.push(fieldEntry);
                        // console.log('line28,', selection.name.value);
                    }
                    else {
                        // console.log(fieldArray);
                        // console.log(selection.name.value)
                        fieldArray.push.apply(fieldArray, buildFieldArray(selection));
                    }
                }
            });
        }
        var temp = fieldArray.length > 0 ? fieldArray : [node.name.value];
        console.log(temp);
        return temp;
    };
    var visitor = {
        OperationDefinition: {
            enter: function (node) {
                operationType = node.operation;
                queryMap[operationType] = {};
                var types = node.selectionSet.selections;
                var fieldVisitor = {
                    Field: function (node) {
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
var testQuery = "\n        query {\n          feed {\n            id\n            tiffany\n            links {\n                id\n                description\n                tiffany2\n                feed {\n                    name\n                    tiffany3\n                }\n            } \n          }\n        }\n      ";
var testQuery1 = "\n      query {\n        feed {\n          id\n          tiffany\n          links {\n              id\n              description\n              tiffany2\n          }\n        } \n      }\n    ";
var testQuery2 = "\n    query {\n      links {\n        test\n        woobae\n      } \n      feed {\n        id\n        tiffany\n        links {\n            id\n            description\n            tiffany2\n        }\n      }\n    }\n  ";
var testQuery3 = "\n        query {\n          feed {\n            id\n            tiffany\n          } \n        }\n      ";
var testQuery4 = "\n      query { \n        feed {\n          id\n          tiffany\n          links {\n              id\n              description\n              tiffany2\n              feed1 {\n                tiffany3\n              }\n          }\n        }\n        test {\n          id\n          description\n      }\n      }\n    ";
console.log(queryMapper(testQuery4));
module.exports = queryMapper;
