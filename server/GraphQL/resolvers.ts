const resolvers = {
    Query: {
      currentUser: (parent, args, context) => {context.getUser()
      console.log("Resolvers: ", context.getUser())},
    },
    Mutation: {
      logout: (parent, args, context) => context.logout(),
    },
  };
  export default resolvers;