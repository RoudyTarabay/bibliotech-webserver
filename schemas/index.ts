import { gql } from "apollo-server";

export const typeDefs = gql`
  type Users {
    id: Int
  }
  type Query {
    user: Users
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
  }
`;
