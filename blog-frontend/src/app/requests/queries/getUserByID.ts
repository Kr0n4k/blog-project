// getUserByID.ts
import { gql } from "@apollo/client";

export const getUserByID = gql`
  query FindUserByID($id: String!) {
    findUserByID(id: $id) {
      id
      firstName
      lastName,
      userName
      email
      avatar
      bio
      createdAt
    }
  }
`;