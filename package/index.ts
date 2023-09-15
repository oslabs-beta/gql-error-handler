// logic for error handling methods to be utilized in GraphQL API

const errorHandlers = {};

// client will employ a single function specified by the package (higher order function) and within the package all of the lower level functionality will be executed through callbacks, abstracting away all of the functionality and complexity from the developer

const queryAdjusterPlugin = {
  requestDidStart(requestContext) {
    const schema = requestContext.schema;
    const cacheSchema = {
      query: {},
      mutation: {},
    };
    const customTypes = {};
    const typeFieldsCache = {};

    const allTypes = Object.values(schema.getTypeMap());

    allTypes.forEach((type) => {
      if (type && type.constructor.name === 'GraphQLObjectType') {
        if (type.name[0] !== '_') {
          if (type.name !== 'Query' && type.name !== 'Mutation') {
            customTypes[type.name] = {};
            const fields = type.getFields();
            Object.values(fields).forEach((field) => {
              customTypes[type.name][field.name] = field.type.toString();
            });
          } else {
            const fields = type.getFields();
            Object.values(fields).forEach((field) => {
              let fieldType = field.type.toString();
              if (fieldType[0] === '[') {
                fieldType = fieldType.slice(1, fieldType.length - 1);
                // populate typeFieldsCache
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
    // const errorObj = {};
    console.log('ERROROBJ:', errorObj);
    console.log('GraphQL Query before:', requestContext.request.query);
    const queryFunc = queryFormatter(requestContext.request.query);
    requestContext.request.query = queryFunc(errorObj);
    console.log('GraphQL Query after:', requestContext.request.query);

    return {
      async willSendResponse(requestContext) {
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

// CHALLENGES, YAAAAYYYYY!!!!!
// we will not be importing apollo library into our package
// at which stage, how do we intercept the query
// how do we send the refactored query back to the query parser
// Check how seniors examined the query in their project ShieldQL
// Each function above will have its own file in the file system

module.exports = errorHandlers;
