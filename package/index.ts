const compare = require('./compare');
const queryMapper = require('./queryMapper');
const queryFormatter = require('./queryFormatter');
const errObjectParser = require('./errObjectParser');

import { GraphQLSchema } from 'graphql';
import type {
  RequestContextType,
  CacheSchemaObject,
  CustomTypesObject,
  TypeFieldsCacheObject,
} from './types';

// plugin to be utilized in an instance of Apollo Server

const partialDataPlugin = {
  requestDidStart(requestContext: RequestContextType) {
    const cacheSchema: CacheSchemaObject = {
      query: {},
      mutation: {},
    };
    const customTypes: CustomTypesObject = {};
    const typeFieldsCache: TypeFieldsCacheObject = {};
    const scalarTypes: string[] = [
      'ID',
      'ID!',
      'String',
      'String!',
      'Int',
      'Int!',
      'Boolean',
      'Boolean!',
      'Float',
      'Float!',
    ];
    const schema: GraphQLSchema = requestContext.schema as GraphQLSchema;

    const allTypes: any[] = Object.values(schema.getTypeMap());

    // Populating customTypes object to be utilized inside cacheSchema object

    allTypes.forEach((type: { name: string; getFields: () => any }) => {
      if (type && type.constructor.name === 'GraphQLObjectType') {
        if (type.name[0] !== '_') {
          if (type.name !== 'Query' && type.name !== 'Mutation') {
            customTypes[type.name] = {};
            const fields: object = type.getFields();
            Object.values(fields).forEach(
              (field: { name: string; type: string }) => {
                customTypes[type.name][field.name] = field.type.toString();
              }
            );
          }
        }
      }
    });

    // Establishing deep copies of customTypes within cacheSchema,
    // effectively creating pointers from cacheSchema to differing properties within the customTypes object
    // in order to later on compare incoming nested queries with the cacheSchema object for reconciliation

    allTypes.forEach((type: { name: string; getFields: () => any }) => {
      if (type.name === 'Query' || type.name === 'Mutation') {
        const fields: object = type.getFields();
        Object.values(fields).forEach(
          (field: { name: string; type: string }) => {
            let fieldType = field.type.toString();
            if (fieldType[0] === '[') {
              fieldType = fieldType.slice(1, fieldType.length - 1);
              typeFieldsCache[field.name] = fieldType;
            }
            cacheSchema[type.name.toLowerCase()][field.name] =
              customTypes[fieldType];
          }
        );
      }
    });

    // helper function to apply regex and create shallow copies of custom type reference

    function shallowCopy(prop: string) {
      if (!scalarTypes.includes(prop)) {
        const propRegEx = prop.replace(/[^a-zA-Z]/g, '');
        return JSON.parse(JSON.stringify(customTypes[propRegEx]));
      }
      return prop;
    }

    // helper function to nest shallow copies

    function nest(nestedProps: Record<string, any>) {
      for (const nestedProp in nestedProps) {
        if (
          typeof nestedProps[nestedProp] === 'string' &&
          !scalarTypes.includes(nestedProps[nestedProp])
        ) {
          nestedProps[nestedProp] = shallowCopy(nestedProps[nestedProp]);
        }
      }
      return nestedProps;
    }

    // create nested levels of custom types to be referred to by cacheSchema for functionality regarding nested queries
    // using shallowCopy and nest helper procedures

    for (const customType in customTypes) {
      for (const prop in customTypes[customType]) {
        customTypes[customType][prop] = shallowCopy(
          customTypes[customType][prop]
        );
        if (typeof customTypes[customType][prop] === 'object') {
          customTypes[customType][prop] = nest(customTypes[customType][prop]);
        }
      }
    }

    const resultQueryMapper = queryMapper(requestContext.request.query);
    const errorObj = compare(cacheSchema, resultQueryMapper);
    const queryFunc = queryFormatter(requestContext.request.query);
    requestContext.request.query = queryFunc(errorObj);

    return {
      async willSendResponse(requestContext: RequestContextType) {
        const { response } = requestContext;

        // add custom error message if invalid fields were present in original query

        if (!response || !response.errors) {
          const errArray = errObjectParser(errorObj, typeFieldsCache);
          if (errArray.length > 0) response.errors = errArray;
        }
      },
    };
  },
};

module.exports = partialDataPlugin;
