export interface Ping {
  createdAt: string;
  timestamp: string;
  author: {
    nickname: string;
    avatarUrl?: string;
  };
}
