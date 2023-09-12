import { ErrorMessage } from './types';

function queryFormatter(query: string) {
  const cache = query;

  return function (error: ErrorMessage) {
    let resultQuery = query;
    
    for (let keys in error) {
        console.log(keys);
      
        //Link, find key in query, and remove the key values
      //const testError = { Link: ['test', 'wobble'], Feed: ['text'] };
      for(let i = 0; i < error[keys].length; i++){
        resultQuery = remove(keys, error[keys][i], resultQuery);
      }
    }

    if(resultQuery === query) return console.error('Query reformating failed.')

    return resultQuery;
  };
}

function remove(type: string, field: string, query: string) {
  let substring = '';
  //declare a pattern and find if the type pattern exist in the query
  const regexPattern = new RegExp(`(\\s|\\n)*${field}\\s*{[^{}]*}|(${type}\\s*{[^{}]*\\s*}(\\s|\\n)*)`);
  // const regexPattern = new RegExp(
  //   `(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`,
  //   'g'
  // );

  console.log(regexPattern);
  const match = query.match(regexPattern);
  console.log(match);
  if (match) {
    //get the content inside {}
    const extractedField = match[0];
    let newQuery = '';
    console.log(extractedField);
    const regexExtract = new RegExp(`\\{[(\\s|\\n)*${field}[ ]*\\}`);
    const regexExtract1 = new RegExp(`\\{\\s*${field}\\s*\\}`);
    console.log(regexExtract1.test(extractedField))
    if(regexExtract.test(extractedField)){
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
        return query};
  } else {
    console.log('no matching type found.')
    return query;}
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
      }
      text {
        content
      }
    }
  }
`;

const invalidQuery = queryFormatter(testQuery);

const testError = { links: ['test', 'wobble'], feed: ['text'] };
// const testError = { text: ['content'] };

const validQuery = invalidQuery(testError);
console.log(validQuery);

////////////////////////////////////////////////////////////////
