function feed(_parent, _args, context, _info) {
    return context.prisma.links();
}

module.exports = { feed };
