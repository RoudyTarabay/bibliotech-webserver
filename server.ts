import express from "express";
// import schema from "./schemas";
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schemas";
import UserRegistrationAPI from "./datasources/UserRegistration";
import { resolvers } from "./resolvers";
// app.use(
//   "/graphql",
//   expressGraphQL({
//     schema: schema,
//     graphiql: true,
//   })
// );'
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    userRegistrationAPI: new UserRegistrationAPI(),
  }),
});

server.listen().then(({ url }) => {
  console.log("Server Running");
});
