// logic for error handling methods to be utilized in GraphQL developers' resolver files

const errorHandlers = {};

// client will employ a single function specified by the package (higher order function) and within the package all of the lower level functionality will be executed through callbacks, abstracting away all of the functionality and complexity from the developer

// intercept original query
// cache original query
// return query and send it to query parser
// get error response from query parser on fail
// identify type of error (classification)
// perform specific string parsing (based on classification of error)
// (various methods of string parsing needed here based on error classification)
// based on this parse of error message, reformat the original querry in the cache
// send reformulated querry back to the querry parser for validation (expecting that it will execute)
// intercept the data response from the DB and then add the original error message (or some portion of it) to the data object to be finally sent to the client

module.exports = errorHandlers;