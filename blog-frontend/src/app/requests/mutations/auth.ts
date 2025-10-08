// auth.ts
import { gql } from "@apollo/client";

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const REGISTER_MUTATION = gql`
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      firstName
      lastName
      userName
      email
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      user {
        email
      }
    }
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: String!) {
    likePost(postId: $postId) {
      id
      userId
      postId
      createdAt
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($postId: String!, $text: String!) {
    createComment(postId: $postId, text: $text) {
      id
      userId
      postId
      text
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($commentId: String!, $text: String!) {
    updateComment(commentId: $commentId, text: $text) {
      id
      userId
      postId
      text
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($commentId: String!) {
    deleteComment(commentId: $commentId) {
      id
      userId
      postId
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($bio: String, $avatar: String) {
    updateProfile(bio: $bio, avatar: $avatar) {
      id
      bio
      avatar
      firstName
      lastName
      userName
      email
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($data: CreatePostInput!) {
    createPost(data: $data) {
      id
      title
      text
      userId
      photos
      videos
      createdAt
      comments { id text userId createdAt }
      likes { id userId }
    }
  }
`;