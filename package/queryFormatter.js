"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function queryFormatter(query) {
    var cache = query;
    return function (error) {
        var resultQuery = query;
        for (var keys in error) {
            console.log(keys);
            //Link, find key in query, and remove the key values
            //const testError = { Link: ['test', 'wobble'], Feed: ['text'] };
            for (var i = 0; i < error[keys].length; i++) {
                resultQuery = remove(keys, error[keys][i], resultQuery);
            }
        }
        // if(resultQuery === query) return console.error('Query reformating failed.')
        return resultQuery;
    };
}
function remove(type, field, query) {
    var substring = '';
    //declare a pattern and find if the type pattern exist in the query
    var regexPattern = new RegExp("(\\s|\\n)*".concat(field, "\\s*{[^{}]*}|(").concat(type, "\\s*{[^{}]*\\s*}(\\s|\\n)*)"));
    // const regexPattern = new RegExp(
    //   `(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`,
    //   'g'
    // );
    console.log(regexPattern);
    var match = query.match(regexPattern);
    console.log(match);
    if (match) {
        //get the content inside {}
        var extractedField = match[0];
        var newQuery = '';
        console.log(extractedField);
        var regexExtract = new RegExp("\\{[(\\s|\\n)*".concat(field, "[ ]*\\}"));
        var regexExtract1 = new RegExp("\\{\\s*".concat(field, "\\s*\\}"));
        console.log(regexExtract1.test(extractedField));
        if (regexExtract.test(extractedField)) {
            newQuery = query.replace(extractedField, '');
            console.log(newQuery);
            return newQuery;
        }
        if (extractedField.includes(field)) {
            //regex express to match the word with or without curly braces immediately following it
            var regex1 = new RegExp("".concat(field, "\\s*\\{"));
            //1st case, there's no curly braces pair after the field
            if (!regex1.test(extractedField)) {
                var regex2 = new RegExp("".concat(field, "\\s*"));
                newQuery = extractedField.replace(regex2, '');
            }
            else {
                //2nd case, there a pair of {} right after the field
                var regex = new RegExp("(\\s|\\n)*".concat(field, "(\\s|\\n)*\\{[^{}]*\\}"), 'g');
                newQuery = extractedField.replace(regex, '');
            }
            //return the manipulated origional query
            return query.replace(extractedField, newQuery);
        }
        else {
            console.log('no matching field found.');
            return query;
        }
    }
    else {
        console.log('no matching type found.');
        return query;
    }
}
// TEST /////////////////////////////////////////////////////////
var testQuery = "\n  query {\n    feed {\n      links {\n        id\n        description\n        test\n        wobble\n      }\n      text {\n        content\n      }\n    }\n  }\n";
module.exports = queryFormatter;
// const invalidQuery = queryFormatter(testQuery);
// const testError = { links: ['test', 'wobble'], feed: ['text'] };
// // const testError = { text: ['content'] };
// const validQuery = invalidQuery(testError);
// console.log(validQuery);
////////////////////////////////////////////////////////////////
