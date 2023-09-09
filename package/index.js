// logic for error handling methods to be utilized in GraphQL API

const errorHandlers = {};

// client will employ a single function specified by the package (higher order function) and within the package all of the lower level functionality will be executed through callbacks, abstracting away all of the functionality and complexity from the developer

// one func, query manipulation (closure) {input is query, output is function(formatter{output is sanitized query})}
// intercept original query
// cache original query (or simply assign to const if we pass query on to query parser within scope of current function)
// send it to query parser
// returned function {input is all fields returned by func LINE 14 (array of strings), output refactored query} would refactor the query after receiving error object (as argument)
// if no error object, should just return the query (do nothing)

// identify type of error, error manipulation (classification) {input will be error message, output will be array of unvalidated fields}
// object on file as library for all error classifications (key will be regular expression of different error message strings, value will be the string manipulation method needed to parse the error message string)
// take error message from error, compare within classification object
// parse error message with string manip. method to extract faulty field labels

// based on this parse of error message, reformat the original querry in the cache (this is the returned function on LINE 11)

// send reformulated querry back to the querry parser for validation (expecting that it will execute)

// intercept the data response from the DB and then add the original error message (or some portion of it) to the data object to be finally sent to the client

// CHALLENGES, YAAAAYYYYY!!!!!
// we will not be importing apollo library into our package
// at which stage, how do we intercept the query
// how do we send the refactored query back to the query parser
// Check how seniors examined the query in their project ShieldQL
// Each function above will have its own file in the file system

module.exports = errorHandlers;