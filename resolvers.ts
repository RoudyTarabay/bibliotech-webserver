export const resolvers = {
  Query: {},
  Mutation: {
    registerUser: (_, { email, password, cpassword }, { dataSources }) => {
      const response = dataSources.userRegistrationAPI.insert(
        email,
        password,
        cpassword
      );
      return response;
    },
    login: (_, { email, password }, { dataSources }) => {
      const response = dataSources.userRegistrationAPI.login(email, password);
      return response;
    },
  },
};
