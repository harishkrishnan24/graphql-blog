const Query = {
	me() {
		return {
			id: "123098",
			name: "Mike",
			email: "mike@example.com",
			age: 28,
		};
	},
	post() {
		return {
			id: "AK49",
			title: "asdasd",
			body: "sssss",
			published: true,
		};
	},
	users(parent, args, { prisma }, info) {
		const opArgs = {};

		if (args.query) {
			opArgs.where = {
				OR: [
					{
						name_contains: args.query,
					},
					{
						email_contains: args.query,
					},
				],
			};
		}

		return prisma.query.users(opArgs, info);
	},
	posts(parent, args, { prisma }, info) {
		const opArgs = {};

		if (args.query) {
			opArgs.where = {
				OR: [{ title_contains: args.query }, { body_contains: args.query }],
			};
		}

		return prisma.query.posts(opArgs, info);
	},
	comments(parent, args, { db }, info) {
		return db.comments;
	},
};

export { Query as default };
