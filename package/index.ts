// logic for error handling methods to be utilized in GraphQL API
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

// client will employ a single function specified by the package (higher order function) and within the package all of the lower level functionality will be executed through callbacks, abstracting away all of the functionality and complexity from the developer

const queryAdjusterPlugin = {
  requestDidStart(requestContext: RequestContextType) {
    const cacheSchema: CacheSchemaObject = {
      query: {},
      mutation: {},
    };
    const customTypes: CustomTypesObject = {};
    const typeFieldsCache: TypeFieldsCacheObject = {};

    const schema: GraphQLSchema = requestContext.schema as GraphQLSchema;

    const allTypes: any[] = Object.values(schema.getTypeMap());

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
          } else {
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
        }
      }
    });
    // console.log('customTypes:', customTypes);
    // console.log('cacheSchema:', cacheSchema);
    // console.log('typeFieldsCache:', typeFieldsCache);

    const resultQueryMapper = queryMapper(requestContext.request.query);
    // console.log('resultQueryMapper:', resultQueryMapper);

    const errorObj = compare(cacheSchema, resultQueryMapper);
    // console.log('GraphQL Query before:', requestContext.request.query);
    const queryFunc = queryFormatter(requestContext.request.query);
    requestContext.request.query = queryFunc(errorObj);
    // console.log('GraphQL Query after:', requestContext.request.query);

    return {
      async willSendResponse(requestContext: RequestContextType) {
        const { response } = requestContext;
        if (!response || !response.errors) {
          const errArray = errObjectParser(errorObj, typeFieldsCache);
          if (errArray.length > 0) response.errors = errArray;
        }
      },
    };
  },
};

module.exports = queryAdjusterPlugin;
