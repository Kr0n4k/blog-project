import { gql } from "@apollo/client";

export const GET_USER_POSTS = gql`
  query GetUserPosts($id: String!) {
    getUserPosts(id: $id) {
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
`;
