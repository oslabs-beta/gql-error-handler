// queryFormatter.ts
// one func, query manipulation (closure) {input is query, output is function(formatter{output is sanitized query})}
// intercept original query
// cache original query (or simply assign to const if we pass query on to query parser within scope of current function)
// send it to query parser
// returned function {input is all fields returned by func errorParser.ts (array of strings), output refactored query} would refactor the query after receiving error object (as argument)
// if no error object, should just return the query (do nothing)

// based on this parse of error message, reformat the original querry in the cache (this is the returned function on LINE 6)
