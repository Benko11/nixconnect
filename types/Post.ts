import Author from "./Author";
import Comment from "./Comment";
import { Ping } from "./Ping";

export interface Post {
  id: string;
  author: Author;
  content: string;
  avatarUrl?: string;
  timestamp: string;
  createdAt: string;
  pings: Ping[];
  comments: Comment[];
}
