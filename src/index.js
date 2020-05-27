require("dotenv").config();
const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");

const resolvers = {
    Query,
    Mutation,
    User,
    Link,
};

// The server is passed the schema and resolvers.
const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: request => {
        return {
            ...request,
            prisma,
        };
    }, // this allows you to do `context.prisma` in the resolvers
});

server.start(() => console.log(`server is running on http://localhost:4000/`));

// - typeDefs
// - resolvers
// - context -- every resolver can read/write to this object. It's a way for resolvers to communicate. You can also pass arbitrary data to it when the GraphQL server is initialized with `new GraphQLServer`.
