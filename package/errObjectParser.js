"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const example = {
//   characters: ['height'],
//   films: ['The Phantom Menace', 'A New Hope'],
// };
function errObjectParser(errorObj, typeFieldsCache) {
    var errorMessArr = [];
    // iterate through errorObj, check if key(s) matches key(s) in typeFieldsCache
    for (var prop in errorObj) {
        for (var i = 0; i < errorObj[prop].length; i++) {
            errorMessArr.push("Cannot query field \"".concat(errorObj[prop][i], "\" on type \"").concat(typeFieldsCache[prop], "\"."));
        }
    }
    return errorMessArr;
}
module.exports = errObjectParser;
