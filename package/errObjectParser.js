"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// function takes in object containing invalid fields and object mapping custom types to their corresponding field names
// and generates an array containing custom error message strings to be attached to returned partial data
function errObjectParser(errorObj, typeFieldsCache) {
    var errorMessArr = [];
    for (var prop in errorObj) {
        for (var i = 0; i < errorObj[prop].length; i++) {
            errorMessArr.push("Cannot query field \"".concat(errorObj[prop][i], "\" on type \"").concat(typeFieldsCache[prop], "\"."));
        }
    }
    return errorMessArr;
}
module.exports = errObjectParser;
