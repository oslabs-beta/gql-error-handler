const queryFormatter = require('../package/queryFormatter.js');

describe('queryFormatter tests', () => {

  // let testQuery;
  // let testError;
  // let outputQuery;

  it('Return the input query if there aren\'t any errors', () => {
    // declare our testQuery
    const testQuery = `
    query {
      feed {
        links {
          id
          description
        }
      }
    }
  `;
    // declare our testError in the case that there aren't any errors
    const testError = {};
    // call queryFormatter passing the query
    const test = queryFormatter(testQuery);
    // expect statements where you'll pass the error obj
    expect(test(testError)).toEqual(testQuery);
  });

  it('Return reformatted query where invalid fields are at 1 level of depth in 1 type', () => {
    const testQuery = `
      query {
        feed {
          links {
            id
            description
            wobble
          }
        }
      }
    `;
    const testError = { links: ['wobble'] };
    const outputQuery = `
      query {
        feed {
          links {
            id
            description
          }
        }
      }
    `;
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

  it('Return reformatted query where invalid fields are at 1 level of depth in multiple types', () => {
    // declare our testQuery
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
    // declare our testError in the case that there aren't any errors
    const testError = { links: ['test', 'wobble'], text: ['content'] };
    const outputQuery = `
    query {
      feed {
        links {
          id
          description
        }
      }
    }
  `;
    // call queryFormatter passing the query
    const test = queryFormatter(testQuery);
    // expect statements where you'll pass the error obj
    expect(test(testError)).toEqual(outputQuery);
  });

  it('Return reformatted query where invalid fields are at multiple levels of depth', () => {
    // declare our testQuery
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
          }
        }
      }
    }
  `;
    // declare our testError in the case that there aren't any errors
    const testError = { links: ['test', 'wobble'], text: ['content'] };
    const outputQuery = `
    query {
      feed {
        links {
          id
          description
        }
      }
    }
  `;
    // call queryFormatter passing the query
    const test = queryFormatter(testQuery);
    // expect statements where you'll pass the error obj
    expect(test(testError)).toEqual(outputQuery);
  });

  it('Return reformatted query where invalid fields are shallow compared to more deeply nested fields', () => {
    // declare our testQuery
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
          }
        }
      }
    }
  `;
    // declare our testError in the case that there aren't any errors
    const testError = { links: ['test', 'wobble'] };
    const outputQuery = `
    query {
      feed {
        links {
          id
          description
          text {
            content
          }
        }
      }
    }
  `;
    // call queryFormatter passing the query
    const test = queryFormatter(testQuery);
    // expect statements where you'll pass the error obj
    expect(test(testError)).toEqual(outputQuery);
  });

  it('Return reformatted query where invalid fields occur at same depth within multiple types', () => {
    // declare our testQuery
    const testQuery = `
    query {
      feed {
        links {
          id
          description
          test
        }
        text {
          content
          wobble
        }
      }
    }
  `;
    // declare our testError in the case that there aren't any errors
    const testError = { links: ['test'], text: ['wobble'] };
    const outputQuery = `
    query {
      feed {
        links {
          id
          description
        }
        text {
          content
        }
      }
    }
  `;
    // call queryFormatter passing the query
    const test = queryFormatter(testQuery);
    // expect statements where you'll pass the error obj
    expect(test(testError)).toEqual(outputQuery);
  });

  it('Return reformatted query where invalid fields are at multiple levels of depth stemming from different types at equivalent depth', () => {
    // declare our testQuery
    const testQuery = `
    query {
      feed {
        links {
          id
          description
          test {
            name
            nested
          }
        }
        text {
          content
          wobble
        }
      }
    }
  `;
    // declare our testError in the case that there aren't any errors
    const testError = { test: ['nested'], text: ['wobble'] };
    const outputQuery = `
    query {
      feed {
        links {
          id
          description
        }
        text {
          content
        }
      }
    }
  `;
    // call queryFormatter passing the query
    const test = queryFormatter(testQuery);
    // expect statements where you'll pass the error obj
    expect(test(testError)).toEqual(outputQuery);
  });

  it('Return reformatted query where a field appears multiple times, in one case being valid and in the other, invalid', () => {
    // declare our testQuery
    const testQuery = `
    query {
      feed {
        links {
          id
          description
        }
        text {
          id
          content
        }
      }
    }
  `;
    // declare our testError in the case that there aren't any errors
    const testError = { text: ['id'] };
    const outputQuery = `
    query {
      feed {
        links {
          id
          description
        }
        text {
          content
        }
      }
    }
  `;
    // call queryFormatter passing the query
    const test = queryFormatter(testQuery);
    // expect statements where you'll pass the error obj
    expect(test(testError)).toEqual(outputQuery);
  });
})
