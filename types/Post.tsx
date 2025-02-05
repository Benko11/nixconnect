export interface Post {
  id: string;
  author: string;
  content: { __html: string | Promise<string> };
  timestamp: string;
  createdAt: string;
}
