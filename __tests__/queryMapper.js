const queryMapper = require('../package/queryMapper.js');

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
});
