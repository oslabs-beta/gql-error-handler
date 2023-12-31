"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var compare = require('./compare');
var queryMapper = require('./queryMapper');
var queryFormatter = require('./queryFormatter');
var errObjectParser = require('./errObjectParser');
// plugin to be utilized in an instance of Apollo Server
var partialDataPlugin = {
    requestDidStart: function (requestContext) {
        var cacheSchema = {
            query: {},
            mutation: {},
        };
        var customTypes = {};
        var typeFieldsCache = {};
        var scalarTypes = [
            'ID',
            'ID!',
            'String',
            'String!',
            'Int',
            'Int!',
            'Boolean',
            'Boolean!',
            'Float',
            'Float!',
        ];
        var schema = requestContext.schema;
        var allTypes = Object.values(schema.getTypeMap());
        // Populating customTypes object to be utilized inside cacheSchema object
        allTypes.forEach(function (type) {
            if (type && type.constructor.name === 'GraphQLObjectType') {
                if (type.name[0] !== '_') {
                    if (type.name !== 'Query' && type.name !== 'Mutation') {
                        customTypes[type.name] = {};
                        var fields = type.getFields();
                        Object.values(fields).forEach(function (field) {
                            customTypes[type.name][field.name] = field.type.toString();
                        });
                    }
                }
            }
        });
        // Establishing deep copies of customTypes within cacheSchema,
        // effectively creating pointers from cacheSchema to differing properties within the customTypes object
        // in order to later on compare incoming nested queries with the cacheSchema object for reconciliation
        allTypes.forEach(function (type) {
            if (type.name === 'Query' || type.name === 'Mutation') {
                var fields = type.getFields();
                Object.values(fields).forEach(function (field) {
                    var fieldType = field.type.toString();
                    if (fieldType[0] === '[') {
                        fieldType = fieldType.slice(1, fieldType.length - 1);
                        typeFieldsCache[field.name] = fieldType;
                    }
                    cacheSchema[type.name.toLowerCase()][field.name] =
                        customTypes[fieldType];
                });
            }
        });
        // helper function to apply regex and create shallow copies of custom type reference
        function shallowCopy(prop) {
            if (!scalarTypes.includes(prop)) {
                var propRegEx = prop.replace(/[^a-zA-Z]/g, '');
                return JSON.parse(JSON.stringify(customTypes[propRegEx]));
            }
            return prop;
        }
        // helper function to nest shallow copies
        function nest(nestedProps) {
            for (var nestedProp in nestedProps) {
                if (typeof nestedProps[nestedProp] === 'string' &&
                    !scalarTypes.includes(nestedProps[nestedProp])) {
                    nestedProps[nestedProp] = shallowCopy(nestedProps[nestedProp]);
                }
            }
            return nestedProps;
        }
        // create nested levels of custom types to be referred to by cacheSchema for functionality regarding nested queries
        // using shallowCopy and nest helper procedures
        for (var customType in customTypes) {
            for (var prop in customTypes[customType]) {
                customTypes[customType][prop] = shallowCopy(customTypes[customType][prop]);
                if (typeof customTypes[customType][prop] === 'object') {
                    customTypes[customType][prop] = nest(customTypes[customType][prop]);
                }
            }
        }
        var resultQueryMapper = queryMapper(requestContext.request.query);
        var errorObj = compare(cacheSchema, resultQueryMapper);
        var queryFunc = queryFormatter(requestContext.request.query);
        requestContext.request.query = queryFunc(errorObj);
        return {
            willSendResponse: function (requestContext) {
                return __awaiter(this, void 0, void 0, function () {
                    var response, errArray;
                    return __generator(this, function (_a) {
                        response = requestContext.response;
                        // add custom error message if invalid fields were present in original query
                        if (!response || !response.errors) {
                            errArray = errObjectParser(errorObj, typeFieldsCache);
                            if (errArray.length > 0)
                                response.errors = errArray;
                        }
                        return [2 /*return*/];
                    });
                });
            },
        };
    },
};
module.exports = partialDataPlugin;
