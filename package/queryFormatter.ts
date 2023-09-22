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
//with nested query: /(\s|\n)*woobae\s*{[^{}]*}|(characters\s*{[^{}]*\s*}(\s|\n)*)/

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
        text {
          content
          test2 {
            field
          }
        }
      }
    }
  }
`; */
//const testError = { links: ['test', 'wobble'], text: ['test2'] };
//remove(links, test, *original query*) --doesn't work
//remove(text, test2, query) --this work
//not nested query: /(\s|\n)*woobae\s*{[^{}]*}|(characters\s*{[^{}]*\s*}(\s|\n)*)/
function remove(type: string, field: string, query: string) {
  let substring = '';
  //declare a pattern and find if the type pattern exist in the query
  //regexPattern to find either 'field{}' or 'type{}'  in the query
  //type{{}
  const regex = new RegExp(`${type}\\s*{[^]*?${field}(\\s|\\n)*`);
  // const regexPattern = new RegExp(
  //    `(\\s|\\n)*${field}\\s*{[^{}]*}|(${type}\\s*{[^{}]*\\s*}(\\s|\\n)*)`
  // );
  // const regexPattern = new RegExp(
  //   `(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`,
  //   'g'
  // );
  // console.log(regexPattern);
  const match = query.match(regex);
  if (match) {
    //get the content inside {}
    const extractedField = match[0];
    let newQuery = '';
    // console.log(extractedField);
    const regexExtract = new RegExp(`\\{[(\\s|\\n)*${field}[ ]*\\}`);
    const regexExtract1 = new RegExp(`\\{\\s*${field}\\s*\\}`);
    // console.log(regexExtract1.test(extractedField));
    if (regexExtract.test(extractedField)) {
      newQuery = query.replace(extractedField, '');
      // console.log(newQuery);
      return newQuery;
    }

    if (extractedField.includes(field)) {
      //regex express to match the word with or without curly braces immediately following it
      const regex1 = new RegExp(`${field}\\s*\\{`);
      //1st case, there's no curly braces pair after the field
      if (!regex1.test(extractedField)) {
        const regex2 = new RegExp(`${field}\\s*`);
        newQuery = extractedField.replace(regex2, '');
      } else {
        //2nd case, there a pair of {} right after the field
        const regex = new RegExp(
          `(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`,
          'g'
        );
        newQuery = extractedField.replace(regex, '');
      }
      //return the manipulated origional query
      return query.replace(extractedField, newQuery);
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
module.exports = queryFormatter;
// const invalidQuery = queryFormatter(testQuery);

// const testError = { links: ['test', 'wobble'], text: ['test2'] };
// // const testError = { text: ['test2'] };
// const testError1 = { links: ['test', 'wobble'] };

// const validQuery = invalidQuery(testError);
// console.log(validQuery);

////////////////////////////////////////////////////////////////
