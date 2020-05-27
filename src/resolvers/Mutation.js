const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { getUserId } = require("../utils");

// from .env
const APP_SECRET =
    process.env.APP_SECRET || crypto.randomBytes(32).toString("hex");

async function signup(_parent, args, context, _info) {
    const hashedPassword = await bcrypt.hash(args.password, 10);
    const { password, ...user } = await context.prisma.createUser({
        ...args,
        password: hashedPassword,
    });

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

async function login(_parent, args, context, _info) {
    const { password, ...user } = await context.prisma.user({
        email: args.email,
    });
    if (!user) {
        throw new Error("No such user found");
    }

    const valid = await bcrypt.compare(args.password, password);
    if (!valid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user,
    };
}

function post(_parent, args, context, _info) {
    const userId = getUserId(context);
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId } },
    });
}

module.exports = {
    signup,
    login,
    post,
};
