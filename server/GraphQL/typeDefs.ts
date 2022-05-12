import { gql } from 'apollo-server-express';
const typeDefs = gql`
  type User {
    user_id: String
    name: String
    email: String
    profilepiclink: String
    googleid: String
  }
  type Query {
    currentUser: User
  }
  type Mutation {
    logout: Boolean
  }
`;
export default typeDefs;