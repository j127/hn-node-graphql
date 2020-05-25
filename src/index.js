const { GraphQLServer } = require("graphql-yoga");

let links = [
    {
        id: "link-0",
        url: "codeselfstudy.com",
        description: "a coding community",
    },
];

let idCount = links.length;

// The implementation is identical to the definition above.
// Resolvers receive 4 arguments, but not all need to be used.
const resolvers = {
    Query: {
        info: () => `This is the API of an HN clone`,
        feed: () => links,
        link: (_parent, args) => links.find(ln => ln.id === args.id),
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
        updateLink: (_parent, args) => {
            const idx = links.findIndex(ln => ln.id === args.id);
            // don't allow changing the ID
            links[idx] = { ...links[idx], ...args, id: links[idx].id };
        },
        deleteLink: (_parent, args) => {
            const idx = links.findIndex(ln => ln.id === args.id);
            links.splice(idx, 1);
        },
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
