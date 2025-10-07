import { gql } from "@apollo/client";

export const GET_RANDOM_POSTS = gql/* GraphQL */`
  query GetRandomPosts {
    getRandomPosts {
      id
      title
      text
      userId
      videos
      photos
      createdAt
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
`