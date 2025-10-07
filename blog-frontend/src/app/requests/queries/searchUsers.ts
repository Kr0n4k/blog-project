import { gql } from "@apollo/client";

export const SEARCH_USERS = gql`
  query SearchUsers($query: String!, $limit: Int, $offset: Int) {
    searchUsers(query: $query, limit: $limit, offset: $offset) {
      id
      userName
      firstName
      lastName
      avatar
      bio
      createdAt
    }
  }
`;
