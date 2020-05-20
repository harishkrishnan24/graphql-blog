import { Prisma } from "prisma-binding";

const prisma = new Prisma({
	typeDefs: "src/generated/prisma.graphql",
	endpoint: "http://localhost:4466",
});

// prisma.exists
// 	.Comment({
// 		id: "abc123",
// 	})
// 	.then((exists) => {
// 		console.log(exists);
// 	});

const createPostForUser = async (authorId, data) => {
	const userExists = await prisma.exists.User({ id: authorId });
	if (!userExists) {
		throw new Error("User not found!");
	}
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
		"{ author { id name email posts { id title published }} }"
	);
	return post.author;
};

// createPostForUser("ckac1rry60009084441n85jwm", {
// 	title: "React Native Course v2",
// 	body: "Udemy has best courses for it",
// 	published: true,
// })
// 	.then((user) => {
// 		console.log(JSON.stringify(user, undefined, 2));
// 	})
// 	.catch((error) => {
// 		console.log(error.message);
// 	});
