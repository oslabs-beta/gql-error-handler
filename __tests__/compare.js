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

    expect(compare(testSchema, sampleQuery)).toEqual(errorObj);
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

  it('Return error object when invalid fields occur in two different levels of query depth', () => {

    const sampleQuery = {
      query: {
        characters: ['id', 'height', 'gender', 'jeremy', { films: ['title', 'director', 'sam'] }]
      }
    };

    const errorObj = {
      characters: ['jeremy'],
      films: ['sam']
    };

    expect(compare(testSchema, sampleQuery)).toEqual(errorObj);
  });

  it('Return error object when invalid fields occur in three different levels of query depth', () => {

    const sampleQuery = {
      query: {
        characters: ['id', 'height', 'gender', 'woobae', { films: ['title', 'director', 'sam', { characters: ['jeremy', 'height', 'name'] }] }]
      }
    };

    const errorObj = {
      characters: ['woobae', 'jeremy'],
      films: ['sam']
    };

    expect(compare(testSchema, sampleQuery)).toEqual(errorObj);
  });

  it('Return error object when invalid fields occur only in first level of query depth, despite query continuing to three levels of depth', () => {

    const sampleQuery = {
      query: {
        characters: ['id', 'height', 'gender', 'woobae', { films: ['title', 'director', { characters: ['height', 'name'] }] }]
      }
    };

    const errorObj = { characters: ['woobae'] };

    expect(compare(testSchema, sampleQuery)).toEqual(errorObj);
  });

  it('Return error object when invalid fields occur only in second level of query depth, despite query continuing to three levels of depth', () => {

    const sampleQuery = {
      query: {
        characters: ['id', 'height', 'gender', { films: ['title', 'director', 'woobae', { characters: ['height', 'name'] }] }]
      }
    };

    const errorObj = { films: ['woobae'] };

    expect(compare(testSchema, sampleQuery)).toEqual(errorObj);
  });

  it('Return error object when invalid fields occur only in third level of query depth', () => {

    const sampleQuery = {
      query: {
        characters: ['id', 'height', 'gender', { films: ['title', 'director', { characters: ['height', 'jeremy'] }] }]
      }
    };

    const errorObj = { characters: ['jeremy'] };

    expect(compare(testSchema, sampleQuery)).toEqual(errorObj);

  });

  it('Return error object when invalid fields occur only in third level of query depth', () => {

    const sampleQuery = {
      query: {
        characters: ['id', 'height', 'gender', { films: ['title', 'director', 'height', { characters: ['height'] }] }]
      }
    };

    const errorObj = { films: ['height'] };

    expect(compare(testSchema, sampleQuery)).toEqual(errorObj);

  });

});
