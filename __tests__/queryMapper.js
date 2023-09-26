const queryMapper = require('../package/queryMapper1.js');

describe('queryMapper tests', () => {
  it('1.1 - Returns an object with invalid fields (1 level)', () => {
    const testQuery = `
        query {
          feed {
            id
            tiffany
          } 
        }
      `;
    const test = queryMapper(testQuery);
    expect(test).toEqual({ query: { feed: ['id', 'tiffany'] } });
  });

  it('1.2 - Returns an object with invalid fields (2 levels)', () => {
    const testQuery = `
        query {
          feed {
            id
            tiffany
            links {
                id
                description
                tiffany2
            }
          } 
        }
      `;
    const test = queryMapper(testQuery);
    expect(test).toEqual({
      query: {
        feed: ['id', 'tiffany', { links: ['id', 'description', 'tiffany2'] }],
      },
    });
  });

  it('1.3 - Returns an object with invalid fields (3 levels, circular)', () => {
    const testQuery = `
        query {
            feed {
            id
            tiffany
            links {
                id
                description
                tiffany2
                feed {
                    name
                    tiffany3
                }
            } 
          }
        }
      `;
    const test = queryMapper(testQuery);
    expect(test).toEqual({
      query: {
        feed: [
          'id',
          'tiffany',
          {
            links: [
              'id',
              'description',
              'tiffany2',
              { feed: ['name', 'tiffany3'] },
            ],
          },
        ],
      },
    });
  });

  it('1.4 - Returns an object with only one invalid fields, and no valid field on 3rd level', () => {
    const testQuery = `
        query {
          feed {
            id
            tiffany
            links {
                id
                description
                tiffany2
                feed {
                  tiffany3
                }
            }
          } 
        }
      `;
    const test = queryMapper(testQuery);
    expect(test).toEqual({
      query: {
        feed: ['id', 'tiffany', { links: ['id', 'description', 'tiffany2', {feed: ['tiffany3']}] }],
      },
    });
  });
  it('2.1 - has sibling on the 2nd level', () => {
    const testQuery = `
        query {
          feed {
            id
            tiffany
            links {
                id
                description
                tiffany2
            }
            feed {
              tiffany3
            }
          } 
        }
      `;
    const test = queryMapper(testQuery);
    expect(test).toEqual({
      query: {
        feed: ['id', 'tiffany', { links: ['id', 'description', 'tiffany2'] }, { feed: ['tiffany3'] } ],
      },
    });
  });
  it('2.2 - has sibling on the 3rd level', () => {
    const testQuery = `
        query {
          feed {
            id
            tiffany
            links {
                id
                description
                tiffany2
                feed {
                  tiffany3
                }
                links {
                  id
                }
            }
            
          } 
        }
      `;
    const test = queryMapper(testQuery);
    expect(test).toEqual({
      query: {
        feed: ['id', 'tiffany', { links: ['id', 'description', 'tiffany2', {feed: ['tiffany3']}, {links: ['id']}] }],
      },
    });
  });

  it('2.3 - has sibling on the 1st level', () => {
    const testQuery = `
        query {
          test {
            id
            description
        } 
          feed {
            id
            tiffany
            links {
                id
                description
                tiffany2
                feed {
                  tiffany3
                }
            }
          }
        }
      `;
    const test = queryMapper(testQuery);
    expect(test).toEqual({
      query: {
        test: ['id', 'description'],
        feed: ['id', 'tiffany', { links: ['id', 'description', 'tiffany2', { feed: ['tiffany3'] }] } ],
      },
    });
  });
});
