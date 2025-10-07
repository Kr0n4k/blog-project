import { gql } from "@apollo/client";

export const SEARCH_POSTS = gql`
  query SearchPosts($query: String!, $limit: Int, $offset: Int) {
    searchPosts(query: $query, limit: $limit, offset: $offset) {
      id
      title
      text
      userId
      videos
      photos
      createdAt
      user {
        id
        userName
        firstName
        lastName
        avatar
      }
      comments {
        id
        text
        userId
        createdAt
      }
      likes {
        id
        userId
      }
    }
  }
`;
