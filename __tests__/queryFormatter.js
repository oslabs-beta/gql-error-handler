const queryFormatter = require('../package/queryFormatter.js');

describe('queryFormatter tests', () => {

  // 1 - valid query

  it('1.1 - Return the input query if there aren\'t any errors in a single depth level query', () => {
    const testQuery = `
    query {
      feed {
        id
      }
    }
  `;
    const testError = {};
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(testQuery);
  });

  it('1.2 - Return the input query if there aren\'t any errors in queries with 2 levels of depth', () => {
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
    const testError = {};
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(testQuery);
  });

  it('1.3 - Return the input query if there aren\'t any errors in queries with 3 levels of depth', () => {
    const testQuery = `
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
    const testError = {};
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(testQuery);
  });


  // 2 - completely invalid query

  it('2.1 - Return original query where all fields are invalid at single depth', () => {
    const testQuery = `
    query {
      feed {
        test
      }
    }
  `;
    const testError = { feed: ['test'] };
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(testQuery);
  });

  it('2.2 - Return original query where invalid fields are at 2nd level of depth', () => {
    const testQuery = `
    query {
      feed {
        links {
          test
        }
      }
    }
  `;
    const testError = { links: ['test'] };
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(testQuery);
  });

  it('2.3 - Return original query where invalid fields are at 2nd & 3rd level of depth', () => {
    const testQuery = `
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
    const testError = {
      links: ['test'],
      text: ['TIFFAAAANNNNYYYYYYYYYY']
    };
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(testQuery);
  });


  // 3 - 1 level of depth

  it('3.1 - Return reformatted query where invalid field is at 1 level of depth in 1 type', () => {
    const testQuery = `
    query {
      feed {
        id
        test
      }
    }
  `;
    const testError = { feed: ['test'] };
    const outputQuery = `
      query {
        feed {
          id
        }
      }
    `;
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

  it('3.2 - Return reformatted query where invalid fields are at 1 level of depth in 1 type', () => {
    const testQuery = `
    query {
      feed {
        test
        id
        TIFFAAAANNNNYYYYYYYYYY
      }
    }
  `;
    const testError = { feed: ['test', 'TIFFAAAANNNNYYYYYYYYYY'] };
    const outputQuery = `
      query {
        feed {
          id
        }
      }
    `;
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

  it('3.3 - Return reformatted query where invalid type on query', () => {
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
    const testError = { query: ['fed'] };
    const outputQuery = `
      query {
        links {
          id
        }
      }
    `;
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

  it('3.4 - Return reformatted query where invalid fields are at 1 level of depth in 2 types', () => {
    const testQuery = `
    query {
      feed {
        id
        TIFFFFFFAAAAAAANNNNNNNNYYYYYYYYYYYYY
      }
      links {
        id
        test
      }
    }
  `;
    const testError = {
      feed: ['TIFFFFFFAAAAAAANNNNNNNNYYYYYYYYYYYYY'],
      links: ['test']
    };
    const outputQuery = `
      query {
        feed {
          id
        }
        links {
          id
        }
      }
    `;
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });


  // 4 - 2 levels of depth

  it('4.1 - Return reformatted query where invalid fields are at 1 level of depth in 1 type', () => {
    const testQuery = `
      query {
        feed {
          links {
            id
            description
            TIFFFFFFFFFAAAAAAAAAANNNNNYYYYYYYYYYY
          }
        }
      }
    `;
    const testError = { links: ['TIFFFFFFFFFAAAAAAAAAANNNNNYYYYYYYYYYY'] };
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

  it('4.2 - Return reformatted query where a field appears multiple times, in one case being valid and in the other, invalid', () => {
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
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

  it('4.3 - Return reformatted query where invalid fields occur at same depth within multiple types', () => {
    const testQuery = `
    query {
      feed {
        links {
          test
          id
          description
        }
        text {
          content
          TIFFANYYY
        }
      }
    }
  `;
    const testError = { links: ['test'], text: ['TIFFANYYY'] };
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
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

  it('4.4 - Return reformatted query where invalid fields are at 1 level of depth in multiple types', () => {
    const testQuery = `
    query {
      feed {
        links {
          id
          description
          test
          TIFFANYYY
        }
        text {
          content
        }
      }
    }
  `;
    const testError = { links: ['test', 'TIFFANYYY'], text: ['content'] };
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

  it('4.5 - Return reformatted query where invalid fields are at 1st level of depth only', () => {
    const testQuery = `
    query {
      TIFFANYYY {
        test
      }
      feed {
        links {
          id
          description
        }
      }
    }
  `;
    const testError = { query: ['TIFFANYYY'] };
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


  // 5 - 3 levels of depth

  it('5.1 - Return reformatted query where invalid fields are only at 3rd level of depth at 1 type', () => {
    const testQuery = `
    query {
      feed {
        links {
          id
          description
          text {
            content
            TIFFANYYYYY WONGGGGG
          }
        }
      }
    }
  `;
    const testError = { text: ['TIFFANYYYYY WONGGGGG'] };
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
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

  it('5.2 - Return reformatted query where invalid fields are shallow compared to more deeply nested fields', () => {
    const testQuery = `
    query {
      feed {
        links {
          id
          description
          test
          TIFFAAAANNNNYYYYYYYYYY
          text {
            content
          }
        }
      }
    }
  `;
    const testError = { links: ['test', 'TIFFAAAANNNNYYYYYYYYYY'] };
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
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

  it('5.3 - Return reformatted query where invalid fields are at 1st level of depth only', () => {
    const testQuery = `
      query {
        feed {
          jobs
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
    const testError = { feed: ['jobs'] };
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
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

  it('5.4 - Return reformatted query where invalid fields occur at three different nested levels of depth', () => {
    const testQuery = `
    query {
      feed {
        TIFFAAAANNNNYYYYYYYYYY
        links {
          id
          description
          test
          TIFFAAAANNNNYYYYYYYYYY
          text {
            content
          }
        }
      }
    }
  `;
    const testError = {
      feed: ['TIFFAAAANNNNYYYYYYYYYY'],
      links: ['test', 'TIFFAAAANNNNYYYYYYYYYY'],
      text: ['content']
    };
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

  it('5.5 - Return reformatted query where invalid fields are at 2nd & 3rd levels of depth', () => {
    const testQuery = `
    query {
      feed {
        links {
          id
          description
          test
          TIFFAAAANNNNYYYYYYYYYY
          text {
            content
          }
        }
      }
    }
  `;
    const testError = { links: ['test', 'TIFFAAAANNNNYYYYYYYYYY'], text: ['content'] };
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

  it('5.6 - Return reformatted query where invalid fields are at 1st and 3rd levels of depth', () => {
    const testQuery = `
    query {
      feed {
        TIFFAAAANNNNYYYYYYYYYY
        links {
          id
          description
          text {
            TIFFAAAANNNNYYYYYYYYYY
          }
        }
      }
    }
  `;
    const testError = { feed: ['TIFFAAAANNNNYYYYYYYYYY'], text: ['TIFFAAAANNNNYYYYYYYYYY'] };
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

  it('5.7 - Return reformatted query where invalid fields are at 1st and 2nd levels of depth', () => {
    const testQuery = `
      query {
        feed {
          TIFFANNYYYY
          links {
            TIFFANNYYYY
            id
            description
            text {
              id
            }
          }
        }
      }
    `;
    const testError = {
      feed: ['TIFFANNYYYY'],
      links: ['TIFFANNYYYY']
    };
    const outputQuery = `
      query {
        feed {
          links {
            id
            description
            text {
              id
            }
          }
        }
      }
    `;
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

  it('5.8 - Return reformatted query where invalid fields are at 2nd & 3rd levels of depth stemming from different types at equivalent depth', () => {
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
          TIFFAAAANNNNYYYYYYYYYY
        }
      }
    }
  `;
    const testError = { test: ['name', 'nested'], text: ['TIFFAAAANNNNYYYYYYYYYY'] };
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
    const test = queryFormatter(testQuery);
    expect(test(testError)).toEqual(outputQuery);
  });

});

