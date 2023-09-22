"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function queryFormatter(query) {
    var cache = query;
    return function (error) {
        var resultQuery = query;
        for (var keys in error) {
            //Link, find key in query, and remove the key values
            //const testError = { Link: ['test', 'wobble'], Feed: ['text'] };
            // error = { characters: [ 'woobae' ] }
            for (var i = 0; i < error[keys].length; i++) {
                resultQuery = remove(keys, error[keys][i], resultQuery);
            }
        }
        // if(resultQuery === query) return console.error('Query reformating failed.')
        return resultQuery;
    };
}
/*nested query: {
  characters {
    name
    woobae
    films{
      title
    }
  }
}
*/
/*not nested query:
{
  characters {
    name
    woobae
  }
}
*/
/*const testQuery = `
  query {
  feed {
    links {
      id
      description
      test
      wobble
    }
    text {
      content
    }
  }
}
`; */
//const testError = { links: ['test', 'wobble'], text: ['content'] };
//remove(links, test, *original query*) --doesn't work
//remove(text, test2, query) --this work
function remove(type, field, query) {
    var substring = '';
    //declare a pattern and find if the type pattern exist in the query
    /*trying to find pattern
        `${type} {
          id
          description
          test
          ${field}'
          */
    var regex = new RegExp("".concat(type, "\\s*{[^]*?").concat(field, "(\\s|\\n)*"));
    //try to find pattern if there is curly braces after either field or type
    var regexPattern = new RegExp("(\\s|\\n)*".concat(field, "\\s*{[^{}]*}|(").concat(type, "\\s*{[^{}]*\\s*}(\\s|\\n)*)"));
    // const regexPattern = new RegExp(
    //   `(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`,
    //   'g'
    // );
    // console.log(regexPattern);
    var match = query.match(regex);
    console.log(match);
    if (match) {
        //get the content inside {}
        var extractedField = match[0];
        var newQuery = '';
        console.log(extractedField);
        // regex pattern:
        var regexExtract = new RegExp("\\{[(\\s|\\n)*".concat(field, "[ ]*\\}"));
        // const regexExtract1 = new RegExp(`(\\s|\\n)*${field}\\s*{[^{}]*}|(${type}\\s*{[^{}]*\\s*}(\\s|\\n)*)`);
        // console.log(regexExtract1.test(extractedField));
        if (regexExtract.test(extractedField)) {
            console.log(extractedField);
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
                console.log(newQuery);
                //if there is a curly braces after the tyye
                // console.log(newQuery);
            }
            else {
                //2nd case, there a pair of {} right after the field
                var regex_1 = new RegExp("(\\s|\\n)*".concat(field, "(\\s|\\n)*\\{[^{}]*\\}"), 'g');
                newQuery = extractedField.replace(regex_1, '');
            }
            //return the manipulated origional query
            var result = query.replace(extractedField, newQuery);
            //if there's a empty curly bracket after the type word, delete that word
            var regexType = new RegExp("".concat(type, "\\s*\\{\\s*}"));
            if (regexType.test(result)) {
                result = result.replace(regexType, '');
            }
            console.log(result);
            return result;
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
var testQuery = "\n  query {\n    feed {\n      links {\n        id\n        description\n        test\n        wobble\n        text {\n          content\n          test2 {\n            field\n          }\n        }\n      }\n    }\n  }\n";
var testQuery1 = "\nquery {\n  feed {\n    links {\n      id\n      description\n      test\n      wobble\n    }\n    text {\n      content\n    }\n  }\n}\n";
module.exports = queryFormatter;
var invalidQuery = queryFormatter(testQuery1);
var testError = { links: ['test', 'wobble'], text: ['content'] };
// // const testError = { text: ['test2'] };
// const testError1 = { links: ['test', 'wobble'] };
var validQuery = invalidQuery(testError);
console.log(validQuery);
////////////////////////////////////////////////////////////////
