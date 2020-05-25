const { GraphQLServer } = require("graphql-yoga");

const links = [
    {
        id: "link-0",
        url: "codeselfstudy.com",
        description: "a coding community",
    },
];

const idCount = links.length;

// The implementation is identical to the definition above.
// Resolvers receive 4 arguments, but not all need to be used.
const resolvers = {
    Query: {
        info: () => `This is the API of an HN clone`,
        feed: () => links,
    },
    Mutation: {
        post: (_parent, args) => {
            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            };
            links.push(link);
            return link;
        },
    },
    Link: {
        id: parent => parent.id,
        description: parent => parent.description,
        url: parent => parent.url,
    },
};

// The server is passed the schema and resolvers.
const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
});

server.start(() => console.log(`server is running on http://localhost:4000/`));

// - typeDefs
// - resolvers
// - context -- every resolver can read/write to this object
