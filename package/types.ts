//give errorArray object key type fields
export type ErrorMessage = {
  [key: string]: string[];
};

export type queryObject = {
  [key: string]: object | string[];
};

export type TypeFieldsCache = {
  [key: string]: string;
};

export type GraphQLError = {
  message: string;
  locations: {
    line: number;
    column: number;
  }[];
  extensions: {
    code: string;
    exception: {
      stacktrace: string[];
    };
  };
};

export type GraphQLResponse = {
  error: {
    errors: GraphQLError[];
  };
};

export interface SchemaObj {
  [key: string]: any;
}

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

export type CacheSchemaObject = {
  [key: string]: {
    [field: string]: string | object;
  };
};

export type CustomTypesObject = {
  [key: string]: {
    [field: string]: string;
  };
};

export type TypeFieldsCacheObject = {
  [key: string]: string;
};
