// object type containing invalid fields
export type ErrorMessage = {
  [key: string]: string[];
};

// object type representing original query where keys are types and values are an array of fields
export type queryObject = {
  [key: string]: object | string[];
};

// object type representing requestContext parameter in Apollo Server events
export type RequestContextType = {
  logger: object;
  schema: { getTypeMap: () => any };
  schemaHash: string;
  request: {
    query: string;
  };
  response: ResponseType;
  context: object;
  cache: object;
  debug: boolean;
  metrics: object;
  overallCachePolicy: object;
  requestIsBatched: boolean;
};

type ResponseType = {
  errors: any[];
};

// object type representing schema as captured from requestContext object
export type CacheSchemaObject = {
  [key: string]: {
    [field: string]: any;
  };
};

// object type representing custom types as captured from requestContext object
// utilized in populating CacheSchemaObject
export type CustomTypesObject = {
  [key: string]: {
    [field: string]: any;
  };
};

// object type mapping custom types to their corresponding field names as captured from requestContext object
export type TypeFieldsCacheObject = {
  [key: string]: string;
};
