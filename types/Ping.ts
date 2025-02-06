export interface Ping {
  createdAt: string;
  timestamp: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
}
