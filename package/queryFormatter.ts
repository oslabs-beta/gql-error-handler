import { parse } from 'graphql';
import { QueryAST } from './types';

// queryFormatter.ts
// one func, query manipulation (closure) {input is query, output is function(formatter{output is sanitized query})}
// intercept original query
// cache original query (or simply assign to const if we pass query on to query parser within scope of current function)
// send it to query parser
// returned function {input is all fields returned by func errorParser.ts (array of strings), output refactored query} would refactor the query after receiving error object (as argument)
// if no error object, should just return the query (do nothing)

// based on this parse of error message, reformat the original querry in the cache (this is the returned function on LINE 6)

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

const testFields = { Link: ['test', 'wobble'], Feed: ['text'] };


//helper function to remove the field{} in the query
function remove(field: string, query: string): string {
  let newQuery = '';
  if (query.includes(field)) {
    //regex express to match the word with or without curly braces immediately following it
    const regex1 = new RegExp(`${field}\\s*\\{`);
    console.log(regex1.test(query));
    //1st case, there's no curly braces pair after the field
    if (!regex1.test(query)) {
      //   console.log('there is no curly braces right after field');
      const regex2 = new RegExp(`${field}\\s*`);
      newQuery = query.replace(regex2, '');
    } else {
      //2nd case, there a pair of {} right after the field
      const regex = new RegExp(`(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`, 'g');
      newQuery = query.replace(regex, '');
    }
  }

  //3rd case, there's no field found
  else {
    return query;
  }
  //return the modified query
  console.log(newQuery);
  return newQuery;
}
//after comparison, we need data from the schema, ---fields
function queryFormatter(query: string) {
  //find the key word in the testquery matching the string
  let cache = query;

  return function (fields: string[]) {
    let modifiedQuery = cache;
    for (let i = 0; i < fields.length; i++) {
      modifiedQuery = remove(fields[i], modifiedQuery);
    }
    //need to check if the returned modifiedQuery is the same as the origional query
    return modifiedQuery;
  };
}

const originalQuery = queryFormatter(testQuery);
const newQuery = originalQuery(testFields);
console.log(newQuery);
