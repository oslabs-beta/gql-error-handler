// const { gql } = require('graphql');
const { gql } = require('apollo-server');

const typeDefs = gql`
  type Character {
    id: ID
    name: String
    height: Int
    gender: String
    birthYear: String
    eyeColor: String
    skinColor: String
    hairColor: String
    mass: String
    films: [Film]
  }

  type Film {
    id: ID
    title: String
    director: String
    releaseDate: String
    characters: [Character]
  }

  type Query {
    characters(id: ID): [Character]
    films: [Film]
  }

  type Mutation {
    createCharacter(
      name: String
      height: Int
      gender: String
      birthYear: String
      eyeColor: String
      skinColor: String
      hairColor: String
      mass: String
    ): Character
  }
`;

module.exports = typeDefs;

/* { query: { 'character': ['name', 'test', { 'films': ['title'] } ], 'films': ['title'] },
  mutation: { 'createCharacter': ['name', 'height', 'gender' ] } } */