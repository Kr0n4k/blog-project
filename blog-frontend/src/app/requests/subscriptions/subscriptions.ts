import { gql } from "@apollo/client";

// Подписка на новые лайки
export const LIKE_ADDED_SUBSCRIPTION = gql`
  subscription LikeAdded($postId: String!) {
    likeAdded(postId: $postId) {
      id
      userId
      postId
      createdAt
    }
  }
`;

// Подписка на новые комментарии
export const COMMENT_ADDED_SUBSCRIPTION = gql`
  subscription CommentAdded($postId: String!) {
    commentAdded(postId: $postId) {
      id
      text
      userId
      postId
      createdAt
      updatedAt
    }
  }
`;

// Подписка на обновления комментариев
export const COMMENT_UPDATED_SUBSCRIPTION = gql`
  subscription CommentUpdated($postId: String!) {
    commentUpdated(postId: $postId) {
      id
      text
      userId
      postId
      createdAt
      updatedAt
    }
  }
`;

// Подписка на удаление комментариев
export const COMMENT_DELETED_SUBSCRIPTION = gql`
  subscription CommentDeleted($postId: String!) {
    commentDeleted(postId: $postId) {
      id
      userId
      postId
    }
  }
`;

// Подписка на обновления поста (включая лайки и комментарии)
export const POST_UPDATED_SUBSCRIPTION = gql`
  subscription PostUpdated($postId: String!) {
    postUpdated(postId: $postId) {
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
