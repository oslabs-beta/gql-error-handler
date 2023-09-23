import { ErrorMessage } from './types';

function queryFormatter(query: string) {
  const cache = query;

  return function (error: ErrorMessage) {
    let resultQuery = query;

    for (let keys in error) {
      //Link, find key in query, and remove the key values
      //const testError = { links: ['test'] };
      // error = { characters: [ 'woobae' ] }
      for (let i = 0; i < error[keys].length; i++) {
        /*check if this iteration function call result is the same as last time, 
        if so, it means we have an empty curly bracket makes the whole manipulated qurey invalid
        that case, we want to return the origional query, and use the origional graphQL validation error message
        */
        if (remove(keys, error[keys][i], resultQuery) === resultQuery) {
          return query;
        }
        console.log(keys);
        console.log(error[keys][i]);
        resultQuery = remove(keys, error[keys][i], resultQuery);
        // console.log(resultQuery);
      }
    }
    // if(resultQuery === query) return console.error('Query reformating failed.')

    return resultQuery;
  };
}
//const testError = { links: ['test', 'wobble'], text: ['content'] };
//remove(links, test, *original query*) --doesn't work
//remove(text, test2, query) --this work
function remove(type: string, field: string, query: string) {
  // let substring = '';
  //first we are going to identify if the type is equals to query or mutation, if so, we are going to remove the entire curly braces patter and field
  if (type === 'query' || type === 'mutation') {
    const regexField = new RegExp(`(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`);
    if (regexField.test(query)) {
      query = query.replace(regexField, '');
      console.log(query);
    }
  }
  //declare a pattern and find if the type pattern exist in the query
  /*trying to find pattern 
      `${type} {
        id
        description
        test
        ${field}' 
        */
  const regex = new RegExp(`${type}\\s*{[^]*?${field}(\\s|\\n)*`);
  //try to find pattern if there is curly braces after either field or type
  // const regexPattern = new RegExp(
  //    `(\\s|\\n)*${field}\\s*{[^{}]*}|(${type}\\s*{[^{}]*\\s*}(\\s|\\n)*)`
  // );
  const match = query.match(regex);
  console.log(match);
  if (match) {
    //get the content inside {}
    const extractedField = match[0];
    let newQuery = '';
    console.log(extractedField);
    // regex pattern:
    const regexExtract = new RegExp(`\\{[(\\s|\\n)*${field}[ ]*\\}`);
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
      const regex1 = new RegExp(`${field}\\s*\\{`);
      //1st case, there's no curly braces pair after the field
      if (!regex1.test(extractedField)) {
        const regex2 = new RegExp(`${field}\\s*`);
        newQuery = extractedField.replace(regex2, '');
        console.log(newQuery);
        //if there is a curly braces after the tyye
        // console.log(newQuery);
      } else {
        //2nd case, there a pair of {} right after the field
        const regex = new RegExp(
          `(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`,
          'g'
        );
        newQuery = extractedField.replace(regex, '');
      }
      //return the manipulated origional query
      let result = query.replace(extractedField, newQuery);
      console.log(result);
      //if there's a empty curly bracket after the type word, delete that word
      const regexType = new RegExp(`\\s*${type}\\s*\\{\\s*}`);
      if (regexType.test(result)) {
        console.log(type);
        result = result.replace(regexType, '');
      }
      console.log(result);
      //if regex pattern detect there's empty curly bracket in the result query string, return the origional query
      const regexEmpty = new RegExp(`\\s*\\{\\s*}`);
      if (regexEmpty.test(result)) {
        return query;
      }
      console.log(result);
      return result;
    } else {
      console.log('no matching field found.');
      return query;
    }
  } else {
    console.log('no matching type found.');
    return query;
  }
}
const checkEmpty = (query: string) => {
  const regexEmpty = new RegExp(`/\{\s*\}/`);
  if (regexEmpty.test(query)) {
    return;
  }
};
// TEST /////////////////////////////////////////////////////////
const testQuery = `
query {
  fed {
    id
  }
  links {
    id
  }
}
`;
const testQuery1 = `
query {
  feed {
    links {
      test
      text {
        TIFFAAAANNNNYYYYYYYYYY
      }
    }
  }
}
`;
module.exports = queryFormatter;
const invalidQuery = queryFormatter(testQuery);

const testError = { query: ['fed'] };
// // const testError = { text: ['test2'] };
const testError1 = { links: ['test'], text: ['TIFFAAAANNNNYYYYYYYYYY'] };

const validQuery = invalidQuery(testError);
console.log(validQuery);
// console.log(typeof validQuery);

////////////////////////////////////////////////////////////////
