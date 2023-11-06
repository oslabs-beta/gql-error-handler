<div align="center">
  <img src="https://github.com/oslabs-beta/gql-error-handler/blob/main/assets/banner.png?raw=true">

---

</div>

[gql-error-handler](https://www.gql-error-handler.com) is an Apollo Server plugin that returns partial data upon validation errors in GraphQL.

## Features

**partialDataPlugin:** A Javascript function that reformulates queries that would otherwise be invalidated by removing invalid fields and allows developers to use partial data returned.

- Functionality is supported for queries and mutations with multiple root levels and nested fields up to 3 levels deep, including circular dependencies
- Implement core functionality through utilization of a single plugin in an `ApolloServer` instance

Before using our plugin, no data is returned due to validation errors:

<div>
  <img src="https://github.com/oslabs-beta/gql-error-handler/blob/main/assets/before.gif?raw=true">
</div>

After using our plugin, partial data is returned for all valid fields and a custom error message is added indicating which fields were problematic:

<div>
  <img src="https://github.com/oslabs-beta/gql-error-handler/blob/main/assets/after.gif?raw=true">
</div>

## Setup

- In your server file utilizing Apollo Server, import or require in `partialDataPlugin`
- At initialization of your instance of `ApolloServer`, list `partialDataPlugin` as an element in the array value of the `plugins` property

```javascript
const { ApolloServer } = require('apollo-server');
const partialDataPlugin = require('gql-error-handler');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [partialDataPlugin],
});
```

## Installation

```javascript
npm i gql-error-handler
```

## Future Considerations

- Extend handling of nested queries beyond three levels of depth
- Develop [GUI](https://github.com/gql-error-handler/gql-UI) to show logs of previous queries and server response
- Add authentication and other security measures
- Handle other types of errors in GraphQL

## Contributors

- **Jeremy Buron-Yi** | [LinkedIn](https://www.linkedin.com/in/jeremy-buronyi/) | [GitHub](https://github.com/JEF-BY)
- **Woobae Kim** | [LinkedIn](https://www.linkedin.com/in/woobaekim/) | [GitHub](https://github.com/woobaekim)
- **Samuel Ryder** | [LinkedIn](https://www.linkedin.com/in/samuelRyder/) | [GitHub](https://github.com/samryderE)
- **Tiffany Wong** | [LinkedIn](https://www.linkedin.com/in/tiffanywong149/) | [GitHub](https://github.com/twong-cs)
- **Nancy Yang** | [LinkedIn](https://www.linkedin.com/in/naixinyang/) | [GitHub](https://github.com/nancyynx88)

## License

_gql-error-handler is MIT licensed._

Thank you for using gql-error-handler. We hope that through the use of our plugin, your GraphQL user experience is optimized. Should you encounter any issues during implementation or require further information, please reach out to us for assistance.
