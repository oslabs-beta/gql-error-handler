//give errorArray object key type fields
export type ErrorMessage = {
  [key: string]: string[];
};

export type TypeFieldsCache = {
  [key: string]: string;
};

// WHAT? WHAT IS HAPPENING IN HERE!!!!
// I SEE CODE HAS SPONTANEOUSLY MANIFESTED ITSELF! HOW????????????
// TIFFANY, STEP AWAY FROM THE KEYBOARD. I REPEAT, STEP AWAY FROM THE KEYBOARD

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
