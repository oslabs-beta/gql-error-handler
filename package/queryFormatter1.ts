import { ErrorMessage } from './types';

function queryFormatter(query: string) {
  const cache = query;

  return function (error: ErrorMessage) {
    let resultQuery = query;
    console.log(resultQuery);
    
    for (let keys in error) {
        console.log(keys);
      
        //Link, find key in query, and remove the key values
      //const testError = { Link: ['test', 'wobble'], Feed: ['text'] };
      for(let i = 0; i < error[keys].length; i++){
        console.log(resultQuery);
        console.log(error[keys][i])
        resultQuery = remove(keys, error[keys][i], resultQuery);
      }
    }

    if(resultQuery === query) return console.error('Query reformating failed.')

    return resultQuery;
  };
}

function remove(type: string, field: string, query: string) {
  let substring = '';
  console.log(query);
  //declare a pattern and find if the type pattern exist in the query
  const regexPattern = new RegExp(`${type}(\\s|\\n)*\\{[^{}]*\\}`);
  const regexPattern1 = new RegExp(`${type}\\s*`);
  console.log(regexPattern);
  const match = query.match(regexPattern);
  console.log(match);
  if (match) {
    //get the content inside {}
    const extractedField = match[0];
    console.log(extractedField);
    let newQuery = '';
    if (extractedField.includes(field)) {
      //regex express to match the word with or without curly braces immediately following it
      const regex1 = new RegExp(`${field}\\s*\\{`);
      console.log(regex1.test(extractedField));
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

// const testError = { links: ['test', 'wobble'], feed: ['text'] };
const testError = { feed: ['text'] };

const validQuery = invalidQuery(testError);
console.log(validQuery);

////////////////////////////////////////////////////////////////
