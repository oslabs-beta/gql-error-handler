import { ErrorMessage } from './types';

// function takes in original query as a string
// and returns a function that takes in object containing invalid fields
// to remove invalid fields and produce a valid result query

function queryFormatter(query: string) {
  const cache = query;

  return function (error: ErrorMessage) {
    let resultQuery = query;

    for (let keys in error) {
      for (let i = 0; i < error[keys].length; i++) {
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

function remove(type: string, field: string, query: string) {
  if (type === 'query' || type === 'mutation') {
    const regexField = new RegExp(`(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`);
    if (regexField.test(query)) {
      query = query.replace(regexField, '');
    }
  }
  const regex = new RegExp(`${type}\\s*{[^]*?${field}(\\s|\\n)*`);
  const match = query.match(regex);
  if (match) {
    const extractedField = match[0];
    let newQuery = '';
    const regexExtract = new RegExp(`\\{[(\\s|\\n)*${field}[ ]*\\}`);

    if (regexExtract.test(extractedField)) {
      newQuery = query.replace(extractedField, '');
      return newQuery;
    }

    if (extractedField.includes(field)) {
      const regex1 = new RegExp(`${field}\\s*\\{`);
      if (!regex1.test(extractedField)) {
        const regex2 = new RegExp(`${field}\\s*`);
        newQuery = extractedField.replace(regex2, '');
      } else {
        const regex = new RegExp(
          `(\\s|\\n)*${field}(\\s|\\n)*\\{[^{}]*\\}`,
          'g'
        );
        newQuery = extractedField.replace(regex, '');
      }
      let result = query.replace(extractedField, newQuery);
      const regexType = new RegExp(`\\s*${type}\\s*\\{\\s*}`);
      if (regexType.test(result)) {
        result = result.replace(regexType, '');
      }
      const regexEmpty = new RegExp(`\\s*\\{\\s*}`);
      if (regexEmpty.test(result)) {
        return query;
      }
      return result;
    } else {
      return query;
    }
  } else {
    return query;
  }
}

module.exports = queryFormatter;
