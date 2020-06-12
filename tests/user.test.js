import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import seedDatabase, { userOne } from "./utils/seedDatabase";
import getClient from "./utils/getClient";
import { createUser, login, getUsers, getProfile } from "./utils/operations";

const client = getClient();

beforeAll(seedDatabase, 10000);

test("Should create a new user", async () => {
	const variables = {
		data: {
			name: "Harish",
			email: "harish@test.com",
			password: "12345678",
		},
	};

	const response = await client.mutate({
		mutation: createUser,
		variables,
	});

	const exists = await prisma.exists.User({
		id: response.data.createUser.user.id,
	});

	expect(exists).toBe(true);
});

test("Should expose public author profiles", async () => {
	const response = await client.query({ query: getUsers });

	expect(response.data.users.length).toBe(2);
	expect(response.data.users[0].email).toBe(null);
	expect(response.data.users[0].name).toBe("John");
});

test("Should not login with bad credentials", async () => {
	const variables = {
		data: {
			email: "harish@test.com",
			password: "1234",
		},
	};
	await expect(client.mutate({ mutation: login, variables })).rejects.toThrow();
});

test("Should not signup user with invalid password", async () => {
	const variables = {
		data: { name: "Harish", email: "harish@test.com", password: "123" },
	};
	await expect(
		client.mutate({ mutation: createUser, variables })
	).rejects.toThrow();
});

test("Should fetch user profile", async () => {
	const client = getClient(userOne.jwt);

	const { data } = await client.query({ query: getProfile });

	expect(data.me.id).toBe(userOne.user.id);
	expect(data.me.name).toBe(userOne.user.name);
	expect(data.me.email).toBe(userOne.user.email);
});
