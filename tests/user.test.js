import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import bcyrpt from "bcryptjs";
import prisma from "../src/prisma";

const client = new ApolloBoost({
	uri: "http://localhost:4000",
});

beforeAll(async () => {
	await prisma.mutation.deleteManyPosts();
	await prisma.mutation.deleteManyUsers();
	const user = await prisma.mutation.createUser({
		data: {
			name: "John",
			email: "john@test.com",
			password: bcyrpt.hashSync("12345678"),
		},
	});
	await prisma.mutation.createPost({
		data: {
			title: "Test post",
			body: "",
			published: true,
			author: {
				connect: {
					id: user.id,
				},
			},
		},
	});
	await prisma.mutation.createPost({
		data: {
			title: "Test post 2 (Draft)",
			body: "",
			published: false,
			author: {
				connect: {
					id: user.id,
				},
			},
		},
	});
}, 10000);

test("Should create a new user", async () => {
	const createUser = gql`
		mutation {
			createUser(
				data: { name: "Harish", email: "harish@test.com", password: "12345678" }
			) {
				token
				user {
					id
				}
			}
		}
	`;

	const response = await client.mutate({
		mutation: createUser,
	});

	const exists = await prisma.exists.User({
		id: response.data.createUser.user.id,
	});

	expect(exists).toBe(true);
});

test("Should expose public author profiles", async () => {
	const getUsers = gql`
		query {
			users {
				id
				name
				email
			}
		}
	`;

	const response = await client.query({ query: getUsers });

	expect(response.data.users.length).toBe(2);
	expect(response.data.users[0].email).toBe(null);
	expect(response.data.users[0].name).toBe("John");
});

test("Should expose published posts", async () => {
	const getPosts = gql`
		query {
			posts {
				id
				title
				body
				published
			}
		}
	`;

	const response = await client.query({ query: getPosts });

	expect(response.data.posts.length).toBe(1);
	expect(response.data.posts[0].published).toBe(true);
});

test("Should not login with bad credentials", async () => {
	const login = gql`
		mutation {
			login(data: { email: "harsh@test.com", password: "!23456675555" }) {
				token
			}
		}
	`;
	await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

test("Should not signup user with invalid password", async () => {
	const createUser = gql`
		mutation {
			createUser(
				data: { name: "Harish", email: "harish@test.com", password: "123" }
			) {
				token
				user {
					id
				}
			}
		}
	`;
	await expect(client.mutate({ mutation: createUser })).rejects.toThrow();
});
