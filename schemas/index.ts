import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    id: Int
    email: String
    token: String
  }
  type Query {
    users: User
  }
  type MutationResponse {
    success: Boolean!
    message: String
    email: String
    id: Int
  }
  type Mutation {
    registerUser(
      email: String
      password: String
      cpassword: String
    ): MutationResponse
    login(email: String, password: String): MutationResponse
  }
`;
