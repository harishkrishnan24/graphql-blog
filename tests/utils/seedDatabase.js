import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

const userOne = {
	input: {
		name: "John",
		email: "john@test.com",
		password: bcrypt.hashSync("12345678"),
	},
	user: undefined,
	jwt: undefined,
};

const seedDatabase = async () => {
	await prisma.mutation.deleteManyPosts();
	await prisma.mutation.deleteManyUsers();

	userOne.user = await prisma.mutation.createUser({
		data: userOne.input,
	});
	userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

	await prisma.mutation.createPost({
		data: {
			title: "Test post",
			body: "",
			published: true,
			author: {
				connect: {
					id: userOne.user.id,
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
					id: userOne.user.id,
				},
			},
		},
	});
};

export { seedDatabase as default, userOne };
