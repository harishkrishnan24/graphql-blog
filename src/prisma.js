import { Prisma } from "prisma-binding";

const prisma = new Prisma({
	typeDefs: "src/generated/prisma.graphql",
	endpoint: "http://localhost:4466",
});

const createPostForUser = async (authorId, data) => {
	const post = await prisma.mutation.createPost(
		{
			data: {
				...data,
				author: {
					connect: {
						id: authorId,
					},
				},
			},
		},
		"{ id }"
	);
	const user = await prisma.query.user(
		{
			where: {
				id: authorId,
			},
		},
		"{ id name email posts { id title published }}"
	);
	return user;
};

// createPostForUser("ckac1rry60009084441n85jwm", {
// 	title: "React Native Course",
// 	body: "Udemy has best courses for it",
// 	published: true,
// }).then((user) => {
// 	console.log(JSON.stringify(user, undefined, 2));
// });
