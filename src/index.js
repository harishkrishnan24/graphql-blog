import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import Subscription from "./resolvers/Subscription";
import prisma from "./prisma";

const pubSub = new PubSub();

const server = new GraphQLServer({
	typeDefs: "./src/schema.graphql",
	resolvers: {
		Query,
		Mutation,
		Subscription,
		User,
		Post,
		Comment,
	},
	context: {
		db,
		pubSub,
		prisma,
	},
});

server.start(() => {
	console.log("The server is up!");
});
