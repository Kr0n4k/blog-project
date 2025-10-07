interface Comment {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
  user?: {
    userName: string;
  };
}

interface Like {
  id: string;
  userId: string;
}

interface PostUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  text?: string;
  userId: string;
  createdAt: string;
  videos?: string[];
  photos?: string[];
  user?: PostUser;
  comments?: Comment[];
  likes?: Like[];
}

export interface GetRandomPostsData {
  getRandomPosts: Post[];
}