// import schema from "./schemas";
import { ApolloServer, ApolloError } from "apollo-server";
import { typeDefs } from "./schemas";
import UserRegistrationAPI from "./datasources/UserRegistration";
import { resolvers } from "./resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    userRegistrationAPI: new UserRegistrationAPI(),
  }),
  formatError: (err) => {
    if (err.extensions.isManuallyThrown) return err;
    else new ApolloError("An error occured", err.extensions.code);
  },
});

server.listen().then(() => {
  // console.log("Server Running");
});
