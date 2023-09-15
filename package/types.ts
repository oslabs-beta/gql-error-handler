
//give errorArray object key type fields
export type ErrorMessage = {
  [key: string]: string[];
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
  [key: string] : any;
}

