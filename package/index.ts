// logic for error handling methods to be utilized in GraphQL API
const compare = require('./ASTtraverse');
const queryMapper = require('./queryMapper');
const queryFormatter = require('./queryFormatter');
const errObjectParser = require('./errObjectParser');

const errorHandlers = {};

// client will employ a single function specified by the package (higher order function) and within the package all of the lower level functionality will be executed through callbacks, abstracting away all of the functionality and complexity from the developer

const queryAdjusterPlugin = {
  requestDidStart(requestContext: any) {
    const schema = requestContext.schema;
    const cacheSchema: any = {
      query: {},
      mutation: {},
    };
    const customTypes: any = {};
    const typeFieldsCache: any = {};

    const allTypes: any = Object.values(schema.getTypeMap());

    allTypes.forEach((type: any) => {
      if (type && type.constructor.name === 'GraphQLObjectType') {
        if (type.name[0] !== '_') {
          if (type.name !== 'Query' && type.name !== 'Mutation') {
            customTypes[type.name] = {};
            const fields: any = type.getFields();
            Object.values(fields).forEach((field: any) => {
              customTypes[type.name][field.name] = field.type.toString();
            });
          } else {
            const fields = type.getFields();
            Object.values(fields).forEach((field: any) => {
              let fieldType = field.type.toString();
              if (fieldType[0] === '[') {
                fieldType = fieldType.slice(1, fieldType.length - 1);
                typeFieldsCache[field.name] = fieldType;
              }
              cacheSchema[type.name.toLowerCase()][field.name] =
                customTypes[fieldType];
            });
          }
        }
      }
    });
    console.log('customTypes:', customTypes);
    console.log('cacheSchema:', cacheSchema);
    console.log('typeFieldsCache:', typeFieldsCache);

    const resultQuerryMapper = queryMapper(requestContext.request.query);
    console.log('resultQuerryMapper:', resultQuerryMapper);

    const errorObj = compare(cacheSchema, resultQuerryMapper);
    console.log('ERROROBJ:', errorObj);
    console.log('GraphQL Query before:', requestContext.request.query);
    const queryFunc = queryFormatter(requestContext.request.query);
    requestContext.request.query = queryFunc(errorObj);
    console.log('GraphQL Query after:', requestContext.request.query);

    return {
      async willSendResponse(requestContext: any) {
        const { response } = requestContext;
        if (!response || !response.errors) {
          const errArray = errObjectParser(errorObj, typeFieldsCache);
          if (errArray.length > 0) response.errors = errArray;
          console.log('response.errors:', errArray);
          // console.log('Final Response without Errors:', response);
        }
      },
    };
  },
};

module.exports = errorHandlers;
