"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// function takes in cached schema and mapped query object
// to generate object containing invalid fields
function compare(schema, queryObj) {
    var errorObj = {};
    function helper(object, type) {
        for (var key in object) {
            if (schema[type][key]) {
                for (var i = 0; i < object[key].length; i++) {
                    if (typeof object[key][i] !== 'object') {
                        if (!schema[type][key][object[key][i]]) {
                            if (object[key][i][0] !== '_') {
                                if (errorObj[key] && !errorObj[key].includes(object[key][i])) {
                                    errorObj[key].push(object[key][i]);
                                }
                                else {
                                    errorObj[key] = [object[key][i]];
                                }
                            }
                        }
                    }
                    else {
                        // recursively call function if original query is nested
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
module.exports = compare;
