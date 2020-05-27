const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

// The implementation is identical to the definition above.
// Resolvers receive 4 arguments, but not all need to be used.
const resolvers = {
    Query: {
        info: () => `This is the API of an HN clone`,
        // `context.prisma` is a `Prisma` client instance
        feed: (_root, _args, context, _info) => context.prisma.links(),
        // link: (_parent, args) => links.find(ln => ln.id === args.id),
    },
    Mutation: {
        post: (_root, args, context) => {
            // `createLink` is auto-generated from the schema
            return context.prisma.createLink({
                url: args.url,
                description: args.description,
            });
        },
        // updateLink: (_parent, args) => {
        //     const idx = links.findIndex(ln => ln.id === args.id);
        //     // don't allow changing the ID
        //     links[idx] = { ...links[idx], ...args, id: links[idx].id };
        // },
        // deleteLink: (_parent, args) => {
        //     const idx = links.findIndex(ln => ln.id === args.id);
        //     links.splice(idx, 1);
        // },
    },
};

// The server is passed the schema and resolvers.
const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: { prisma }, // this allows you to do `context.prisma` in the resolvers
});

server.start(() => console.log(`server is running on http://localhost:4000/`));

// - typeDefs
// - resolvers
// - context -- every resolver can read/write to this object. It's a way for resolvers to communicate. You can also pass arbitrary data to it when the GraphQL server is initialized with `new GraphQLServer`.
