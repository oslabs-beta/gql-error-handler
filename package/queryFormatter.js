"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// function takes in original query as a string
// and returns a function that takes in object containing invalid fields
// to remove invalid fields and produce a valid result query
function queryFormatter(query) {
    var cache = query;
    return function (error) {
        var resultQuery = query;
        for (var keys in error) {
            for (var i = 0; i < error[keys].length; i++) {
                // If all fields are invalid, return the original query in order to use Apollo Server's validation error message
                if (remove(keys, error[keys][i], resultQuery) === resultQuery) {
                    return query;
                }
                // create reformulated query as invalid fields are being removed
                resultQuery = remove(keys, error[keys][i], resultQuery);
            }
        }
        return resultQuery;
    };
}
function remove(type, field, query) {
    if (type === 'query' || type === 'mutation') {
        var regexField = new RegExp("(\\s|\\n)*".concat(field, "(\\s|\\n)*\\{[^{}]*\\}"));
        if (regexField.test(query)) {
            query = query.replace(regexField, '');
        }
    }
    var regex = new RegExp("".concat(type, "\\s*{[^]*?").concat(field, "(\\s|\\n)*"));
    var match = query.match(regex);
    if (match) {
        var extractedField = match[0];
        var newQuery = '';
        var regexExtract = new RegExp("\\{[(\\s|\\n)*".concat(field, "[ ]*\\}"));
        if (regexExtract.test(extractedField)) {
            newQuery = query.replace(extractedField, '');
            return newQuery;
        }
        if (extractedField.includes(field)) {
            var regex1 = new RegExp("".concat(field, "\\s*\\{"));
            if (!regex1.test(extractedField)) {
                var regex2 = new RegExp("".concat(field, "\\s*"));
                newQuery = extractedField.replace(regex2, '');
            }
            else {
                var regex_1 = new RegExp("(\\s|\\n)*".concat(field, "(\\s|\\n)*\\{[^{}]*\\}"), 'g');
                newQuery = extractedField.replace(regex_1, '');
            }
            var result = query.replace(extractedField, newQuery);
            var regexType = new RegExp("\\s*".concat(type, "\\s*\\{\\s*}"));
            if (regexType.test(result)) {
                result = result.replace(regexType, '');
            }
            var regexEmpty = new RegExp("\\s*\\{\\s*}");
            if (regexEmpty.test(result)) {
                return query;
            }
            return result;
        }
        else {
            return query;
        }
    }
    else {
        return query;
    }
}
module.exports = queryFormatter;
