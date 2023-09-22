import { ErrorMessage } from './types';

function queryFormatter(query: string) {
  const cache = query;

  return function (error: ErrorMessage) {
    let resultQuery = query;

    for (let keys in error) {
      //Link, find key in query, and remove the key values
      //const testError = { Link: ['test', 'wobble'], Feed: ['text'] };
      // error = { characters: [ 'woobae' ] }
      for (let i = 0; i < error[keys].length; i++) {
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
function remove(type: string, field: string, query: string) {
  let substring = '';
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
  const regexPattern = new RegExp(
     `(\\s|\\n)*${field}\\s*{[^{}]*}|(${type}\\s*{[^{}]*\\s*}(\\s|\\n)*)`
  );
  // const regexPattern = new RegExp(
  //   `(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`,
  //   'g'
  // );
  // console.log(regexPattern);
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
      //if there's a empty curly bracket after the type word, delete that word
      const regexType = new RegExp(`\\s*${type}\\s*\\{\\s*}`);
      if(regexType.test(result)){
          result = result.replace(regexType, '');
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

// TEST /////////////////////////////////////////////////////////
const testQuery = `
  query {
    feed {
      links {
        id
        description
        test
        wobble
        text {
          content
          test2 {
            field
          }
        }
      }
    }
  }
`;
const testQuery1 = `
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
`;
module.exports = queryFormatter;
const invalidQuery = queryFormatter(testQuery1);

const testError = { links: ['test', 'wobble'], text: ['content'] };
// // const testError = { text: ['test2'] };
// const testError1 = { links: ['test', 'wobble'] };

const validQuery = invalidQuery(testError);
console.log(validQuery);

////////////////////////////////////////////////////////////////
