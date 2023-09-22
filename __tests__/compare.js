const compare = require('../package/compare.js');

describe('compare tests', () => {

  const testSchema = {
    query: {
      characters: {
        id: 'ID',
        name: 'String',
        height: 'Int',
        gender: 'String',
        birthYear: 'String',
        eyeColor: 'String',
        skinColor: 'String',
        hairColor: 'String',
        mass: 'String',
        films: '[Film]'
      },
      films: {
        id: 'ID',
        title: 'String',
        director: 'String',
        releaseDate: 'String',
        characters: '[Character]'
      }
    },
    mutation: {
      createCharacter: {
        id: 'ID',
        name: 'String',
        height: 'Int',
        gender: 'String',
        birthYear: 'String',
        eyeColor: 'String',
        skinColor: 'String',
        hairColor: 'String',
        mass: 'String',
        films: '[Film]'
      }
    }
  };

  it('The sample query is valid and the error object is an empty object', () => {

    const sampleQuery = {
      query: {
        characters: ['id', 'height', 'gender']
      }
    };

    const errorObj = {};

    expect(compare(testSchema, sampleQuery).toEqual(errorObj));
  });

  it('Return error object with type properties whose value is an array with invalid field strings on query type', () => {

    const sampleQuery = {
      query: {
        characters: ['id', 'height', 'gender', 'woobae']
      }
    };

    const errorObj = { characters: ['woobae'] };

    expect(compare(testSchema, sampleQuery)).toEqual(errorObj);
  });

  it('Return error object with type properties whose value is an array with invalid field strings on mutation type', () => {

    const sampleQuery = {
      mutation: {
        createCharacter: {

        }
      }
    }

  })

});
