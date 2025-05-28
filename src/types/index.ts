export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  userId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  videoId: string;
  createdAt: string;
  user?: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  joinDate: string;
}

export interface AuthUser {
  id: string;
  email: string;
}